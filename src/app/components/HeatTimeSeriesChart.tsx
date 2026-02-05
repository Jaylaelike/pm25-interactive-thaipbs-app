"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { Loader2, Calendar, RefreshCw, TrendingUp, Settings } from 'lucide-react';
import { useTimeSeriesData, TimeRange, getTimeRangeLabel, getDataSummary } from '@/lib/useTimeSeriesData';
import DateTimeRangePicker, { DateTimeRange } from './DateTimeRangePicker';
import { formatThailandDateTimeShort } from '@/lib/timezone';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface HeatTimeSeriesChartProps {
  className?: string;
}

const HeatTimeSeriesChart: React.FC<HeatTimeSeriesChartProps> = ({ className = '' }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const {
    data,
    loading,
    error,
    selectedRange,
    customRange,
    lastUpdated,
    setTimeRange,
    refresh,
    isRefreshing
  } = useTimeSeriesData({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    initialRange: '24h'
  });

  const handleRangeChange = (range: TimeRange) => {
    if (range === 'custom') {
      setShowDatePicker(true);
    } else {
      setTimeRange(range);
    }
  };

  const handleCustomRangeApply = (range: DateTimeRange) => {
    setTimeRange('custom', range);
    setShowDatePicker(false);
  };

  const handleRefresh = () => {
    refresh();
  };

  // Prepare chart data for PM measurements
  const chartData = React.useMemo(() => {
    console.log('🎯 Chart data preparation - received data:', data.length, 'points');
    
    if (!data.length) {
      console.log('❌ No data available for chart');
      return { series: [], categories: [] };
    }

    console.log('📊 Sample data points:', data.slice(0, 3));
    console.log('🔍 PM2.5 values from data:', data.map(item => item.pm2_5).slice(0, 10));

    const categories = data.map(item => new Date(item.timestamp).getTime());

    const pm25Series = data.map(item => ({ 
      x: new Date(item.timestamp).getTime(), 
      y: item.pm2_5 
    }));
    
    console.log('📈 PM2.5 series data:', pm25Series.slice(0, 5));

    const series = [
      {
        name: 'PM1.0 (μg/m³)',
        data: data.map(item => ({ x: new Date(item.timestamp).getTime(), y: item.pm1 })),
        color: '#10b981' // Green
      },
      {
        name: 'PM2.5 (μg/m³)',
        data: pm25Series,
        color: '#f59e0b' // Orange
      },
      {
        name: 'PM10 (μg/m³)',
        data: data.map(item => ({ x: new Date(item.timestamp).getTime(), y: item.pm10 })),
        color: '#ef4444' // Red
      }
    ];

    console.log('✅ Chart series prepared:', series.map(s => ({ 
      name: s.name, 
      dataPoints: s.data.length,
      sampleValues: s.data.slice(0, 3).map(d => d.y)
    })));

    return {
      series,
      categories
    };
  }, [data]);

  const chartOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 400,
      background: 'transparent',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    theme: {
      mode: 'dark'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.1)',
      strokeDashArray: 3
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#e5e7eb'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm'
        },
        datetimeUTC: false // Use local timezone (Thailand)
      },
      axisBorder: {
        color: 'rgba(255, 255, 255, 0.2)'
      },
      axisTicks: {
        color: 'rgba(255, 255, 255, 0.2)'
      }
    },
    yaxis: {
      title: {
        text: 'ความเข้มข้นฝุ่น (μg/m³)',
        style: {
          color: '#e5e7eb'
        }
      },
      labels: {
        style: {
          colors: '#e5e7eb'
        }
      },
      axisBorder: {
        show: true,
        color: 'rgba(255, 255, 255, 0.2)'
      }
    },
    tooltip: {
      theme: 'dark',
      shared: true,
      intersect: false,
      x: {
        format: 'dd MMM yyyy HH:mm',
        formatter: function(value: number) {
          const date = new Date(value);
          return formatThailandDateTimeShort(date) + ' (UTC+7)';
        }
      },
      y: {
        formatter: (value: number) => {
          return `${value.toFixed(1)} μg/m³`;
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      labels: {
        colors: '#e5e7eb'
      }
    },
    markers: {
      size: 0,
      hover: {
        size: 6
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: undefined,
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.1,
        stops: [0, 100]
      }
    }
  };

  const timeRangeButtons = [
    { key: '1h' as TimeRange, label: '1 ชั่วโมง' },
    { key: '6h' as TimeRange, label: '6 ชั่วโมง' },
    { key: '24h' as TimeRange, label: '24 ชั่วโมง' },
    { key: '7d' as TimeRange, label: '7 วัน' },
    { key: 'custom' as TimeRange, label: 'กำหนดเอง', icon: Settings }
  ];

  const dataSummary = getDataSummary(data);

  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-150 mb-2 flex items-center">
            <Calendar className="mr-2" size={24} />
            กราฟแสดงแนวโน้มฝุ่น PM
          </h3>
          <p className="text-gray-300 text-sm">
            {lastUpdated ? `อัปเดตล่าสุด: ${formatThailandDateTimeShort(lastUpdated)} (UTC+7)` : 'กำลังโหลด...'}
          </p>
          {error && (
            <p className="text-red-400 text-sm mt-1">
              ⚠️ {error}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={(loading || isRefreshing) ? 'animate-spin' : ''} />
            {isRefreshing ? 'กำลังรีเฟรช...' : 'รีเฟรช'}
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeRangeButtons.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => handleRangeChange(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedRange === key
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {Icon && <Icon size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* Custom Range Display */}
      {selectedRange === 'custom' && customRange && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-sm">
            📅 ช่วงเวลาที่เลือก: {formatThailandDateTimeShort(customRange.start)} - {formatThailandDateTimeShort(customRange.end)} (UTC+7)
          </p>
        </div>
      )}

      {/* Chart */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg z-10">
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        )}
        
        {chartData.series.length > 0 ? (
          <Chart
            options={chartOptions}
            series={chartData.series}
            type="line"
            height={400}
          />
        ) : (
          !loading && (
            <div className="flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p>ไม่มีข้อมูลในช่วงเวลาที่เลือก</p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Data Summary */}
      {data.length > 0 && !loading && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={20} className="text-gray-300" />
            <h4 className="text-lg font-semibold text-gray-150">
              สรุปข้อมูลฝุ่น PM ({getTimeRangeLabel(selectedRange)})
            </h4>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/20">
              <div className="text-green-400 font-bold text-xl mb-1">
                {Math.max(...data.map(d => d.pm1)).toFixed(1)}
              </div>
              <div className="text-gray-300 text-sm mb-2">PM1.0 สูงสุด</div>
              <div className="text-gray-400 text-xs">
                เฉลี่ย: {(data.reduce((sum, d) => sum + d.pm1, 0) / data.length).toFixed(1)} μg/m³
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg p-4 border border-orange-500/20">
              <div className="text-orange-400 font-bold text-xl mb-1">
                {Math.max(...data.map(d => d.pm2_5)).toFixed(1)}
              </div>
              <div className="text-gray-300 text-sm mb-2">PM2.5 สูงสุด</div>
              <div className="text-gray-400 text-xs">
                เฉลี่ย: {(data.reduce((sum, d) => sum + d.pm2_5, 0) / data.length).toFixed(1)} μg/m³
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-lg p-4 border border-red-500/20">
              <div className="text-red-400 font-bold text-xl mb-1">
                {Math.max(...data.map(d => d.pm10)).toFixed(1)}
              </div>
              <div className="text-gray-300 text-sm mb-2">PM10 สูงสุด</div>
              <div className="text-gray-400 text-xs">
                เฉลี่ย: {(data.reduce((sum, d) => sum + d.pm10, 0) / data.length).toFixed(1)} μg/m³
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Time Range Picker Modal */}
      <DateTimeRangePicker
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onApply={handleCustomRangeApply}
        initialRange={customRange || undefined}
      />
    </div>
  );
};

export default HeatTimeSeriesChart;