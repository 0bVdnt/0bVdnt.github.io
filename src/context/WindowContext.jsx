import { createContext, useContext, useState, useCallback } from 'react';

const WindowContext = createContext(null);

export function WindowProvider({ children }) {
    const [windows, setWindows] = useState({});
    const [focusOrder, setFocusOrder] = useState([]);
    const [highestZ, setHighestZ] = useState(100);

    const openWindow = useCallback((id, initialPos = null) => {
        setWindows(prev => {
            if (prev[id]) {
                // Window exists, just show it
                return { ...prev, [id]: { ...prev[id], isOpen: true, isMinimized: false } };
            }
            // New window
            return {
                ...prev,
                [id]: {
                    isOpen: true,
                    isMinimized: false,
                    isMaximized: false,
                    position: initialPos || { x: 100 + Object.keys(prev).length * 30, y: 50 + Object.keys(prev).length * 30 },
                    zIndex: highestZ + 1
                }
            };
        });
        setHighestZ(z => z + 1);
        setFocusOrder(prev => [...prev.filter(wId => wId !== id), id]);
    }, [highestZ]);

    const closeWindow = useCallback((id) => {
        setWindows(prev => {
            const newWindows = { ...prev };
            delete newWindows[id];
            return newWindows;
        });
        setFocusOrder(prev => prev.filter(wId => wId !== id));
    }, []);

    const minimizeWindow = useCallback((id) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: true }
        }));
    }, []);

    const maximizeWindow = useCallback((id) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isMaximized: !prev[id]?.isMaximized }
        }));
    }, []);

    const focusWindow = useCallback((id) => {
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], isMinimized: false, zIndex: highestZ + 1 }
            };
        });
        setHighestZ(z => z + 1);
        setFocusOrder(prev => [...prev.filter(wId => wId !== id), id]);
    }, [highestZ]);

    const updatePosition = useCallback((id, position) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], position }
        }));
    }, []);

    const getFocusedWindowId = useCallback(() => {
        return focusOrder[focusOrder.length - 1] || null;
    }, [focusOrder]);

    const getOpenWindowIds = useCallback(() => {
        return Object.keys(windows).filter(id => windows[id]?.isOpen);
    }, [windows]);

    return (
        <WindowContext.Provider value={{
            windows,
            openWindow,
            closeWindow,
            minimizeWindow,
            maximizeWindow,
            focusWindow,
            updatePosition,
            getFocusedWindowId,
            getOpenWindowIds,
            focusOrder
        }}>
            {children}
        </WindowContext.Provider>
    );
}

export function useWindows() {
    const context = useContext(WindowContext);
    if (!context) {
        throw new Error('useWindows must be used within a WindowProvider');
    }
    return context;
}
