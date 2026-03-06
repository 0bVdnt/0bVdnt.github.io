import { useState, useEffect } from 'react';
import './Blogs.css';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Try fetching from the production Astro endpoint
                let res;
                try {
                    res = await fetch('https://0bVdnt.github.io/blogs/api/posts.json');
                } catch (e) {
                    res = { ok: false };
                }

                if (!res.ok) {
                    // Fallback to local dev server if production is not deployed yet
                    res = await fetch('http://localhost:4321/blogs/api/posts.json');
                }

                if (!res.ok) throw new Error('Could not fetch blogs');

                const data = await res.json();
                setBlogs(data);
            } catch (err) {
                setError('Failed to load blogs. Make sure the Astro site is deployed or running locally on port 4321.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px' }}>Loading blogs from server...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: '#ff6b6b' }}>{error}</div>;
    }

    return (
        <div className="blogs-directory" style={{ padding: '20px', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>My Blogs</h2>
            <div className="blog-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {blogs.map(blog => (
                    <a
                        key={blog.id}
                        href={blog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="blog-item"
                        style={{
                            padding: '15px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'all 0.2s',
                            display: 'block'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px 0' }}>{blog.title}</h3>
                        <p style={{ margin: '0 0 10px 0', opacity: 0.8, fontSize: '0.9em' }}>{blog.date}</p>
                        <p style={{ margin: 0, opacity: 0.9 }}>{blog.description}</p>
                    </a>
                ))}
            </div>
        </div>
    );
}
