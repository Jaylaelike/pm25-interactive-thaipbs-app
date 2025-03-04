import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/mqtt-config
export async function GET() {
  try {
    // Get the first config or create a default one if none exists
    let config = await prisma.mqttConfig.findFirst();
    
    if (!config) {
      config = await prisma.mqttConfig.create({
        data: {
          mqttUrl: "ws://172.16.202.63:8083/mqtt",
          location: "อาคาร A Thaipbs"
        }
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching MQTT config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch MQTT configuration' },
      { status: 500 }
    );
  }
}

// POST /api/mqtt-config
export async function POST(request: NextRequest) {
  try {
    const { mqttUrl, location } = await request.json();
    
    if (!mqttUrl) {
      return NextResponse.json(
        { error: 'MQTT URL is required' },
        { status: 400 }
      );
    }
    
    // Get the first config or create a new one if none exists
    const existingConfig = await prisma.mqttConfig.findFirst();
    
    let config;
    if (existingConfig) {
      // Update existing config
      config = await prisma.mqttConfig.update({
        where: { id: existingConfig.id },
        data: { 
          mqttUrl,
          ...(location && { location })
        }
      });
    } else {
      // Create new config
      config = await prisma.mqttConfig.create({
        data: { 
          mqttUrl,
          location: location || "อาคาร A Thaipbs"
        }
      });
    }
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error updating MQTT config:', error);
    return NextResponse.json(
      { error: 'Failed to update MQTT configuration' },
      { status: 500 }
    );
  }
}