import { useState, useRef, useEffect } from 'react';
import { useWindows } from '../../context/WindowContext';
import { desktopIcons, terminalCommands, terminalAliasMap } from '../../data/desktopIcons';
import './Terminal.css';

export default function Terminal() {
    const { openWindow, closeWindow } = useWindows();
    const [history, setHistory] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    const appIds = desktopIcons.filter(i => i.type === 'window').map(i => i.id);

    useEffect(() => {
        // Initial welcome message
        setHistory([
            { type: 'system', text: `ObvOS v1.0 [Version ${new Date().toISOString().split('T')[0]}]` },
            { type: 'system', text: '(c) 0bVdnt Creations. All rights reserved.' },
            { type: 'system', text: "Welcome! Type 'help' to begin." }
        ]);
    }, []);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [history]);

    const resolveAppId = (name) => {
        if (!name) return null;
        const lower = name.toLowerCase();
        if (document.getElementById(lower) || appIds.includes(lower)) return lower;
        for (const [id, list] of Object.entries(terminalAliasMap)) {
            if (id === lower) return id;
            if (list?.includes(lower)) return id;
        }
        return null;
    };

    const processCommand = (cmd) => {
        const [cmdRaw, ...args] = cmd.split(' ');
        const command = cmdRaw.toLowerCase();

        switch (command) {
            case 'help':
                return {
                    type: 'ok', text: `Available commands:
- help, whoami, ls, open [app], socials, contact, date, clear (alias: cls), exit, status, cat [Reading.txt]` };

            case 'whoami':
                return { type: 'ok', text: 'User: Vedant Neve\nLocation: Pune, India' };

            case 'ls':
                return { type: 'ok', text: appIds.map(id => `${id}/`).join(' · ') + ' · Reading.txt' };

            case 'open': {
                const target = resolveAppId(args.join(' ').replace(/\.txt$/i, '').trim());
                if (target) {
                    openWindow(target);
                    return { type: 'ok', text: `Opening ${target}...` };
                }
                return { type: 'error', text: `bash: app not found: ${args[0] || ''}. Try 'ls' to see available files.` };
            }

            case 'status':
                return {
                    type: 'ok', text: `Currently working on:
- Jerm: A high-performance terminal in modern Java.
- cuda-GL: GPU-accelerated graphics components with CUDA/OpenGL.` };

            case 'cat':
                if (args[0]?.toLowerCase() === 'reading.txt') {
                    return {
                        type: 'ok', text: `Currently Reading:
1. Artificial Intelligence: A Modern Approach (Russell & Norvig)
2. Computer Networking: A Top-Down Approach (Kurose & Ross)
3. Introduction to Algorithms (CLRS)` };
                }
                return { type: 'error', text: `cat: no such file: ${args[0]}. Did you mean 'cat Reading.txt'?` };

            case 'socials':
                return {
                    type: 'ok', text: `GitHub: github.com/0bVdnt
LinkedIn: linkedin.com/in/vedantneve
X/Twitter: x.com/0bVdnt
LeetCode: leetcode.com/u/0bVdnt` };

            case 'contact':
                return { type: 'ok', text: 'Email: vedantneve13@gmail.com' };

            case 'date':
                const now = new Date();
                const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
                const dateString = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
                return { type: 'ok', text: `${dateString} ${now.toLocaleTimeString('en-US', options)}` };

            case 'clear':
            case 'cls':
                setHistory([]);
                return null;

            case 'exit':
                closeWindow('obvterm');
                return null;

            default:
                return { type: 'error', text: `bash: command not found: ${cmd}` };
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cmd = input.trim();

        // Add prompt + command to history
        setHistory(prev => [...prev, { type: 'prompt', text: `user@obvOS:~$ ${cmd}` }]);

        if (cmd) {
            setCommandHistory(prev => [...prev, cmd]);
            setHistoryIndex(-1);

            const result = processCommand(cmd);
            if (result) {
                setHistory(prev => [...prev, result]);
            }
        }

        setInput('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1
                    ? commandHistory.length - 1
                    : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(commandHistory[newIndex] || '');
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setInput('');
                } else {
                    setHistoryIndex(newIndex);
                    setInput(commandHistory[newIndex] || '');
                }
            }
        } else if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            setHistory([]);
        } else if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            setInput('');
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Simple autocomplete
            const parts = input.split(' ');
            const lastPart = parts[parts.length - 1].toLowerCase();
            const pool = parts.length === 1 ? terminalCommands : [...appIds, 'Reading.txt'];
            const match = pool.find(c => c.toLowerCase().startsWith(lastPart));
            if (match) {
                parts[parts.length - 1] = match;
                setInput(parts.join(' '));
            }
        }
    };

    return (
        <div className="terminal-container" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-output" ref={outputRef}>
                {history.map((line, i) => (
                    <div key={i} className={`terminal-line ${line.type}`}>
                        {line.text}
                    </div>
                ))}
            </div>

            <div className="terminal-hints">
                ↑/↓ history • Tab autocomplete • Ctrl+L clear • Ctrl+U erase line
            </div>

            <form className="terminal-prompt" onSubmit={handleSubmit}>
                <span className="prompt-text">user@obvOS:~$ </span>
                <input
                    ref={inputRef}
                    type="text"
                    className="terminal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
