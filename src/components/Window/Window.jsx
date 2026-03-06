import { useRef, useEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useWindows } from '../../context/WindowContext';
import './Window.css';

export default function Window({ id, title, children, defaultWidth = 600, defaultHeight = 450 }) {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition, getFocusedWindowId } = useWindows();
    const windowState = windows[id];
    const dragControls = useDragControls();
    const windowRef = useRef(null);
    const [position, setPosition] = useState(null);

    const isFocused = getFocusedWindowId() === id;

    // Calculate centered position on first render
    useEffect(() => {
        if (!position && windowState?.isOpen) {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight - 52; // Subtract taskbar
            const x = Math.max(20, (viewportWidth - defaultWidth) / 2);
            const y = Math.max(20, (viewportHeight - defaultHeight) / 2);
            setPosition({ x, y });
        }
    }, [windowState?.isOpen, defaultWidth, defaultHeight, position]);

    if (!windowState || !windowState.isOpen || windowState.isMinimized) {
        return null;
    }

    const handleDragEnd = (event, info) => {
        const rect = windowRef.current?.getBoundingClientRect();
        if (rect) {
            setPosition({ x: rect.left, y: rect.top });
            updatePosition(id, { x: rect.left, y: rect.top });
        }
    };

    // For maximized windows, use fixed positioning
    if (windowState.isMaximized) {
        return (
            <motion.div
                ref={windowRef}
                className={`window maximized ${isFocused ? 'focused' : ''}`}
                style={{ zIndex: windowState.zIndex }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onMouseDown={() => focusWindow(id)}
            >
                <div
                    className="title-bar"
                    onDoubleClick={() => maximizeWindow(id)}
                >
                    <span className="title-bar-text">{title}</span>
                    <div className="title-bar-controls">
                        <button className="minimize-btn" onClick={() => minimizeWindow(id)} aria-label="Minimize">_</button>
                        <button className="maximize-btn restored" onClick={() => maximizeWindow(id)} aria-label="Restore">◱</button>
                        <button className="close-btn" onClick={() => closeWindow(id)} aria-label="Close">×</button>
                    </div>
                </div>
                <div className="window-body">
                    {children}
                </div>
            </motion.div>
        );
    }

    // Normal draggable window
    return (
        <motion.div
            ref={windowRef}
            className={`window ${isFocused ? 'focused' : ''}`}
            style={{
                width: defaultWidth,
                height: defaultHeight,
                left: position?.x ?? 100,
                top: position?.y ?? 100,
                zIndex: windowState.zIndex
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            drag
            dragControls={dragControls}
            dragMomentum={false}
            dragListener={false}
            dragElastic={0}
            onDragEnd={handleDragEnd}
            onMouseDown={() => focusWindow(id)}
        >
            <div
                className="title-bar"
                onPointerDown={(e) => {
                    if (e.target.tagName !== 'BUTTON') {
                        dragControls.start(e);
                    }
                }}
                onDoubleClick={() => maximizeWindow(id)}
            >
                <span className="title-bar-text">{title}</span>
                <div className="title-bar-controls">
                    <button className="minimize-btn" onClick={() => minimizeWindow(id)} aria-label="Minimize">_</button>
                    <button className="maximize-btn" onClick={() => maximizeWindow(id)} aria-label="Maximize">□</button>
                    <button className="close-btn" onClick={() => closeWindow(id)} aria-label="Close">×</button>
                </div>
            </div>
            <div className="window-body">
                {children}
            </div>
        </motion.div>
    );
}

