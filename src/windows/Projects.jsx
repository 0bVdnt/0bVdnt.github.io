import { useWindows } from '../context/WindowContext';
import { projectsData } from '../data/projects';

export default function Projects() {
    const { openWindow } = useWindows();

    return (
        <>
            <h2>My Work</h2>
            <div className="project-grid">
                {projectsData.map(project => (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => openWindow(project.id)}
                    >
                        <div
                            className="thumbnail"
                            style={{ backgroundImage: `url('${project.thumbnail}')` }}
                        />
                        <h3>{project.title}</h3>
                        <p>{project.shortDesc}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
