import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWindows } from '../../context/WindowContext';
import Clock from '../Clock/Clock';
import { desktopIcons } from '../../data/desktopIcons';
import './Taskbar.css';

export default function Taskbar() {
    const { windows, focusWindow, minimizeWindow, getOpenWindowIds } = useWindows();
    const [isStartOpen, setIsStartOpen] = useState(false);
    const { openWindow } = useWindows();

    const openWindowIds = getOpenWindowIds();

    const handleTrayClick = (id) => {
        const win = windows[id];
        if (win?.isMinimized || !win) {
            focusWindow(id);
        } else {
            minimizeWindow(id);
        }
    };

    const handleStartItemClick = (icon) => {
        if (icon.type === 'window') {
            openWindow(icon.id);
        } else if (icon.type === 'link') {
            window.open(icon.url, '_blank', 'noopener');
        }
        setIsStartOpen(false);
    };

    const windowTitles = {
        'about-me': 'About-Me.txt',
        'projects': 'C:\\Projects',
        'workbench': 'C:\\Workbench',
        'cp-stats': 'CP Stats',
        'certifications': 'Achievements',
        'academics': 'Academics',
        'activities': 'Activities',
        'goals': 'Career Goals',
        'library': 'Reading.txt',
        'contact': 'New Message',
        'obvterm': 'ObvTerm'
    };

    return (
        <>
            <div className="taskbar" role="toolbar" aria-label="System taskbar">
                <button
                    className="start-button"
                    onClick={() => setIsStartOpen(!isStartOpen)}
                    aria-haspopup="true"
                    aria-expanded={isStartOpen}
                >
                    <span className="start-icon">λ</span>
                    ObvOS
                </button>

                <div className="taskbar-separator" />

                <div className="open-window-tray" aria-live="polite">
                    {openWindowIds.map(id => (
                        <button
                            key={id}
                            className={`tray-icon ${!windows[id]?.isMinimized ? 'focused' : ''}`}
                            onClick={() => handleTrayClick(id)}
                            title={windowTitles[id] || id}
                        >
                            {windowTitles[id] || id}
                        </button>
                    ))}
                </div>

                <div className="taskbar-separator" />

                <div className="system-tray" aria-label="System indicators">
                    <button className="system-tray-icon" title="Network: Connected" aria-label="Network status">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                        </svg>
                    </button>
                    <button className="system-tray-icon" title="Volume: 75%" aria-label="Volume control">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                        </svg>
                    </button>
                    <button className="system-tray-icon" title="No new notifications" aria-label="Notifications">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                        </svg>
                    </button>
                </div>

                <Clock />
            </div>


            <AnimatePresence>
                {isStartOpen && (
                    <motion.div
                        className="start-menu"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                        role="menu"
                        aria-label="Start menu"
                    >
                        <ul>
                            {desktopIcons.map(icon => (
                                <li key={icon.id}>
                                    <a
                                        href={icon.type === 'link' ? icon.url : '#'}
                                        target={icon.type === 'link' ? '_blank' : undefined}
                                        rel={icon.type === 'link' ? 'noopener' : undefined}
                                        onClick={(e) => {
                                            if (icon.type === 'window') {
                                                e.preventDefault();
                                                handleStartItemClick(icon);
                                            }
                                        }}
                                    >
                                        <img src={icon.icon} className="icon-image" alt="" />
                                        {icon.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {isStartOpen && (
                <div
                    className="start-menu-backdrop"
                    onClick={() => setIsStartOpen(false)}
                />
            )}
        </>
    );
}
