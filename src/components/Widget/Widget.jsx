import './Widget.css';

export function Widget({ title, children }) {
    return (
        <div className="widget">
            <h3>{title}</h3>
            {children}
        </div>
    );
}

export function ProfileWidget() {
    return (
        <Widget title="PROFILE">
            <p>I'm a computer science engineer who builds technology from first principles—from custom OS kernels and compilers with LLVM to GPU-accelerated graphics, full-stack web applications and AI models.</p>
        </Widget>
    );
}

export function StackWidget() {
    return (
        <Widget title="CORE STACK">
            <ul className="widget-list-stack">
                <li>C / C++ / Rust / Java</li>
                <li>LLVM & Compilers</li>
                <li>PyTorch & AI Models</li>
                <li>CUDA & Graphics Programming</li>
                <li>Operating Systems</li>
                <li>JS / TS and Frameworks</li>
            </ul>
        </Widget>
    );
}

export function LinksWidget() {
    return (
        <Widget title="QUICK LINKS">
            <ul className="widget-list-links">
                <li><a href="https://github.com/0bVdnt" target="_blank" rel="noopener">GitHub</a></li>
                <li><a href="https://linkedin.com/in/vedantneve" target="_blank" rel="noopener">LinkedIn</a></li>
                <li><a href="https://leetcode.com/u/0bVdnt" target="_blank" rel="noopener">LeetCode</a></li>
                <li><a href="https://drive.google.com/file/d/1AXKKNJery1O_8104KShRuHgAwvKbUCtb/" target="_blank" rel="noopener">Resume.pdf</a></li>
                <li><a href="mailto:vedantneve13@gmail.com">Email Me</a></li>
            </ul>
        </Widget>
    );
}
