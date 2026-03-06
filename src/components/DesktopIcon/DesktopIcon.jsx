import { useWindows } from '../../context/WindowContext';
import './DesktopIcon.css';

export default function DesktopIcon({ id, name, icon, type, url }) {
    const { openWindow } = useWindows();

    const handleClick = (e) => {
        e.preventDefault();
        if (type === 'window') {
            openWindow(id);
        } else if (type === 'link') {
            window.open(url, '_blank', 'noopener');
        }
    };

    if (type === 'link') {
        return (
            <a
                className="desktop-icon"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
            >
                <img src={icon} className="icon-image" alt={`${name} icon`} />
                <span>{name}</span>
            </a>
        );
    }

    return (
        <div
            className="desktop-icon"
            onClick={handleClick}
            tabIndex={0}
            role="button"
            aria-label={`Open ${name}`}
        >
            <img src={icon} className="icon-image" alt={`${name} icon`} />
            <span>{name}</span>
        </div>
    );
}

