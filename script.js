document.addEventListener('DOMContentLoaded', () => {
    // CLOCK ===========================================================
    const clockElement = document.getElementById('live-clock');
    function updateClock() {
        const now = new Date();
        const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        const dateString = now.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
        clockElement.textContent = `${dateString} ${now.toLocaleTimeString('en-US', options)}`;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ICON FALLBACKS ==================================================
    function svgIcon(kind = 'file') {
        const symbols = {
            terminal: '&gt;_',
            about: '👤',
            projects: '📁',
            academics: '🎓',
            certifications: '🏅',
            activities: '🎯',
            goals: '🎯',
            contact: '✉️',
            workbench: '🛠️',
            library: '📖',
            github: '🐙',
            linkedin: 'in',
            leetcode: 'LC',
            resume: '📄',
            file: '📦'
        };
        const label = symbols[kind] || symbols.file;
        const textNode = /[A-Za-z]+/.test(label)
            ? `<text x='50%' y='56%' text-anchor='middle' font-family='Fira Code, monospace' font-size='20' fill='#fff'>${label}</text>`
            : `<text x='50%' y='56%' text-anchor='middle' font-family='Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji' font-size='28'>${label}</text>`;
        const svg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#ff00ff'/>
      <stop offset='1' stop-color='#00ffff'/>
    </linearGradient>
  </defs>
  <rect width='64' height='64' rx='12' fill='url(#g)'/>
  ${textNode}
</svg>`;
        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }
    function guessKindFromIcon(iconEl) {
        const parent = iconEl.closest('.desktop-icon');
        if (!parent) return 'file';
        const id = parent.dataset.opens || '';
        const alt = (iconEl.getAttribute('alt') || '').toLowerCase();
        if (id) return id;
        if (alt.includes('github')) return 'github';
        if (alt.includes('linkedin')) return 'linkedin';
        if (alt.includes('leetcode')) return 'leetcode';
        if (alt.includes('resume')) return 'resume';
        return 'file';
    }
    document.querySelectorAll('.icon-image').forEach(img => {
        if (img.tagName.toLowerCase() === 'img') {
            img.addEventListener('error', () => {
                img.src = svgIcon(guessKindFromIcon(img));
            }, { once: true });
        }
    });

    // WINDOWS / DESKTOP ===============================================
    const windows = document.querySelectorAll('.window');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const taskbarTray = document.querySelector('.open-window-tray');
    const startButton = document.querySelector('.start-button');
    const startMenu = document.querySelector('.start-menu');

    let highestZIndex = 100;
    const openWindows = {};
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

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
            trayIcon.title = `Toggle ${win.querySelector('.title-bar-text').textContent}`;
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

    // DESKTOP ICON BEHAVIOR
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            desktopIcons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');

            if (icon.tagName === 'A') {
                // prevent single-click from navigating on desktop
                if (!isTouch) e.preventDefault();
                if (isTouch) window.open(icon.href, icon.target || '_blank');
            } else if (isTouch && icon.dataset.opens) {
                openWindow(icon.dataset.opens);
            }
        });
        icon.addEventListener('dblclick', (e) => {
            e.preventDefault();
            if (icon.dataset.opens) {
                openWindow(icon.dataset.opens);
            } else if (icon.tagName === 'A') {
                window.open(icon.href, icon.target || '_blank');
            }
        });
    });

    const projectCards = document.querySelectorAll('.project-card[data-opens]');
    projectCards.forEach(card => {
        card.addEventListener('click', () => openWindow(card.dataset.opens));
    });

    windows.forEach(win => {
        win.addEventListener('mousedown', () => focusWindow(win));
        win.querySelector('.close-btn').addEventListener('click', (e) => { e.stopPropagation(); closeWindow(win.id); });
        win.querySelector('.minimize-btn').addEventListener('click', (e) => { e.stopPropagation(); win.style.display = 'none'; });
        win.querySelector('.maximize-btn')?.addEventListener('click', (e) => { e.stopPropagation(); maximizeWindow(win.id); });
        makeDraggable(win);
        // Double-click title bar to maximize/restore
        win.querySelector('.title-bar').addEventListener('dblclick', (e) => {
            e.stopPropagation();
            maximizeWindow(win.id);
        });
    });

    // START MENU ======================================================
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
                    startButton.setAttribute('aria-expanded', 'false');
                });
            }
            li.appendChild(a);
            menuUl.appendChild(li);
        });
    }

    const toggleStart = (e) => {
        e?.stopPropagation();
        const active = !startMenu.classList.contains('active');
        startMenu.classList.toggle('active');
        startButton.setAttribute('aria-expanded', String(active));
    };

    startButton.addEventListener('click', toggleStart);
    document.addEventListener('click', (e) => {
        if (!startButton.contains(e.target) && !startMenu.contains(e.target)) {
            startMenu.classList.remove('active');
            startButton.setAttribute('aria-expanded', 'false');
        }
    });
    startMenu.addEventListener('click', (e) => e.stopPropagation());

    // KEYBOARD: Enter opens selected icon, Esc minimizes focused window
    document.addEventListener('keydown', (e) => {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (e.key === 'Enter' && activeTag !== 'input' && activeTag !== 'textarea') {
            const selected = document.querySelector('.desktop-icon.selected');
            if (selected) {
                if (selected.dataset.opens) openWindow(selected.dataset.opens);
                else if (selected.tagName === 'A') window.open(selected.href, selected.target || '_blank');
            }
        } else if (e.key === 'Escape') {
            startMenu.classList.remove('active');
            startButton.setAttribute('aria-expanded', 'false');
            const focused = document.querySelector('.window.focused');
            if (focused) focused.style.display = 'none';
        }
    });

    // TERMINAL ========================================================
    const terminalWindow = document.getElementById('obvterm');
    const terminalBody = terminalWindow.querySelector('.window-body');
    const terminalOutput = terminalWindow.querySelector('.terminal-output');
    const terminalInput = terminalWindow.querySelector('.terminal-input');
    const beforeSpan = terminalWindow.querySelector('.input-before');
    const afterSpan = terminalWindow.querySelector('.input-after');
    const caret = terminalWindow.querySelector('.caret');

    terminalOutput.innerHTML = `<div class="terminal-line">ObvOS v1.0 [Version ${new Date().toISOString().split('T')[0]}]</div>
<div class="terminal-line">(c) 0bVdnt Creations. All rights reserved.</div><div class="terminal-line">Welcome! Type 'help' to begin.</div><br>`;

    terminalBody.addEventListener('click', () => terminalInput.focus());

    // Helpers to render the input with true caret position
    function renderInput() {
        const v = terminalInput.value;
        const caretIndex = terminalInput.selectionStart ?? v.length;

        beforeSpan.textContent = v.slice(0, caretIndex);
        afterSpan.textContent = v.slice(caretIndex);

        // Position caret and the afterSpan
        const leftPx = beforeSpan.offsetWidth;
        caret.style.left = leftPx + 'px';
        afterSpan.style.left = (leftPx + 2) + 'px';
    }
    terminalInput.addEventListener('input', renderInput);
    terminalInput.addEventListener('keyup', renderInput);
    terminalInput.addEventListener('click', renderInput);
    terminalInput.addEventListener('focus', renderInput);

    // History + shortcuts
    const history = [];
    let historyIndex = -1;

    // Simple output helpers
    function printPromptAndCmd(cmd) {
        terminalOutput.insertAdjacentHTML(
            'beforeend',
            `<div class="terminal-line"><span class="prompt-text">user@obvOS:~$ </span>${cmd || ''}</div>`
        );
    }
    function printLine(html, cls = 'ok') {
        terminalOutput.insertAdjacentHTML('beforeend', `<div class="terminal-line ${cls}">${html}</div>`);
        terminalOutput.insertAdjacentHTML('beforeend', `<br>`);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // Available commands and app names for completion
    const commands = ['help', 'whoami', 'ls', 'open', 'socials', 'contact', 'date', 'clear', 'cls', 'exit', 'status', 'cat'];
    const aliasMap = {
        'obvterm': ['terminal', 'term', 'shell'],
        'about-me': ['about', 'me', 'bio'],
        'projects': ['proj', 'project', 'work'],
        'workbench': ['bench', 'forge', 'current'],
        'academics': ['edu', 'education', 'school'],
        'certifications': ['certs', 'badges'],
        'activities': ['activity', 'clubs', 'extra'],
        'goals': ['goal'],
        'contact': ['email', 'reach', 'talk'],
        'library': ['reading', 'books', 'notes']
    };
    const appIds = Array.from(document.querySelectorAll('.desktop-icon'))
        .map(i => i.dataset.opens)
        .filter(Boolean);

    // Flatten alias strings for completion
    const appAliases = Array.from(
        new Set(
            Object.entries(aliasMap).flatMap(([id, al]) => [id, ...(al || [])])
        )
    );

    // Completion state
    let completion = { list: [], index: 0, start: 0, end: 0, snapshot: '' };

    function resetCompletion() { completion = { list: [], index: 0, start: 0, end: 0, snapshot: '' }; }

    function computeCompletions(value, caretIndex) {
        const left = value.slice(0, caretIndex);
        const lastSpace = left.lastIndexOf(' ');
        const tokenStart = lastSpace + 1;
        const token = left.slice(tokenStart);

        // First token detection
        const firstSpace = left.indexOf(' ');
        const firstToken = (firstSpace === -1) ? left : left.slice(0, firstSpace).trim();

        let pool = [];
        if (firstSpace === -1 || caretIndex <= firstSpace) {
            // In first token: suggest commands
            pool = commands;
        } else if (firstToken === 'open') {
            // Suggest app ids and aliases
            pool = [...new Set([...appIds, ...appAliases])];
        } else if (firstToken === 'cat') {
            pool = ['Reading.txt'];
        } else {
            pool = [];
        }

        const list = pool.filter(s => s.startsWith(token));
        return { list, start: tokenStart, end: tokenStart + token.length };
    }

    function applyCompletion(value, start, end, replacement) {
        const before = value.slice(0, start);
        const after = value.slice(end);
        return before + replacement + after;
    }

    // Keyboard handling
    terminalInput.addEventListener('keydown', (e) => {
        // Clear screen
        if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
            e.preventDefault();
            terminalOutput.innerHTML = '';
            return;
        }
        // Erase line
        if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            terminalInput.value = '';
            resetCompletion();
            renderInput();
            return;
        }
        // Home/End (Ctrl+A/E)
        if (e.ctrlKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            terminalInput.setSelectionRange(0, 0);
            renderInput();
            return;
        }
        if (e.ctrlKey && (e.key === 'e' || e.key === 'E')) {
            e.preventDefault();
            const len = terminalInput.value.length;
            terminalInput.setSelectionRange(len, len);
            renderInput();
            return;
        }
        // History
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                if (historyIndex === -1) historyIndex = history.length;
                historyIndex = Math.max(0, historyIndex - 1);
                terminalInput.value = history[historyIndex] || '';
                const len = terminalInput.value.length;
                terminalInput.setSelectionRange(len, len);
                resetCompletion();
                renderInput();
            }
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (history.length > 0) {
                if (historyIndex === -1) return;
                historyIndex = Math.min(history.length, historyIndex + 1);
                terminalInput.value = historyIndex >= history.length ? '' : (history[historyIndex] || '');
                const len = terminalInput.value.length;
                terminalInput.setSelectionRange(len, len);
                resetCompletion();
                renderInput();
            }
            return;
        }

        // Autocomplete with Tab / Shift+Tab
        if (e.key === 'Tab') {
            e.preventDefault();
            const v = terminalInput.value;
            const caretIndex = terminalInput.selectionStart ?? v.length;

            // Recompute completions if snapshot differs
            if (completion.snapshot !== v || completion.list.length === 0) {
                const comp = computeCompletions(v, caretIndex);
                completion = { ...comp, index: 0, snapshot: v };
            } else {
                // Cycle
                const delta = e.shiftKey ? -1 : 1;
                completion.index = (completion.index + delta + completion.list.length) % completion.list.length;
            }

            if (completion.list.length > 0) {
                const choice = completion.list[completion.index];
                const nextValue = applyCompletion(v, completion.start, completion.end, choice);
                // If completing first token or command that expects more, add trailing space once
                const left = nextValue.slice(0, caretIndex);
                const firstSpace = left.indexOf(' ');
                const isFirstToken = (firstSpace === -1) || (caretIndex <= firstSpace);
                const expectsArg = (choice === 'open' || choice === 'cat');

                terminalInput.value = isFirstToken || expectsArg ? nextValue : nextValue;
                const newCaret = completion.start + choice.length + (expectsArg && isFirstToken ? 1 : 0);
                terminalInput.setSelectionRange(newCaret, newCaret);

                // Update snapshot and end position for further cycling
                completion.snapshot = terminalInput.value;
                completion.end = completion.start + choice.length;
                renderInput();
            }
            return;
        }

        // Any other key resets cycling context
        resetCompletion();

        // Enter runs the command
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = terminalInput.value.trim();
            printPromptAndCmd(command);
            if (command) {
                history.push(command);
                historyIndex = -1;
            }
            processCommand(command);
            terminalInput.value = '';
            resetCompletion();
            renderInput();
        }
    });

    // Command resolution
    function resolveAppId(name) {
        if (!name) return null;
        const lower = name.toLowerCase();
        if (document.getElementById(lower)) return lower;
        for (const [id, list] of Object.entries(aliasMap)) {
            if (id === lower) return id;
            if ((list || []).includes(lower)) return id;
        }
        return null;
    }

    // Commands
    function processCommand(command) {
        if (!command) return;

        const [cmdRaw, ...argsRaw] = command.split(' ');
        const cmd = cmdRaw.toLowerCase();
        const args = argsRaw;
        let response = '';
        let cls = 'ok';

        switch (cmd) {
            case 'help':
                response = `Available commands:
- help, whoami, ls, open [app], socials, contact, date, clear (alias: cls), exit, status, cat [Reading.txt]`;
                break;

            case 'whoami':
                response = `User: Vedant Neve <br>Location: Pune, India`;
                break;

            case 'ls':
                // color tokens
                const items = [
                    ...appIds.map(i => `<span class="token-dir">${i}/</span>`),
                    `<span class="token-file">Reading.txt</span>`
                ];
                response = items.join(` <span class="token-sep">·</span> `);
                break;

            case 'open': {
                const joined = args.join(' ').replace(/\.txt$/i, '').trim();
                const target = resolveAppId(joined);
                if (target) {
                    openWindow(target);
                    response = `Opening ${target}...`;
                } else {
                    response = `bash: app not found: ${args[0] || ''}. Try 'ls' to see available files.`;
                    cls = 'error';
                }
                break;
            }

            case 'status':
                response = `Currently working on:<br>
                            - Jerm: A high-performance terminal in modern Java.<br> 
                            - cuda-GL: GPU-accelerated graphics components with CUDA/OpenGL.`;
                break;

            case 'cat':
                if ((args[0] || '').toLowerCase() === 'reading.txt') {
                    response = `Currently Reading:<br>
                            1. Artificial Intelligence: A Modern Approach (Russell & Norvig)<br>
                            2. Computer Networking: A Top-Down Approach (Kurose & Ross)<br>
                            3. Introduction to Algorithms (CLRS)`;
                } else {
                    response = `cat: no such file: ${args[0]}. Did you mean 'cat Reading.txt'?`;
                    cls = 'error';
                }
                break;

            case 'socials':
                response = `GitHub: <a href="https://github.com/0bVdnt" target="_blank">github.com/0bVdnt</a><br>
                            LinkedIn: <a href="https://linkedin.com/in/vedantneve" target="_blank">linkedin.com/in/vedantneve</a><br>
                            X/Twitter: <a href="https://x.com/0bVdnt" target="_blank">x.com/0bVdnt</a><br>
                            LeetCode: <a href="https://leetcode.com/u/0bVdnt" target="_blank">leetcode.com/u/0bVdnt</a>`;
                break;

            case 'contact':
                response = `Email: <a href="mailto:vedantneve13@gmail.com">vedantneve13@gmail.com</a>`;
                break;

            case 'date':
                response = document.getElementById('live-clock').textContent;
                break;

            case 'clear':
            case 'cls':
                terminalOutput.innerHTML = '';
                return;

            case 'exit':
                closeWindow('obvterm');
                return;

            default:
                response = `bash: command not found: ${command}`;
                cls = 'error';
        }

        printLine(response, cls);
    }

    // Initial render
    renderInput();

    function makeDraggable(element) {
        const titleBar = element.querySelector('.title-bar');
        let isDragging = false, offsetX, offsetY;

        const onMouseDown = (e) => {
            // Disable drag on mobile compact mode
            if (window.innerWidth <= 768) return;
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

    // BOOT SCREEN =====================================================
    const bootScreen = document.getElementById('boot-screen');
    setTimeout(() => {
        bootScreen.classList.add('hidden');
    }, 2500);
    // Allow skipping boot screen
    ['click', 'keydown'].forEach(evt =>
        document.addEventListener(evt, () => {
            if (!bootScreen.classList.contains('hidden')) bootScreen.classList.add('hidden');
        }, { once: true })
    );

    populateStartMenu();

    // Keep windows visible on resize
    window.addEventListener('resize', () => {
        const desktop = document.querySelector('.desktop');
        document.querySelectorAll('.window').forEach(win => {
            if (win.style.display === 'flex') {
                if (win.classList.contains('maximized')) {
                    win.style.width = `${desktop.offsetWidth}px`;
                    win.style.height = `${desktop.offsetHeight}px`;
                    win.style.top = '0';
                    win.style.left = '0';
                } else {
                    const rect = win.getBoundingClientRect();
                    let left = parseInt(win.style.left || '0', 10);
                    let top = parseInt(win.style.top || '0', 10);
                    if (left + rect.width > desktop.offsetWidth) left = Math.max(0, desktop.offsetWidth - rect.width);
                    if (top + rect.height > desktop.offsetHeight) top = Math.max(0, desktop.offsetHeight - rect.height);
                    win.style.left = `${left}px`;
                    win.style.top = `${top}px`;
                }
            }
        });
    });
});