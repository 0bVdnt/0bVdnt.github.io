import { useState, useEffect } from 'react';
import './Clock.css';

export default function Clock() {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            const dateString = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
            const timeString = now.toLocaleTimeString('en-US', options);
            setTime(`${dateString} ${timeString}`);
        };

        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="clock" aria-live="polite">
            {time}
        </div>
    );
}
