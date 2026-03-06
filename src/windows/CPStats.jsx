export default function CPStats() {
    return (
        <>
            <h2>Problem Solving & Algorithms</h2>
            <p>
                I have a deep passion for competitive programming, which I use to continuously sharpen my skills in data
                structures, algorithms, and efficient problem-solving under pressure.
            </p>

            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-value">800+</span>
                    <span className="stat-label">Problems Solved</span>
                </div>
                <div className="stat-item">
                    <span className="stat-value">1775</span>
                    <span className="stat-label">LeetCode Max Rating</span>
                </div>
            </div>

            <h3>Platform Profiles:</h3>
            <div className="platform-links">
                <a href="https://leetcode.com/u/0bVdnt" target="_blank" rel="noopener" className="platform-link">
                    <img src="/assets/leetcode.png" alt="LeetCode Logo" />
                    <span>LeetCode</span>
                </a>
                <a href="https://www.codechef.com/users/obvdnt" target="_blank" rel="noopener" className="platform-link">
                    <img src="/assets/codechef_logo.png" alt="CodeChef Logo" />
                    <span>CodeChef</span>
                </a>
                <a href="https://codeforces.com/profile/0bVdnt" target="_blank" rel="noopener" className="platform-link">
                    <img src="/assets/codeforces_logo.png" alt="Codeforces Logo" />
                    <span>Codeforces</span>
                </a>
                <a href="https://atcoder.jp/users/0bVdnt" target="_blank" rel="noopener" className="platform-link">
                    <img src="/assets/atcoder_logo.png" alt="AtCoder Logo" />
                    <span>AtCoder</span>
                </a>
            </div>
        </>
    );
}
