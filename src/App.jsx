import { useState } from 'react';
import { WindowProvider } from './context/WindowContext';
import BootScreen from './components/BootScreen/BootScreen';
import Desktop from './components/Desktop/Desktop';
import Taskbar from './components/Taskbar/Taskbar';
import ContextMenu from './components/ContextMenu/ContextMenu';
import './index.css';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <WindowProvider>
      {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}
      {!isBooting && (
        <>
          <Desktop />
          <Taskbar />
          <ContextMenu />
        </>
      )}
    </WindowProvider>
  );
}

