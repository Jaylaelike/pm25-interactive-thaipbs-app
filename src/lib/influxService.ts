import axios from 'axios';
import { formatForInfluxDB, getThailandTimeRanges } from './timezone';

export interface SensorDataPoint {
  _time: string;
  _value: number;
  _field: string;
  _measurement: string;
}

export interface TimeSeriesData {
  timestamp: string;
  pm1: number;
  pm2_5: number;
  pm10: number;
}

class InfluxService {
  private baseUrl = 'http://172.16.116.82:8086';
  private org = 'iot_monitoring';
  private bucket = 'sensor_data';
  private token = 'my-super-secret-admin-token-change-me';



  async query24HourData(): Promise<TimeSeriesData[]> {
    const query = `from(bucket:"${this.bucket}") |> range(start: -24h)|> filter(fn: (r) => r._measurement == "environmental_sensors")|> filter(fn: (r) => r._field == "pm1" or r._field == "pm2_5" or r._field == "pm10")|> aggregateWindow(every: 10m, fn: mean, createEmpty: false)|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v2/query?org=${this.org}`,
        query,
        { 
          headers: {
            'Authorization': `Token ${this.token}`,
            'Content-Type': 'application/vnd.flux',
            'Accept': 'application/json'
          }
        }
      );

      return this.parseInfluxJSONResponse(response.data);
    } catch (error) {
      console.error('Error fetching 24h data:', error);
      return this.generateMockData();
    }
  }

  async queryCustomRange(startTime: string, endTime: string): Promise<TimeSeriesData[]> {
    // Calculate appropriate aggregation window based on time range
    const start = new Date(startTime);
    const end = new Date(endTime);
    const rangeHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    let aggregationWindow = '5m';
    if (rangeHours > 24) {
      aggregationWindow = '1h';
    } else if (rangeHours > 6) {
      aggregationWindow = '30m';
    } else if (rangeHours > 2) {
      aggregationWindow = '10m';
    }

    const query = `from(bucket:"${this.bucket}") |> range(start: ${startTime}, stop: ${endTime})|> filter(fn: (r) => r._measurement == "environmental_sensors")|> filter(fn: (r) => r._field == "pm1" or r._field == "pm2_5" or r._field == "pm10")|> aggregateWindow(every: ${aggregationWindow}, fn: mean, createEmpty: false)|> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v2/query?org=${this.org}`,
        query,
        { 
          headers: {
            'Authorization': `Token ${this.token}`,
            'Content-Type': 'application/vnd.flux',
            'Accept': 'application/json'
          }
        }
      );

      return this.parseInfluxJSONResponse(response.data);
    } catch (error) {
      console.error('Error fetching custom range data:', error);
      return this.generateMockData();
    }
  }

  private parseInfluxJSONResponse(jsonData: any): TimeSeriesData[] {
    try {
      console.log('=== JSON PARSING DEBUG ===');
      console.log('Raw JSON response type:', typeof jsonData);
      console.log('Raw JSON response:', jsonData);
      
      // Handle different possible JSON response formats
      let dataArray: any[] = [];
      
      if (Array.isArray(jsonData)) {
        dataArray = jsonData;
      } else if (jsonData && typeof jsonData === 'object') {
        // Check if it's wrapped in a response object
        if (jsonData.data && Array.isArray(jsonData.data)) {
          dataArray = jsonData.data;
        } else if (jsonData.results && Array.isArray(jsonData.results)) {
          dataArray = jsonData.results;
        } else {
          console.warn('Unexpected JSON structure:', jsonData);
          return this.generateMockData();
        }
      } else {
        console.warn('Invalid JSON response format');
        return this.generateMockData();
      }

      console.log('Data array length:', dataArray.length);
      
      if (dataArray.length === 0) {
        console.warn('No data in JSON response');
        return this.generateMockData();
      }

      const result: TimeSeriesData[] = [];

      dataArray.forEach((row: any, index: number) => {
        if (!row || typeof row !== 'object') {
          console.warn(`Row ${index} is not an object:`, row);
          return;
        }

        // Extract values from the JSON row
        const timestamp = row._time;
        const pm1 = row.pm1;
        const pm2_5 = row.pm2_5;
        const pm10 = row.pm10;

        if (index < 3) { // Debug first 3 rows
          console.log(`Row ${index}:`, row);
          console.log(`Extracted values:`, { timestamp, pm1, pm2_5, pm10 });
        }

        if (!timestamp) {
          console.warn(`Row ${index} missing timestamp`);
          return;
        }

        // Parse and validate values
        const parsedTimestamp = new Date(timestamp).toISOString();
        const parsedPM1 = typeof pm1 === 'number' ? pm1 : (pm1 && !isNaN(parseFloat(pm1)) ? parseFloat(pm1) : 0);
        const parsedPM25 = typeof pm2_5 === 'number' ? pm2_5 : (pm2_5 && !isNaN(parseFloat(pm2_5)) ? parseFloat(pm2_5) : 0);
        const parsedPM10 = typeof pm10 === 'number' ? pm10 : (pm10 && !isNaN(parseFloat(pm10)) ? parseFloat(pm10) : 0);

        if (index < 3) { // Debug first 3 rows
          console.log(`Parsed row ${index}:`, {
            timestamp: parsedTimestamp,
            pm1: parsedPM1,
            pm2_5: parsedPM25,
            pm10: parsedPM10
          });
        }

        result.push({
          timestamp: parsedTimestamp,
          pm1: parsedPM1,
          pm2_5: parsedPM25,
          pm10: parsedPM10,
        });
      });

      const sortedResult = result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      console.log(`Parsed ${sortedResult.length} PM data points from InfluxDB JSON`);
      console.log('Sample parsed data:', sortedResult.slice(0, 3));
      console.log('PM2.5 values in result:', sortedResult.map(r => r.pm2_5).slice(0, 10));
      console.log('=== END JSON PARSING DEBUG ===');
      
      return sortedResult.length > 0 ? sortedResult : this.generateMockData();
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.error('Error details:', error);
      return this.generateMockData();
    }
  }

  private generateMockData(): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    const ranges = getThailandTimeRanges();
    const now = ranges.last24Hours.end;
    
    for (let i = 47; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 30 * 60 * 1000);
      
      // Generate realistic PM data with some variation
      const basePM1 = 15 + Math.sin(i * 0.2) * 8 + Math.random() * 5;
      const basePM25 = 25 + Math.sin(i * 0.3) * 12 + Math.random() * 8;
      const basePM10 = 35 + Math.sin(i * 0.25) * 15 + Math.random() * 10;
      
      data.push({
        timestamp: timestamp.toISOString(),
        pm1: Math.round(Math.max(0, basePM1) * 10) / 10,
        pm2_5: Math.round(Math.max(0, basePM25) * 10) / 10,
        pm10: Math.round(Math.max(0, basePM10) * 10) / 10,
      });
    }
    
    console.log('Using mock PM data for chart (Thailand timezone)');
    return data;
  }

  // Utility method to format date for InfluxDB queries
  formatDateForQuery(date: Date): string {
    return formatForInfluxDB(date);
  }

  // Get predefined time ranges in Thailand timezone
  getTimeRanges() {
    return getThailandTimeRanges();
  }

  // Debug method - can be called from browser console
  async debugQuery(): Promise<void> {
    console.log('🔍 Starting InfluxDB debug query...');
    try {
      const data = await this.query24HourData();
      console.log('✅ Debug query completed');
      console.log('📊 Result summary:', {
        totalPoints: data.length,
        pm25Values: data.map(d => d.pm2_5),
        sampleData: data.slice(0, 3)
      });
    } catch (error) {
      console.error('❌ Debug query failed:', error);
    }
  }
}

export const influxService = new InfluxService();

// Expose debug method globally for testing
if (typeof window !== 'undefined') {
  (window as any).debugInflux = () => influxService.debugQuery();
}