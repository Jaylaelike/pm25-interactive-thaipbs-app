"use client";

import { useState, useEffect, useCallback } from 'react';
import { getApiPath } from './utils';

export interface HourlyDataPoint {
    time: string;
    value: number;
    isCurrent?: boolean;
}

export interface UsePM25HourlyDataReturn {
    data: HourlyDataPoint[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    refresh: () => Promise<void>;
}

export const usePM25HourlyData = (
    hours: number = 4,
    autoRefreshInterval: number = 3 * 60 * 1000 // 3 minutes
): UsePM25HourlyDataReturn => {
    const [data, setData] = useState<HourlyDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);

            const apiUrl = getApiPath(`/api/pm25-hourly?hours=${hours}`);
            console.log('Fetching PM 2.5 hourly data from:', apiUrl);

            const response = await fetch(apiUrl, {
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API error response:', errorData);
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('PM 2.5 hourly API response:', result);

            if (result.data && Array.isArray(result.data)) {
                setData(result.data);
                setLastUpdated(new Date(result.updatedAt));
            } else if (result.error) {
                throw new Error(result.error);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Error fetching PM 2.5 hourly data:', err);
        } finally {
            setLoading(false);
        }
    }, [hours]);

    const refresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Auto-refresh
    useEffect(() => {
        if (autoRefreshInterval <= 0) return;

        const interval = setInterval(() => {
            fetchData();
        }, autoRefreshInterval);

        return () => clearInterval(interval);
    }, [autoRefreshInterval, fetchData]);

    return {
        data,
        loading,
        error,
        lastUpdated,
        refresh
    };
};
