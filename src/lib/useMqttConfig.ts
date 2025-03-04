"use client";

import { useState, useEffect } from 'react';

interface MqttConfig {
  id: string;
  mqttUrl: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function useMqttConfig() {
  const [mqttUrl, setMqttUrl] = useState<string>("ws://172.16.202.63:8083/mqtt");
  const [location, setLocation] = useState<string>("อาคาร A Thaipbs");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the MQTT configuration from the API
  const fetchMqttConfig = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mqtt-config');
      
      if (!response.ok) {
        throw new Error('Failed to fetch MQTT configuration');
      }
      
      const data: MqttConfig = await response.json();
      setMqttUrl(data.mqttUrl);
      setLocation(data.location);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching MQTT config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update the MQTT configuration
  const updateMqttConfig = async (newMqttUrl: string, newLocation?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/mqtt-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mqttUrl: newMqttUrl,
          ...(newLocation && { location: newLocation })
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update MQTT configuration');
      }
      
      const data: MqttConfig = await response.json();
      setMqttUrl(data.mqttUrl);
      setLocation(data.location);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error updating MQTT config:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load the MQTT configuration on component mount
  useEffect(() => {
    fetchMqttConfig();
  }, []);

  return {
    mqttUrl,
    location,
    isLoading,
    error,
    updateMqttConfig,
    refreshConfig: fetchMqttConfig
  };
}