"use client";

import React, { useState } from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { 
  formatDateForInput, 
  formatTimeForInput, 
  parseThailandDateTime, 
  getNowInThailand,
  formatThailandDateTime 
} from '@/lib/timezone';

export interface DateTimeRange {
  start: Date;
  end: Date;
}

interface DateTimeRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (range: DateTimeRange) => void;
  initialRange?: DateTimeRange;
  className?: string;
}

const DateTimeRangePicker: React.FC<DateTimeRangePickerProps> = ({
  isOpen,
  onClose,
  onApply,
  initialRange,
  className = ''
}) => {
  const [startDate, setStartDate] = useState(
    initialRange?.start ? formatDateForInput(initialRange.start) : formatDateForInput(new Date(getNowInThailand().getTime() - 24 * 60 * 60 * 1000))
  );
  const [startTime, setStartTime] = useState(
    initialRange?.start ? formatTimeForInput(initialRange.start) : '00:00'
  );
  const [endDate, setEndDate] = useState(
    initialRange?.end ? formatDateForInput(initialRange.end) : formatDateForInput(getNowInThailand())
  );
  const [endTime, setEndTime] = useState(
    initialRange?.end ? formatTimeForInput(initialRange.end) : formatTimeForInput(getNowInThailand())
  );

  const [error, setError] = useState<string>('');



  const handleApply = () => {
    setError('');

    try {
      const start = parseThailandDateTime(startDate, startTime);
      const end = parseThailandDateTime(endDate, endTime);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setError('วันที่หรือเวลาไม่ถูกต้อง');
        return;
      }

      if (start >= end) {
        setError('วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด');
        return;
      }

      const now = getNowInThailand();
      if (end > now) {
        setError('ไม่สามารถเลือกวันที่ในอนาคตได้');
        return;
      }

      const maxRangeMs = 30 * 24 * 60 * 60 * 1000; // 30 days
      if (end.getTime() - start.getTime() > maxRangeMs) {
        setError('ช่วงเวลาต้องไม่เกิน 30 วัน');
        return;
      }

      onApply({ start, end });
      onClose();
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการประมวลผลวันที่');
    }
  };

  const handleQuickSelect = (hours: number) => {
    const end = getNowInThailand();
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
    
    setStartDate(formatDateForInput(start));
    setStartTime(formatTimeForInput(start));
    setEndDate(formatDateForInput(end));
    setEndTime(formatTimeForInput(end));
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-100">เลือกช่วงเวลา</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Select Buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-3">เลือกช่วงเวลาด่วน:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '1 ชั่วโมง', hours: 1 },
              { label: '6 ชั่วโมง', hours: 6 },
              { label: '12 ชั่วโมง', hours: 12 },
              { label: '24 ชั่วโมง', hours: 24 },
              { label: '3 วัน', hours: 72 },
              { label: '7 วัน', hours: 168 }
            ].map(({ label, hours }) => (
              <button
                key={hours}
                onClick={() => handleQuickSelect(hours)}
                className="px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Date/Time Selection */}
        <div className="space-y-4">
          {/* Start Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              วันที่และเวลาเริ่มต้น
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* End Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              วันที่และเวลาสิ้นสุด
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            ใช้งาน
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-xs">
            💡 สามารถเลือกช่วงเวลาได้สูงสุด 30 วัน และไม่สามารถเลือกวันที่ในอนาคตได้
          </p>
        </div>
      </div>
    </div>
  );
};

export default DateTimeRangePicker;