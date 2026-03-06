import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BootScreen.css';

const asciiLogo = `
██╗   ██╗███████╗██████╗  █████╗ ███╗   ██╗████████╗    ███╗   ██╗███████╗██╗   ██╗███████╗
██║   ██║██╔════╝██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝    ████╗  ██║██╔════╝██║   ██║██╔════╝
██║   ██║█████╗  ██║  ██║███████║██╔██╗ ██║   ██║       ██╔██╗ ██║█████╗  ██║   ██║█████╗  
╚██╗ ██╔╝██╔══╝  ██║  ██║██╔══██║██║╚██╗██║   ██║       ██║╚██╗██║██╔══╝  ╚██╗ ██╔╝██╔══╝  
 ╚████╔╝ ███████╗██████╔╝██║  ██║██║ ╚████║   ██║       ██║ ╚████║███████╗ ╚████╔╝ ███████╗
  ╚═══╝  ╚══════╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝       ╚═╝  ╚═══╝╚══════╝  ╚═══╝  ╚══════╝`;
const bootStages = [
    { message: 'Initializing BIOS...', duration: 400 },
    { message: 'Memory Check: 640KB OK', duration: 300 },
    { message: 'Detecting hardware...', duration: 400 },
    { message: 'Loading kernel modules...', duration: 500 },
    { message: 'Mounting file systems...', duration: 400 },
    { message: 'Starting services...', duration: 300 },
    { message: 'Loading desktop environment...', duration: 600 },
    { message: "Welcome to Vedant Neve's Portfolio", duration: 500 }
];

export default function BootScreen({ onComplete }) {
    const [isVisible, setIsVisible] = useState(true);
    const [currentStage, setCurrentStage] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let stageIndex = 0;
        let progressValue = 0;

        const runStage = () => {
            if (stageIndex >= bootStages.length) {
                // Boot complete
                setTimeout(() => {
                    setIsVisible(false);
                    setTimeout(onComplete, 800);
                }, 300);
                return;
            }

            setCurrentStage(stageIndex);
            const stage = bootStages[stageIndex];
            const progressIncrement = 100 / bootStages.length;

            // Animate progress during this stage
            const steps = 10;
            const stepTime = stage.duration / steps;
            let step = 0;

            const progressInterval = setInterval(() => {
                step++;
                progressValue = (stageIndex * progressIncrement) + (progressIncrement * (step / steps));
                setProgress(Math.min(progressValue, 100));

                if (step >= steps) {
                    clearInterval(progressInterval);
                    stageIndex++;
                    runStage();
                }
            }, stepTime);
        };

        runStage();

        // Skip on click/keypress
        const handleSkip = () => {
            setProgress(100);
            setIsVisible(false);
            setTimeout(onComplete, 400);
        };

        window.addEventListener('click', handleSkip, { once: true });
        window.addEventListener('keydown', handleSkip, { once: true });

        return () => {
            window.removeEventListener('click', handleSkip);
            window.removeEventListener('keydown', handleSkip);
        };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="boot-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="boot-content">
                        <div className="boot-logo">
                            <span className="boot-logo-icon">λ</span>
                        </div>

                        <pre className="boot-ascii">{asciiLogo}</pre>

                        <div className="boot-progress-container">
                            <div className="boot-progress-bar">
                                <motion.div
                                    className="boot-progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="boot-progress-text">{Math.round(progress)}%</div>
                        </div>

                        <div className="boot-stage-message">
                            {bootStages[currentStage]?.message || 'Starting...'}
                        </div>

                        <div className="boot-skip-hint">
                            Press any key or click to skip
                        </div>
                    </div>

                    <div className="boot-footer">
                        <span>Version 1.0.0</span>
                        <span>•</span>
                        <span>Catppuccin Mocha Theme</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

