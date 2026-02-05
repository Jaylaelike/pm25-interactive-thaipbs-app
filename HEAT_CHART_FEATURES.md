# PM (Particulate Matter) Time Series Chart Features

## 🚀 New Features Added

### 1. Beautiful Line Chart for 24-Hour PM Data
- **ApexCharts Integration**: Smooth, responsive line charts with gradient fills
- **Real-time Data**: Auto-refreshes every 5 minutes from InfluxDB
- **PM Metrics**: PM1.0, PM2.5, and PM10 tracking
- **Dark Theme**: Optimized for the existing dark UI

### 2. InfluxDB Integration
- **Service Layer**: `src/lib/influxService.ts` for data fetching
- **Flexible Queries**: Support for custom time ranges
- **Error Handling**: Graceful fallback to mock data
- **Data Aggregation**: 30-minute intervals for optimal performance

### 3. Time Range Selection
- **Predefined Ranges**: 1h, 6h, 24h, 7d options
- **Custom Range Picker**: Full date/time selection modal
- **Smart Validation**: Prevents future dates and excessive ranges
- **Quick Select**: Common time ranges with one click

### 4. Advanced Data Management
- **Custom Hook**: `useTimeSeriesData` for state management
- **Auto-refresh**: Configurable refresh intervals
- **Loading States**: Proper loading and refreshing indicators
- **Error Handling**: User-friendly error messages

### 5. Data Visualization Features
- **Interactive Charts**: Zoom, pan, and selection tools
- **Tooltips**: Detailed hover information
- **Data Summary**: Min/max/average statistics
- **Responsive Design**: Works on all screen sizes

## 📊 Chart Components

### HeatTimeSeriesChart
- Main chart component with full functionality
- Located: `src/app/components/HeatTimeSeriesChart.tsx`
- Features: Time range selection, data summary, refresh controls

### DateTimeRangePicker
- Custom date/time range selection modal
- Located: `src/app/components/DateTimeRangePicker.tsx`
- Features: Quick select buttons, validation, Thai localization

## 🔧 Technical Implementation

### Thailand Timezone Support (UTC+7)
- **Timezone Handling**: All dates and times displayed in Thailand timezone (UTC+7)
- **InfluxDB Integration**: Queries use UTC but display converts to Thailand time
- **User Interface**: Date pickers and displays show local Thailand time
- **Automatic Conversion**: Seamless conversion between UTC (storage) and Thailand time (display)

### InfluxDB Query Examples
```flux
// 24-hour PM data with 30-minute aggregation
from(bucket:"sensor_data")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "environmental_sensors")
  |> filter(fn: (r) => r._field == "pm1" or r._field == "pm2_5" or r._field == "pm10")
  |> aggregateWindow(every: 30m, fn: mean, createEmpty: false)
  |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
```

### API Configuration
- **Base URL**: `http://172.16.116.82:8086`
- **Organization**: `iot_monitoring`
- **Bucket**: `sensor_data`
- **Token**: `my-super-secret-admin-token-change-me`

### Chart Configuration
- **Type**: Line chart with smooth curves
- **Colors**: Green (PM1.0), Orange (PM2.5), Red (PM10)
- **Animations**: Smooth transitions and loading states
- **Responsive**: Adapts to container size

## 🎨 UI/UX Improvements

### Visual Enhancements
- **Gradient Backgrounds**: Beautiful card designs
- **Glass Morphism**: Backdrop blur effects
- **Color Coding**: Consistent color scheme
- **Thai Localization**: All text in Thai language

### Interactive Elements
- **Hover Effects**: Smooth transitions
- **Loading Indicators**: Spinner animations
- **Error States**: Clear error messaging
- **Success Feedback**: Visual confirmations

## 📱 Responsive Design
- **Mobile First**: Optimized for small screens
- **Tablet Support**: Grid layouts adapt
- **Desktop Enhanced**: Full feature set
- **Touch Friendly**: Large touch targets

## 🔄 Data Flow
1. **Component Mount**: Initialize with 24h data in Thailand timezone
2. **Auto Refresh**: Every 5 minutes with timezone-aware timestamps
3. **User Selection**: Change time range (displayed in UTC+7)
4. **API Call**: Fetch from InfluxDB (queries in UTC)
5. **Data Processing**: Parse CSV and convert timestamps
6. **Chart Update**: Display with Thailand timezone labels
7. **Summary Update**: Calculate statistics with local time display

## 🚀 Performance Optimizations
- **Data Aggregation**: 30-minute intervals reduce data points
- **Lazy Loading**: ApexCharts loaded dynamically
- **Memoization**: Prevent unnecessary re-renders
- **Error Boundaries**: Graceful error handling
- **Mock Data**: Fallback for offline testing

## 🔧 Configuration Options
- **Refresh Interval**: Configurable auto-refresh
- **Time Ranges**: Customizable preset ranges
- **Chart Colors**: Theme-based color system
- **Data Limits**: Maximum 30-day ranges
- **Aggregation**: Configurable time windows

This implementation provides a comprehensive, beautiful, and functional time series chart system for monitoring PM data over various time periods, with full Thailand timezone support (UTC+7) for accurate local time display and user interaction.