import { useWindows } from '../context/WindowContext';
import { workbenchProjects } from '../data/projects';

export default function Workbench() {
    const { openWindow } = useWindows();

    return (
        <>
            <h2>The Forge: What I'm Building Now</h2>
            <p>These are the projects currently on my workbench. They represent my ongoing exploration into new technologies and complex challenges.</p>

            {workbenchProjects.map(project => (
                <div
                    key={project.id}
                    className="project-card"
                    onClick={() => openWindow(project.id)}
                    style={{ marginTop: '20px' }}
                >
                    <div
                        className="thumbnail"
                        style={{ backgroundImage: `url('${project.thumbnail}')` }}
                    />
                    <h3>{project.title}</h3>
                    <p>{project.shortDesc}</p>
                </div>
            ))}
        </>
    );
}
