import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const AvailabilityDatePicker = ({ 
    value, 
    onChange, 
    placeholder, 
    label, 
    required, 
    bookedDates = [],
    minDate,
    id
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const datePickerRef = useRef(null);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        for (let i = 0; i < 42; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }
        return days;
    };
    
    const isDateBooked = (date) => {
        return bookedDates.some(booking => {
            const bookingStart = new Date(booking.start);
            const bookingEnd = new Date(booking.end);
            return date >= bookingStart && date <= bookingEnd;
        });
    };
    
    const isDatePast = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const isDateMinimum = (date) => {
        if (!minDate) return false;
        const min = new Date(minDate);
        min.setHours(0, 0, 0, 0);
        return date < min;
    };
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const handleDateSelect = (date) => {
        const dateString = formatDate(date);
        onChange({ target: { value: dateString } });
        setIsOpen(false);
    };

    const days = getDaysInMonth(currentMonth);

    return (
        <div className="relative" ref={datePickerRef}>
            <div className="flex flex-col gap-2">
                <label htmlFor={id} className="text-sm sm:text-base font-medium">
                    {label}
                </label>
                <input
                    type="text"
                    id={id}
                    value={formatDisplayDate(value)}
                    onClick={() => setIsOpen(true)}
                    placeholder={placeholder || "Select date"}
                    readOnly
                    required={required}
                    className="border border-borderColor px-3 py-2.5 rounded-lg text-sm sm:text-base focus:border-primary focus:ring-1 focus:ring-primary transition-colors cursor-pointer bg-white"
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 mt-2 bg-white rounded-lg border border-gray-200 shadow-lg p-4 w-80"
                    >
                        {/* Calendar Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Select Date
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={goToPreviousMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    ←
                                </button>
                                <span className="text-lg font-medium min-w-[150px] text-center">
                                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                </span>
                                <button
                                    type="button"
                                    onClick={goToNextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                        
                        {/* Days of Week */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {daysOfWeek.map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                                const isSelected = value === formatDate(day);
                                const isBooked = isDateBooked(day);
                                const isPast = isDatePast(day);
                                const isBelowMin = isDateMinimum(day);
                                const isDisabled = isPast || isBooked || isBelowMin;
                                
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => !isDisabled && handleDateSelect(day)}
                                        disabled={isDisabled}
                                        className={`
                                            p-2 text-sm rounded-lg transition-all duration-200 min-h-[40px] relative
                                            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                            ${isSelected 
                                                ? 'bg-blue-500 text-white shadow-md' 
                                                : isBooked 
                                                    ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                                                    : isPast || isBelowMin
                                                        ? 'text-gray-300 cursor-not-allowed'
                                                        : 'hover:bg-blue-50 cursor-pointer'
                                            }
                                            ${!isCurrentMonth && 'opacity-50'}
                                        `}
                                    >
                                        {day.getDate()}
                                        {/* Availability indicator dots */}
                                        {isCurrentMonth && !isSelected && (
                                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                {isBooked ? (
                                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                                ) : !isPast && !isBelowMin ? (
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                                ) : null}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span>Selected</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-100 rounded border border-red-200"></div>
                                <span>Booked</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-100 rounded border border-gray-200"></div>
                                <span>Available</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AvailabilityDatePicker;
