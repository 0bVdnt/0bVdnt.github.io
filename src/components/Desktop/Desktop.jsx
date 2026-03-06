import { AnimatePresence } from 'framer-motion';
import { useWindows } from '../../context/WindowContext';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import { ProfileWidget, StackWidget, LinksWidget } from '../Widget/Widget';
import Window from '../Window/Window';
import Terminal from '../Terminal/Terminal';
import { desktopIcons } from '../../data/desktopIcons';
import { projectsData, workbenchProjects } from '../../data/projects';

// Window content components
import AboutMe from '../../windows/AboutMe';
import Projects from '../../windows/Projects';
import ProjectDetail from '../../windows/ProjectDetail';
import Workbench from '../../windows/Workbench';
import Academics from '../../windows/Academics';
import Certifications from '../../windows/Certifications';
import Activities from '../../windows/Activities';
import Goals from '../../windows/Goals';
import Contact from '../../windows/Contact';
import Library from '../../windows/Library';
import CPStats from '../../windows/CPStats';
import Blogs from '../../windows/Blogs';

import './Desktop.css';

const windowTitles = {
    'about-me': 'About-Me.txt',
    'projects': 'C:\\Projects',
    'workbench': 'C:\\Workbench',
    'cp-stats': 'Profile: Competitive Programmer',
    'certifications': 'Achievements & Certifications',
    'academics': 'Academics',
    'activities': 'Activities',
    'goals': 'Career Goals',
    'library': 'Reading.txt - Notepad',
    'blogs': 'Blogs - Reader',
    'contact': 'New Message',
    'obvterm': 'ObvTerm'
};

const windowSizes = {
    'about-me': { width: 700, height: 600 },
    'projects': { width: 750, height: 600 },
    'workbench': { width: 700, height: 500 },
    'cp-stats': { width: 600, height: 500 },
    'certifications': { width: 700, height: 600 },
    'academics': { width: 650, height: 550 },
    'activities': { width: 750, height: 550 },
    'goals': { width: 650, height: 450 },
    'library': { width: 600, height: 450 },
    'blogs': { width: 800, height: 600 },
    'contact': { width: 550, height: 600 },
    'obvterm': { width: 800, height: 500 }
};

export default function Desktop() {
    const { windows } = useWindows();

    const renderWindowContent = (id) => {
        // Check if it's a project detail window
        const allProjects = [...projectsData, ...workbenchProjects];
        const project = allProjects.find(p => p.id === id);
        if (project) {
            return <ProjectDetail projectId={id} />;
        }

        switch (id) {
            case 'about-me': return <AboutMe />;
            case 'projects': return <Projects />;
            case 'workbench': return <Workbench />;
            case 'academics': return <Academics />;
            case 'certifications': return <Certifications />;
            case 'activities': return <Activities />;
            case 'goals': return <Goals />;
            case 'contact': return <Contact />;
            case 'library': return <Library />;
            case 'blogs': return <Blogs />;
            case 'cp-stats': return <CPStats />;
            case 'obvterm': return <Terminal />;
            default: return <p>Window not found</p>;
        }
    };

    const getWindowTitle = (id) => {
        const allProjects = [...projectsData, ...workbenchProjects];
        const project = allProjects.find(p => p.id === id);
        if (project) {
            return `Project: ${project.title}`;
        }
        return windowTitles[id] || id;
    };

    const getWindowSize = (id) => {
        const allProjects = [...projectsData, ...workbenchProjects];
        const project = allProjects.find(p => p.id === id);
        if (project) {
            return { width: 800, height: 650 };
        }
        return windowSizes[id] || { width: 600, height: 450 };
    };

    return (
        <div className="desktop">
            <div className="icon-grid">
                {desktopIcons.map(icon => (
                    <DesktopIcon key={icon.id} {...icon} />
                ))}
            </div>

            <div className="widget-container">
                <ProfileWidget />
                <StackWidget />
                <LinksWidget />
            </div>

            <AnimatePresence>
                {Object.keys(windows).map(id => {
                    const size = getWindowSize(id);
                    return (
                        <Window
                            key={id}
                            id={id}
                            title={getWindowTitle(id)}
                            defaultWidth={size.width}
                            defaultHeight={size.height}
                        >
                            {renderWindowContent(id)}
                        </Window>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
