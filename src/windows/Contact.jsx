export default function Contact() {
    return (
        <>
            <div className="section-banner" style={{
                width: 'calc(100% + 50px)',
                margin: '-25px -25px 20px -25px',
                height: '40px',
                background: 'linear-gradient(90deg, #45475a, transparent)',
                borderLeft: '3px solid #cba6f7',
                borderBottom: '2px solid #585b70'
            }}></div>
            <h2>Get In Touch</h2>
            <p>You can reach me at <a href="mailto:vedantneve13@gmail.com">vedantneve13@gmail.com</a>, find me on social media, or use the form below.</p>
            <p>
                <a href="https://github.com/0bVdnt" target="_blank" rel="noopener">GitHub</a> |{' '}
                <a href="https://linkedin.com/in/vedantneve" target="_blank" rel="noopener">LinkedIn</a> |{' '}
                <a href="https://x.com/0bVdnt" target="_blank" rel="noopener">X/Twitter</a>
            </p>
            <br />
            <form className="contact-form" action="https://formspree.io/f/xldwodlr" method="POST">
                <input type="text" name="name" placeholder="Your Name" required />
                <input type="email" name="email" placeholder="Your Email" required />
                <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
                <button type="submit">Send Message</button>
            </form>
        </>
    );
}
