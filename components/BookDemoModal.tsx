import React, { useState } from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';

interface BookDemoModalProps {
    listingTitle: string;
    onClose: () => void;
    onConfirm: (details: { date: string; time: string }) => void;
}

const BookDemoModal: React.FC<BookDemoModalProps> = ({ listingTitle, onClose, onConfirm }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleSubmit = () => {
        if (date && time) {
            onConfirm({ date, time });
        } else {
            alert('Please select a date and time.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book a Demo</h2>
                <p className="text-gray-600 mb-6">For requirement: <span className="font-semibold text-gray-800">"{listingTitle}"</span></p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="demo-date" className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CalendarIcon />
                            </div>
                            <input type="date" id="demo-date" value={date} onChange={e => setDate(e.target.value)} className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="demo-time" className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ClockIcon />
                            </div>
                            <input type="time" id="demo-time" value={time} onChange={e => setTime(e.target.value)} className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 border-gray-300" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                    <button type="button" onClick={handleSubmit} className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors">Confirm Demo</button>
                </div>
            </div>
        </div>
    );
};

export default BookDemoModal;
