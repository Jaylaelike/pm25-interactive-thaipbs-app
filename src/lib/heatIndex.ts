/**
 * Heat Index Risk Level
 */
export enum HeatIndexLevel {
  NORMAL = 'NORMAL',        // ปกติ
  CAUTION = 'CAUTION',      // ระวัง
  DANGER = 'DANGER',        // อันตราย
  EXTREME = 'EXTREME'       // อันตรายมาก
}

/**
 * Heat Index Result Interface
 */
export interface HeatIndexResult {
  heatIndex: number;
  level: HeatIndexLevel;
  levelText: string;
  recommendation: string;
  color: string;
  bgColor: string;
}

/**
 * Calculate Heat Index using the simplified formula
 * @param temperature Temperature in Celsius
 * @param humidity Relative humidity in percentage (0-100)
 * @returns Heat Index Result
 */
export function calculateHeatIndex(temperature: number, humidity: number): HeatIndexResult {
  // Input validation
  if (temperature < 0 || temperature > 60) {
    throw new Error('Temperature must be between 0-60°C');
  }
  
  if (humidity < 0 || humidity > 100) {
    throw new Error('Humidity must be between 0-100%');
  }

  // Convert to Fahrenheit for calculation (standard Heat Index formula uses Fahrenheit)
  const tempF = (temperature * 9/5) + 32;
  
  let heatIndexF: number;

  // Simple formula for low heat index
  if (tempF < 80) {
    heatIndexF = tempF;
  } else {
    // Rothfusz regression equation (simplified version)
    const c1 = -42.379;
    const c2 = 2.04901523;
    const c3 = 10.14333127;
    const c4 = -0.22475541;
    const c5 = -0.00683783;
    const c6 = -0.05481717;
    const c7 = 0.00122874;
    const c8 = 0.00085282;
    const c9 = -0.00000199;

    heatIndexF = c1 + 
                 (c2 * tempF) + 
                 (c3 * humidity) + 
                 (c4 * tempF * humidity) + 
                 (c5 * tempF * tempF) + 
                 (c6 * humidity * humidity) + 
                 (c7 * tempF * tempF * humidity) + 
                 (c8 * tempF * humidity * humidity) + 
                 (c9 * tempF * tempF * humidity * humidity);

    // Adjustments for low humidity
    if (humidity < 13 && tempF >= 80 && tempF <= 112) {
      const adjustment = ((13 - humidity) / 4) * Math.sqrt((17 - Math.abs(tempF - 95)) / 17);
      heatIndexF -= adjustment;
    }
    
    // Adjustments for high humidity
    if (humidity > 85 && tempF >= 80 && tempF <= 87) {
      const adjustment = ((humidity - 85) / 10) * ((87 - tempF) / 5);
      heatIndexF += adjustment;
    }
  }

  // Convert back to Celsius
  const heatIndexC = (heatIndexF - 32) * 5/9;

  return {
    heatIndex: Math.round(heatIndexC * 10) / 10, // Round to 1 decimal place
    ...getHeatIndexLevel(heatIndexC)
  };
}

/**
 * Alternative calculation using lookup table method (based on Thai guidelines)
 * @param temperature Temperature in Celsius
 * @param humidity Relative humidity in percentage
 * @returns Heat Index Result
 */
export function calculateHeatIndexTable(temperature: number, humidity: number): HeatIndexResult {
  // Input validation
  if (temperature < 27 || temperature > 51) {
    throw new Error('Temperature must be between 27-51°C for table lookup');
  }
  
  if (humidity < 40 || humidity > 100) {
    throw new Error('Humidity must be between 40-100% for table lookup');
  }

  // Simplified table-based calculation
  // This is an approximation based on the heat index characteristics
  let heatIndex = temperature;
  
  // Base adjustment for humidity
  if (humidity > 50) {
    const humidityFactor = (humidity - 50) / 50; // 0 to 1 scale
    const temperatureFactor = (temperature - 27) / 24; // 0 to 1 scale for 27-51°C range
    
    // Heat index increases more dramatically at higher temperatures and humidity
    const adjustment = humidityFactor * temperatureFactor * (temperature * 0.3);
    heatIndex += adjustment;
  }

  return {
    heatIndex: Math.round(heatIndex * 10) / 10,
    ...getHeatIndexLevel(heatIndex)
  };
}

/**
 * Determine heat index risk level and recommendations
 * @param heatIndex Heat index in Celsius
 * @returns Risk level information
 */
function getHeatIndexLevel(heatIndex: number): Omit<HeatIndexResult, 'heatIndex'> {
  if (heatIndex < 32) {
    return {
      level: HeatIndexLevel.NORMAL,
      levelText: 'ปกติ (Normal)',
      recommendation: 'สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ',
      color: '#10b981', // green-500
      bgColor: 'bg-green-500'
    };
  } else if (heatIndex < 40) {
    return {
      level: HeatIndexLevel.CAUTION,
      levelText: 'ระวัง (Caution)',
      recommendation: 'ระมัดระวังเมื่อทำกิจกรรมกลางแจ้ง ดื่มน้ำเพิ่มเติม หลีกเลี่ยงแสงแดดจัด',
      color: '#eab308', // yellow-500
      bgColor: 'bg-yellow-500'
    };
  } else if (heatIndex < 52) {
    return {
      level: HeatIndexLevel.DANGER,
      levelText: 'อันตราย (Danger)',
      recommendation: 'หลีกเลี่ยงกิจกรรมกลางแจ้งช่วงกลางวัน พักผ่อนในที่ร่ม ดื่มน้ำบ่อยๆ',
      color: '#f97316', // orange-500
      bgColor: 'bg-orange-500'
    };
  } else {
    return {
      level: HeatIndexLevel.EXTREME,
      levelText: 'อันตรายมาก (Extreme Danger)',
      recommendation: 'อยู่ในที่ร่มและมีแอร์ ไม่ออกกำลังกายกลางแจ้ง เสี่ยงต่อโรคลมแดด',
      color: '#ef4444', // red-500
      bgColor: 'bg-red-500'
    };
  }
}

// Example usage and testing
export function demonstrateHeatIndex(): void {
  console.log('=== Heat Index Calculator Demo ===\n');

  const testCases = [
    { temp: 30, humidity: 60 },
    { temp: 35, humidity: 70 },
    { temp: 37, humidity: 80 },
    { temp: 40, humidity: 90 },
    { temp: 45, humidity: 95 }
  ];

  testCases.forEach(({ temp, humidity }) => {
    try {
      const result = calculateHeatIndex(temp, humidity);
      const tableResult = calculateHeatIndexTable(temp, humidity);
      
      console.log(`อุณหภูมิ: ${temp}°C, ความชื้น: ${humidity}%`);
      console.log(`Heat Index (Formula): ${result.heatIndex}°C - ${result.levelText}`);
      console.log(`Heat Index (Table): ${tableResult.heatIndex}°C - ${tableResult.levelText}`);
      console.log(`คำแนะนำ: ${result.recommendation}`);
      console.log('---');
    } catch (error) {
      console.error(`Error calculating for ${temp}°C, ${humidity}%:`, (error as Error).message);
    }
  });
}
