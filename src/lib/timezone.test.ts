// Simple test file to verify timezone functionality
// This is for development testing only

import { 
  toThailandTime, 
  fromThailandTime, 
  formatThailandDateTime, 
  getNowInThailand,
  parseThailandDateTime,
  formatDateForInput,
  formatTimeForInput
} from './timezone';

// Test timezone conversion
export function testTimezoneConversion() {
  console.log('=== Thailand Timezone Test ===');
  
  const utcDate = new Date('2025-12-12T12:00:00.000Z'); // UTC noon
  const thailandDate = toThailandTime(utcDate);
  
  console.log('UTC Date:', utcDate.toISOString());
  console.log('Thailand Date (UTC+7):', thailandDate.toISOString());
  console.log('Formatted Thailand:', formatThailandDateTime(utcDate));
  
  // Test current time
  const nowThailand = getNowInThailand();
  console.log('Current Thailand Time:', formatThailandDateTime(nowThailand));
  
  // Test parsing
  const parsed = parseThailandDateTime('2025-12-12', '19:00');
  console.log('Parsed Thailand DateTime:', parsed.toISOString());
  
  // Test input formatting
  console.log('Date for input:', formatDateForInput(nowThailand));
  console.log('Time for input:', formatTimeForInput(nowThailand));
  
  console.log('=== Test Complete ===');
}

// Uncomment to run test in browser console
// testTimezoneConversion();