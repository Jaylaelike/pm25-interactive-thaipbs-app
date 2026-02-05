// Thailand timezone utilities (UTC+7)

export const THAILAND_TIMEZONE = 'Asia/Bangkok';
export const THAILAND_OFFSET_HOURS = 7;

/**
 * Convert UTC date to Thailand timezone (UTC+7)
 */
export function toThailandTime(date: Date): Date {
  return new Date(date.getTime() + (THAILAND_OFFSET_HOURS * 60 * 60 * 1000));
}

/**
 * Convert Thailand time to UTC
 */
export function fromThailandTime(date: Date): Date {
  return new Date(date.getTime() - (THAILAND_OFFSET_HOURS * 60 * 60 * 1000));
}

/**
 * Format date for Thailand timezone display
 */
export function formatThailandDateTime(date: Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: THAILAND_TIMEZONE,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    ...options
  };
  
  return date.toLocaleString('th-TH', defaultOptions);
}

/**
 * Format date for Thailand timezone display (short format)
 */
export function formatThailandDateTimeShort(date: Date): string {
  return formatThailandDateTime(date, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get current Thailand time
 */
export function getNowInThailand(): Date {
  return new Date(new Date().toLocaleString("en-US", { timeZone: THAILAND_TIMEZONE }));
}

/**
 * Format date for InfluxDB query (ISO string in UTC)
 */
export function formatForInfluxDB(date: Date): string {
  return date.toISOString();
}

/**
 * Create date from Thailand timezone input
 */
export function createThailandDate(year: number, month: number, day: number, hour: number = 0, minute: number = 0): Date {
  // Create date in Thailand timezone
  const thailandDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
  const thailandDate = new Date(thailandDateStr);
  
  // Convert to UTC for storage/API calls
  return fromThailandTime(thailandDate);
}

/**
 * Parse date string in Thailand timezone
 */
export function parseThailandDateTime(dateStr: string, timeStr: string): Date {
  const combinedStr = `${dateStr}T${timeStr}:00`;
  const localDate = new Date(combinedStr);
  
  // Adjust for Thailand timezone offset
  return fromThailandTime(localDate);
}

/**
 * Format date for HTML input (date)
 */
export function formatDateForInput(date: Date): string {
  const thailandDate = toThailandTime(date);
  return thailandDate.toISOString().split('T')[0];
}

/**
 * Format time for HTML input (time)
 */
export function formatTimeForInput(date: Date): string {
  const thailandDate = toThailandTime(date);
  return thailandDate.toTimeString().slice(0, 5);
}

/**
 * Get time ranges relative to Thailand timezone
 */
export function getThailandTimeRanges() {
  const now = getNowInThailand();
  
  return {
    last1Hour: {
      start: new Date(now.getTime() - 60 * 60 * 1000),
      end: now
    },
    last6Hours: {
      start: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      end: now
    },
    last24Hours: {
      start: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      end: now
    },
    last7Days: {
      start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      end: now
    }
  };
}