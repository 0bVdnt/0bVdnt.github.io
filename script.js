document.addEventListener('DOMContentLoaded', () => {
    const clockElement = document.getElementById('live-clock');
    function updateClock() {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const dateString = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
        clockElement.textContent = `${dateString} ${now.toLocaleTimeString('en-US', options)}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    const windows = document.querySelectorAll('.window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const taskbarTray = document.querySelector('.open-window-tray');
    let highestZIndex = 100;

    const openWindows = {};

    function focusWindow(win) {
        if (!win) return;
        windows.forEach(w => w.classList.remove('focused'));
        document.querySelectorAll('.tray-icon').forEach(i => i.classList.remove('focused'));
        
        win.classList.add('focused');
        win.style.zIndex = ++highestZIndex;
        
        const trayIcon = document.querySelector(`.tray-icon[data-window-id="${win.id}"]`);
        if (trayIcon) trayIcon.classList.add('focused');
    }

    function openWindow(id) {
        const win = document.getElementById(id);
        if (!win) return;
        
        if (!win.dataset.positioned) {
            win.style.visibility = 'hidden';
            win.style.display = 'flex';
            const winHeight = win.offsetHeight;
            const winWidth = win.offsetWidth;
            win.style.display = 'none';
            win.style.visibility = 'visible';

            const desktop = document.querySelector('.desktop');
            const openWindowCount = Object.keys(openWindows).length;
            const offset = openWindowCount * 30;
            
            let top = ((desktop.offsetHeight - winHeight) / 2) + offset;
            let left = ((desktop.offsetWidth - winWidth) / 2) + offset;
            
            if (top + winHeight > desktop.offsetHeight) top = desktop.offsetHeight - winHeight - 10;
            if (left + winWidth > desktop.offsetWidth) left = desktop.offsetWidth - winWidth - 10;
            if (top < 0) top = 10;
            if (left < 0) left = 10;

            win.style.top = `${top}px`;
            win.style.left = `${left}px`;
            win.dataset.positioned = 'true';
        }
        
        win.style.display = 'flex';
        focusWindow(win);

        if (!openWindows[id]) {
            const trayIcon = document.createElement('div');
            trayIcon.className = 'tray-icon';
            trayIcon.dataset.windowId = id;
            trayIcon.textContent = win.querySelector('.title-bar-text').textContent;
            trayIcon.addEventListener('click', () => {
                if (win.style.display === 'none' || !win.classList.contains('focused')) {
                    win.style.display = 'flex';
                    focusWindow(win);
                } else {
                    win.style.display = 'none';
                }
            });
            taskbarTray.appendChild(trayIcon);
            openWindows[id] = trayIcon;
        }
    }

    function closeWindow(id) {
        const win = document.getElementById(id);
        if (!win) return;
        
        win.style.display = 'none';
        
        if (openWindows[id]) {
            openWindows[id].remove();
            delete openWindows[id];
        }
        
        const visibleWindows = Array.from(document.querySelectorAll('.window')).filter(w => w.style.display === 'flex');
        if (visibleWindows.length > 0) {
            focusWindow(visibleWindows[visibleWindows.length - 1]);
        }
    }
    
    function maximizeWindow(id) {
        const win = document.getElementById(id);
        if (!win) return;
        const desktop = document.querySelector('.desktop');
        const maximizeBtn = win.querySelector('.maximize-btn');
        if (win.classList.contains('maximized')) {
            win.classList.remove('maximized');
            maximizeBtn.classList.remove('restored');
            maximizeBtn.innerHTML = '□';
            win.style.top = win.dataset.oldTop;
            win.style.left = win.dataset.oldLeft;
            win.style.width = win.dataset.oldWidth;
            win.style.height = win.dataset.oldHeight;
        } else {
            win.classList.add('maximized');
            maximizeBtn.classList.add('restored');
            maximizeBtn.innerHTML = '';
            win.dataset.oldTop = win.style.top;
            win.dataset.oldLeft = win.style.left;
            win.dataset.oldWidth = win.style.width;
            win.dataset.oldHeight = win.style.height;
            win.style.top = '0';
            win.style.left = '0';
            win.style.width = `${desktop.offsetWidth}px`;
            win.style.height = `${desktop.offsetHeight}px`;
        }
    }

    desktopIcons.forEach(icon => {
        if (icon.dataset.opens) {
            icon.addEventListener('click', () => openWindow(icon.dataset.opens));
        }
    });

    windows.forEach(win => {
        win.addEventListener('mousedown', () => focusWindow(win));
        win.querySelector('.close-btn').addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win.id); });
        win.querySelector('.minimize-btn').addEventListener('click', (e) => { e.stopPropagation(); win.style.display = 'none'; });
        win.querySelector('.maximize-btn')?.addEventListener('click', (e) => { e.stopPropagation(); maximizeWindow(win.id); });
        makeDraggable(win);
    });

    const startButton = document.querySelector('.start-button');
    const startMenu = document.querySelector('.start-menu');
    
    function populateStartMenu() {
        const menuUl = startMenu.querySelector('ul');
        menuUl.innerHTML = '';
        
        desktopIcons.forEach(icon => {
            const appName = icon.querySelector('span').textContent;
            const appIcon = icon.querySelector('.icon-image').cloneNode(true);
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.appendChild(appIcon);
            a.appendChild(document.createTextNode(appName));

            if (icon.tagName === 'A') {
                a.href = icon.href;
                a.target = '_blank';
            } else {
                a.href = '#';
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    openWindow(icon.dataset.opens);
                    startMenu.classList.remove('active');
                });
            }
            li.appendChild(a);
            menuUl.appendChild(li);
        });
    }

    startButton.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
            startMenu.classList.remove('active');
        }
    });

    startMenu.addEventListener('click', (e) => e.stopPropagation());

    const terminalWindow = document.getElementById('obvterm');
    const terminalBody = terminalWindow.querySelector('.window-body');
    const terminalOutput = terminalWindow.querySelector('.terminal-output');
    const terminalInput = terminalWindow.querySelector('.terminal-input');
    const inputSizer = terminalWindow.querySelector('.input-sizer');
    const caret = terminalWindow.querySelector('.caret');

    terminalOutput.innerHTML = `<div class="terminal-line">ObvOS v1.0 [Version ${new Date().toISOString().split('T')[0]}]</div>
<div class="terminal-line">(c) 0bVdnt Creations. All rights reserved.</div><div class="terminal-line">Welcome! Type 'help' to begin.</div><br>`;
    
    terminalBody.addEventListener('click', () => {
        terminalInput.focus();
    });

    terminalInput.addEventListener('input', () => {
        inputSizer.textContent = terminalInput.value;
        caret.style.left = inputSizer.offsetWidth + 'px';
    });
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = terminalInput.value.trim();
            processCommand(command);
            terminalInput.value = '';
            inputSizer.textContent = '';
            caret.style.left = '0px';
        }
    });

    function processCommand(command) {
        if (!command) {
            terminalOutput.innerHTML += `<div class="terminal-line"><span class="prompt-text">user@obvOS:~$ </span></div>`;
            return;
        };
        terminalOutput.innerHTML += `<div class="terminal-line"><span class="prompt-text">user@obvOS:~$ </span>${command}</div>`;
        const [cmd, ...args] = command.toLowerCase().split(' ');
        let response = '';
        switch (cmd) {
            case 'help': response = `Available commands: help, whoami, ls, open [app], socials, contact, date, clear, exit`; break;
            case 'whoami': response = `User: Vedant Neve <br>Location: Pune, India`; break;
            case 'ls': response = `about-me.txt/ projects/ academics/ certifications/ activities/ goals/ contact/`; break;
            case 'open': 
                const appName = args[0]?.replace('.txt','');
                if (appName && document.getElementById(appName)) {
                    openWindow(appName); 
                    response = `Opening ${appName}...`; 
                } else { 
                    response = `bash: app not found: ${args[0]}. Try 'ls' to see available files.`; 
                } 
                break;
            case 'socials': response = `GitHub: <a href="https://github.com/0bVdnt" target="_blank">github.com/0bVdnt</a><br>LinkedIn: <a href="https://linkedin.com/in/vedantneve" target="_blank">linkedin.com/in/vedantneve</a><br>X/Twitter: <a href="https://x.com/0bVdnt" target="_blank">x.com/0bVdnt</a><br>LeetCode: <a href="https://leetcode.com/u/0bVdnt" target="_blank">leetcode.com/u/0bVdnt</a>`; break;
            case 'contact': response = `Email: <a href="mailto:vedantneve13@gmail.com">vedantneve13@gmail.com</a>`; break;
            case 'date': response = clockElement.textContent; break;
            case 'clear': terminalOutput.innerHTML = ''; return;
            case 'exit': closeWindow('obvterm'); break;
            default: response = `bash: command not found: ${command}`;
        }
        if (response) terminalOutput.innerHTML += `<div class="terminal-line">${response}</div><br>`;
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function makeDraggable(element) {
        const titleBar = element.querySelector('.title-bar');
        let isDragging = false, offsetX, offsetY;
        const onMouseDown = (e) => {
            if (element.classList.contains('maximized') || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        };
        const onMouseMove = (e) => {
            if (!isDragging) return;
            const desktop = document.querySelector('.desktop');
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            if (newLeft < 0) newLeft = 0;
            if (newTop < 0) newTop = 0;
            if (newLeft + element.offsetWidth > desktop.offsetWidth) newLeft = desktop.offsetWidth - element.offsetWidth;
            if (newTop + element.offsetHeight > desktop.offsetHeight) newTop = desktop.offsetHeight - element.offsetHeight;
            element.style.left = `${newLeft}px`;
            element.style.top = `${newTop}px`;
        };
        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        titleBar.addEventListener('mousedown', onMouseDown);
    }

    const bootScreen = document.getElementById('boot-screen');
    setTimeout(() => {
        bootScreen.classList.add('hidden');
    }, 2500);
    
    populateStartMenu();
});