"use client";

import { useState, useEffect, useCallback } from 'react';
import { influxService, TimeSeriesData } from './influxService';
import { formatThailandDateTime, getNowInThailand } from './timezone';

export type TimeRange = '1h' | '6h' | '24h' | '7d' | 'custom';

export interface CustomTimeRange {
  start: Date;
  end: Date;
}

export interface UseTimeSeriesDataOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
  initialRange?: TimeRange;
}

export interface UseTimeSeriesDataReturn {
  data: TimeSeriesData[];
  loading: boolean;
  error: string | null;
  selectedRange: TimeRange;
  customRange: CustomTimeRange | null;
  lastUpdated: Date | null;
  setTimeRange: (range: TimeRange, customRange?: CustomTimeRange) => void;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
}

export const useTimeSeriesData = (
  options: UseTimeSeriesDataOptions = {}
): UseTimeSeriesDataReturn => {
  const {
    autoRefresh = true,
    refreshInterval = 5 * 60 * 1000, // 5 minutes
    initialRange = '24h'
  } = options;

  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange);
  const [customRange, setCustomRange] = useState<CustomTimeRange | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (
    range: TimeRange = selectedRange,
    customTimeRange: CustomTimeRange | null = customRange
  ) => {
    const isInitialLoad = !lastUpdated;
    
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    setError(null);

    try {
      let timeSeriesData: TimeSeriesData[];

      if (range === 'custom' && customTimeRange) {
        timeSeriesData = await influxService.queryCustomRange(
          influxService.formatDateForQuery(customTimeRange.start),
          influxService.formatDateForQuery(customTimeRange.end)
        );
      } else {
        const ranges = influxService.getTimeRanges();
        
        switch (range) {
          case '1h':
            const range1h = ranges.last1Hour;
            timeSeriesData = await influxService.queryCustomRange(
              influxService.formatDateForQuery(range1h.start),
              influxService.formatDateForQuery(range1h.end)
            );
            break;
          case '6h':
            const range6h = ranges.last6Hours;
            timeSeriesData = await influxService.queryCustomRange(
              influxService.formatDateForQuery(range6h.start),
              influxService.formatDateForQuery(range6h.end)
            );
            break;
          case '24h':
            timeSeriesData = await influxService.query24HourData();
            break;
          case '7d':
            const range7d = ranges.last7Days;
            timeSeriesData = await influxService.queryCustomRange(
              influxService.formatDateForQuery(range7d.start),
              influxService.formatDateForQuery(range7d.end)
            );
            break;
          default:
            timeSeriesData = await influxService.query24HourData();
        }
      }

      setData(timeSeriesData);
      setLastUpdated(getNowInThailand());
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching time series data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedRange, customRange, lastUpdated]);

  const setTimeRange = useCallback((
    range: TimeRange,
    customTimeRange?: CustomTimeRange
  ) => {
    setSelectedRange(range);
    if (range === 'custom' && customTimeRange) {
      setCustomRange(customTimeRange);
    } else {
      setCustomRange(null);
    }
    fetchData(range, customTimeRange || null);
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    selectedRange,
    customRange,
    lastUpdated,
    setTimeRange,
    refresh,
    isRefreshing
  };
};

// Utility functions for date formatting and manipulation
export const formatDateForDisplay = (date: Date): string => {
  return formatThailandDateTime(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeRangeLabel = (range: TimeRange): string => {
  switch (range) {
    case '1h':
      return '1 ชั่วโมงที่ผ่านมา';
    case '6h':
      return '6 ชั่วโมงที่ผ่านมา';
    case '24h':
      return '24 ชั่วโมงที่ผ่านมา';
    case '7d':
      return '7 วันที่ผ่านมา';
    case 'custom':
      return 'ช่วงเวลาที่กำหนด';
    default:
      return '24 ชั่วโมงที่ผ่านมา';
  }
};

export const getDataSummary = (data: TimeSeriesData[]) => {
  if (!data.length) {
    return {
      maxPM1: 0,
      minPM1: 0,
      avgPM1: 0,
      maxPM25: 0,
      minPM25: 0,
      avgPM25: 0,
      maxPM10: 0,
      minPM10: 0,
      avgPM10: 0
    };
  }

  const pm1Values = data.map(d => d.pm1);
  const pm25Values = data.map(d => d.pm2_5);
  const pm10Values = data.map(d => d.pm10);

  return {
    maxPM1: Math.max(...pm1Values),
    minPM1: Math.min(...pm1Values),
    avgPM1: pm1Values.reduce((a, b) => a + b, 0) / pm1Values.length,
    maxPM25: Math.max(...pm25Values),
    minPM25: Math.min(...pm25Values),
    avgPM25: pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length,
    maxPM10: Math.max(...pm10Values),
    minPM10: Math.min(...pm10Values),
    avgPM10: pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length
  };
};