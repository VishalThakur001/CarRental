import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const BookingCalendar = ({ carId, selectedDate, onDateSelect, bookedDates = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
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
    
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    
    const days = getDaysInMonth(currentMonth);
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Car Availability Calendar
                </h3>
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        ←
                    </button>
                    <span className="text-lg font-medium min-w-[150px] text-center">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </span>
                    <button
                        onClick={goToNextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        →
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                        {day}
                    </div>
                ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isSelected = selectedDate === formatDate(day);
                    const isBooked = isDateBooked(day);
                    const isPast = isDatePast(day);
                    const isDisabled = isPast || isBooked;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => !isDisabled && onDateSelect(formatDate(day))}
                            disabled={isDisabled}
                            className={`
                                p-2 text-sm rounded-lg transition-all duration-200 min-h-[40px]
                                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                ${isSelected 
                                    ? 'bg-blue-500 text-white shadow-md' 
                                    : isBooked 
                                        ? 'bg-red-100 text-red-600 cursor-not-allowed' 
                                        : isPast 
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'hover:bg-blue-50 cursor-pointer'
                                }
                                ${!isCurrentMonth && 'opacity-50'}
                            `}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>
            
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
    );
};

export default BookingCalendar;
