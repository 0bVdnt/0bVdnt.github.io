import { projectsData, workbenchProjects } from '../data/projects';

const GitHubIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
);

const techBadgeColors = {
    'C++': '#89b4fa',
    'LLVM': '#fab387',
    'CMake': '#a6e3a1',
    'Systems Programming': '#a6e3a1',
    'PyTorch': '#eba0ac',
    'Python': '#89b4fa',
    'AI/ML': '#b4befe',
    'NLP': '#f5c2e7',
    'C': '#89b4fa',
    'Assembly': '#f38ba8',
    'QEMU': '#fab387',
    'RISC-V': '#a6e3a1',
    'Rust': '#f2cdcd',
    'OCaml': '#f9e2af',
    'Compiler Design': '#cba6f7',
    'WebAssembly': '#cba6f7',
    'Emscripten': '#94e2d5',
    'JavaScript': '#f9e2af',
    'Performance': '#f38ba8',
    'React.js': '#89dceb',
    'Node.js': '#a6e3a1',
    'Express.js': '#9399b2',
    'MongoDB': '#a6e3a1',
    'Full-Stack': '#b4befe',
    'Java 21+': '#fab387',
    'Project Loom': '#fab387',
    'Maven': '#eba0ac',
    'CUDA': '#a6e3a1',
    'OpenGL': '#74c7ec',
    'HPC': '#f38ba8'
};

export default function ProjectDetail({ projectId }) {
    const allProjects = [...projectsData, ...workbenchProjects];
    const project = allProjects.find(p => p.id === projectId);

    if (!project) {
        return <p>Project not found</p>;
    }

    return (
        <>
            <h2>{project.title}</h2>
            <p style={{ whiteSpace: 'pre-line' }}>{project.fullDesc}</p>
            <h3>Key Features:</h3>
            <ul>
                {project.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                ))}
            </ul>
            <h3>Tech Stack:</h3>
            <div className="tech-stack">
                {project.techStack.map((tech, i) => (
                    <span
                        key={i}
                        className="tech-badge"
                        style={{
                            borderColor: techBadgeColors[tech] || '#585b70',
                            color: techBadgeColors[tech] || '#cdd6f4'
                        }}
                    >
                        {tech}
                    </span>
                ))}
            </div>
            <a href={project.github} className="github-button" target="_blank" rel="noopener">
                <GitHubIcon />
                View on GitHub
            </a>
        </>
    );
}
