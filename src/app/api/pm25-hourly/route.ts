export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface HourlyDataPoint {
    time: string;
    value: number;
    isCurrent?: boolean;
}

interface InfluxDataRow {
    _time: string;
    _value: number;
    _field: string;
}

// Parse InfluxDB CSV response
function parseInfluxCSV(csvData: string): InfluxDataRow[] {
    const lines = csvData.trim().split('\n');
    console.log(`[pm25-hourly] Total lines in CSV: ${lines.length}`);

    if (lines.length < 2) {
        console.log('[pm25-hourly] No data rows found');
        return [];
    }

    const rows: InfluxDataRow[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.trim()) continue;

        // Skip header lines (contain column names)
        if (line.includes('_start') && line.includes('_stop') && line.includes('_time')) {
            console.log(`[pm25-hourly] Skipping header line ${i}`);
            continue;
        }

        // Skip annotation lines
        if (line.startsWith('#') || line.startsWith(',result,table')) {
            continue;
        }

        // CSV format: ,result,table,_start,_stop,_time,_value,_field,_measurement,...
        // Index:       0     1    2      3     4     5      6       7
        const columns = line.split(',');
        if (columns.length < 8) {
            continue;
        }

        const _time = columns[5];
        const _value = parseFloat(columns[6]);
        const _field = columns[7];

        // Skip if this looks like a header row
        if (_time === '_time' || _field === '_field') {
            continue;
        }

        if (_time && !isNaN(_value) && _field) {
            rows.push({ _time, _value, _field });
        }
    }

    console.log(`[pm25-hourly] Parsed ${rows.length} data rows`);
    if (rows.length > 0) {
        console.log(`[pm25-hourly] Sample data:`, rows.slice(-3));
    }

    return rows;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const hours = parseInt(searchParams.get('hours') || '4', 10);

        console.log(`[pm25-hourly] Fetching data for ${hours} periods`);

        // InfluxDB configuration
        const baseUrl = 'http://172.16.116.82:8086';
        const org = 'iot_monitoring';
        const token = 'my-super-secret-admin-token-change-me';

        // Flux query to get PM2.5 data aggregated every 1 hour for the last 24 hours
        const query = `from(bucket: "sensor_data")
  |> range(start: -24d)
  |> filter(fn: (r) => r["_measurement"] == "environmental_sensors")
  |> filter(fn: (r) => r["_field"] == "pm2_5")
  |> filter(fn: (r) => r["sensor_id"] == "default")
  |> aggregateWindow(every: 7d, fn: mean, createEmpty: false)
  |> yield(name: "mean")`;

        console.log(`[pm25-hourly] InfluxDB URL: ${baseUrl}/api/v2/query?org=${org}`);

        const response = await fetch(
            `${baseUrl}/api/v2/query?org=${org}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/vnd.flux',
                    'Accept': 'text/csv'
                },
                body: query,
                cache: 'no-store'
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[pm25-hourly] InfluxDB query failed:', response.status, response.statusText, errorText);
            return NextResponse.json(
                { error: 'Failed to fetch data from InfluxDB', details: errorText },
                { status: 500 }
            );
        }

        const csvData = await response.text();
        console.log(`[pm25-hourly] Received ${csvData.length} bytes from InfluxDB`);

        const rows = parseInfluxCSV(csvData);

        // Sort by time and get the most recent periods
        const sortedRows = rows
            .filter(r => r._field === 'pm2_5')
            .sort((a, b) => new Date(b._time).getTime() - new Date(a._time).getTime())
            .slice(0, hours);

        console.log(`[pm25-hourly] Selected ${sortedRows.length} periods`);

        // Create result array (reverse to show oldest first)
        const now = new Date();

        const hourlyData: HourlyDataPoint[] = sortedRows.reverse().map((row, index) => {
            const rowDate = new Date(row._time);
            const avgValue = Math.round(row._value);

            // Format date and time for display (Thai timezone)
            const thaiDateTime = rowDate.toLocaleString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Bangkok'
            });

            // Check if this is the most recent period
            const isCurrent = index === sortedRows.length - 1;

            return {
                time: isCurrent ? 'ล่าสุด' : thaiDateTime,
                value: avgValue,
                isCurrent
            };
        });

        console.log(`[pm25-hourly] Returning ${hourlyData.length} data points:`, hourlyData);

        return NextResponse.json({
            data: hourlyData,
            updatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('[pm25-hourly] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
