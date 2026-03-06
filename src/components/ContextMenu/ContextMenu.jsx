import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContextMenu.css';

export default function ContextMenu({ onRefresh }) {
    const [menu, setMenu] = useState({ visible: false, x: 0, y: 0 });
    const [showAbout, setShowAbout] = useState(false);

    const handleContextMenu = useCallback((e) => {
        // Only show on desktop background, not on icons or windows
        if (e.target.closest('.desktop-icon') ||
            e.target.closest('.window') ||
            e.target.closest('.taskbar') ||
            e.target.closest('.widget')) {
            return;
        }

        e.preventDefault();

        // Calculate position to keep menu in viewport
        const x = Math.min(e.clientX, window.innerWidth - 200);
        const y = Math.min(e.clientY, window.innerHeight - 250);

        setMenu({ visible: true, x, y });
    }, []);

    const handleClick = useCallback(() => {
        setMenu({ visible: false, x: 0, y: 0 });
    }, []);

    useEffect(() => {
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
        };
    }, [handleContextMenu, handleClick]);

    const menuItems = [
        { label: 'Refresh', icon: '↻', action: () => window.location.reload() },
        { type: 'separator' },
        { label: 'View', icon: '▤', submenu: true },
        { label: 'Sort by', icon: '⇅', submenu: true },
        { type: 'separator' },
        { label: 'New Folder', icon: '📁', disabled: true },
        { label: 'Paste', icon: '📋', disabled: true },
        { type: 'separator' },
        { label: 'Display Settings', icon: '🖥', disabled: true },
        { label: 'Personalize', icon: '🎨', disabled: true },
        { type: 'separator' },
        { label: 'About Vedant Neve', icon: 'ℹ', action: () => setShowAbout(true) }
    ];

    return (
        <>
            <AnimatePresence>
                {menu.visible && (
                    <motion.div
                        className="context-menu"
                        style={{ left: menu.x, top: menu.y }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                    >
                        {menuItems.map((item, index) => {
                            if (item.type === 'separator') {
                                return <div key={index} className="context-menu-separator" />;
                            }
                            return (
                                <button
                                    key={index}
                                    className={`context-menu-item ${item.disabled ? 'disabled' : ''}`}
                                    onClick={item.action}
                                    disabled={item.disabled}
                                >
                                    <span className="context-menu-icon">{item.icon}</span>
                                    <span className="context-menu-label">{item.label}</span>
                                    {item.submenu && <span className="context-menu-arrow">▸</span>}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* About Dialog */}
            <AnimatePresence>
                {showAbout && (
                    <motion.div
                        className="about-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAbout(false)}
                    >
                        <motion.div
                            className="about-dialog"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="about-header">
                                <span className="about-logo">λ</span>
                                <h2>ObvOS</h2>
                            </div>
                            <div className="about-content">
                                <p><strong>Version:</strong> 1.0.0</p>
                                <p><strong>Built with:</strong> React + Vite</p>
                                <p><strong>Theme:</strong> Catppuccin Mocha</p>
                                <hr />
                                <p className="about-credit">
                                    Created by <strong>Vedant Neve</strong>
                                </p>
                                <p className="about-tagline">
                                    A portfolio disguised as an operating system.
                                </p>
                            </div>
                            <button className="about-close" onClick={() => setShowAbout(false)}>
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
