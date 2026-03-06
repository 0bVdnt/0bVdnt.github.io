export const desktopIcons = [
    { id: 'about-me', name: 'About-Me', icon: '/assets/me.gif', type: 'window' },
    { id: 'projects', name: 'Projects', icon: '/assets/projects.gif', type: 'window' },
    { id: 'workbench', name: 'Workbench', icon: '/assets/workbench.png', type: 'window' },
    { id: 'cp-stats', name: 'CP-Stats', icon: '/assets/cp_stats.gif', type: 'window' },
    { id: 'certifications', name: 'Achievements', icon: '/assets/certs.png', type: 'window' },
    { id: 'academics', name: 'Academics', icon: '/assets/academics.png', type: 'window' },
    { id: 'activities', name: 'Activities', icon: '/assets/extraCurr.png', type: 'window' },
    { id: 'goals', name: 'Goals', icon: '/assets/goals.png', type: 'window' },
    { id: 'library', name: 'Reading.txt', icon: '/assets/library.gif', type: 'window' },
    { id: 'blogs', name: 'Blogs', icon: '/assets/blogs.gif', type: 'window' },
    { id: 'resume', name: 'Resume.pdf', icon: '/assets/resume.png', type: 'link', url: 'https://drive.google.com/file/d/1AXKKNJery1O_8104KShRuHgAwvKbUCtb/' },
    { id: 'obvterm', name: '0bV-Term', icon: '/assets/terminal.webp', type: 'window' },
    { id: 'github', name: 'GitHub', icon: '/assets/github-octopuss.gif', type: 'link', url: 'https://github.com/0bVdnt' },
    { id: 'linkedin', name: 'LinkedIn', icon: '/assets/linkedin.gif', type: 'link', url: 'https://linkedin.com/in/vedantneve' },
    { id: 'leetcode', name: 'LeetCode', icon: '/assets/leetcode.png', type: 'link', url: 'https://leetcode.com/u/0bVdnt' },
    { id: 'contact', name: 'Contact', icon: '/assets/contact-me.png', type: 'window' }
];

export const terminalCommands = ['help', 'whoami', 'ls', 'open', 'socials', 'contact', 'date', 'clear', 'cls', 'exit', 'status', 'cat'];

export const terminalAliasMap = {
    'obvterm': ['terminal', 'term', 'shell'],
    'about-me': ['about', 'me', 'bio'],
    'projects': ['proj', 'project', 'work'],
    'workbench': ['bench', 'forge', 'current'],
    'academics': ['edu', 'education', 'school'],
    'certifications': ['certs', 'badges'],
    'activities': ['activity', 'clubs', 'extra'],
    'goals': ['goal'],
    'contact': ['email', 'reach', 'talk'],
    'library': ['reading', 'books', 'notes'],
    'blogs': ['blog', 'articles']
};
