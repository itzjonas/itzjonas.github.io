export type Profile = {
    name: string;
    title: string;
    company: string;
    location: string;
    tagline: string;
    about: string[];
};

export type ExperienceItem = {
    id: string;
    role: string;
    company: string;
    range: string;
    location?: string;
    highlights: string[];
};

export type EducationItem = {
    degree: string;
    school: string;
    range: string;
    location?: string;
};

export type Certification = {
    name: string;
    issuer: string;
    issued: string;
};

export type SkillGroup = {
    title: string;
    skills: string[];
};

export type ProjectItem = {
    id: string;
    title: string;
    description: string;
    href: string;
    imageSrc: string;
    imageAlt: string;
};

export type Contact = {
    email: string;
    linkedinLabel: string;
    linkedinHref: string;
    githubLabel: string;
    githubHref: string;
};

export const profile: Profile = {
    name: 'Jason Seegmiller',
    title: 'Principal Front End Developer',
    company: 'Shed',
    location: 'Saratoga Springs, UT',
    tagline:
        'Frontend architecture, React, and shipping polished UX — from healthcare to high-traffic retail.',
    about: [
        'I lead the frontend at ShedRx, building web experiences in healthcare tech with React, TypeScript, and Next.js — focused on performance, accessibility, and maintainable architecture.',
        'Before Shed, I spent years at Beyond, Inc. scaling trade and loyalty products, hardening government-facing apps for strict security requirements, and mentoring other engineers on the frontend.',
        'I care about mobile-first delivery, Core Web Vitals, and testable UIs — ESLint, Jest, and RTL have been part of my daily toolkit for a long time.',
    ],
};

export const experience: ExperienceItem[] = [
    {
        id: 'shed',
        role: 'Principal Front End Developer',
        company: 'Shed (ShedRx)',
        range: 'Mar 2025 – Present',
        location: 'Lehi, UT',
        highlights: [
            'Principal frontend for ShedRx: architecture, implementation, and quality for patient-facing web products.',
            'Healthcare tech stack: React, TypeScript, Next.js — emphasis on reliability and UX in a regulated space.',
        ],
    },
    {
        id: 'beyond-staff',
        role: 'Staff Frontend Developer',
        company: 'Beyond, Inc.',
        range: 'Oct 2024 – Mar 2025',
        location: 'Midvale, UT',
        highlights: [
            'Scaled an MVP with cross-functional teams; DevOps with Git, Bitbucket, Docker, Kubernetes, Jenkins.',
            'Next.js, TypeScript, React, Material UI; Jest and React Testing Library for complex search and UI flows.',
            'Trade platform: custom boards, social sharing (Open Graph), sales kickbacks, PDF generation with Puppeteer.',
            'Mobile-first UX, performance and Core Web Vitals; ESLint/Prettier; “A-Team” support for high-priority issues.',
            'Beyond+ loyalty relaunch with new APIs; coordination with Ireland-based team.',
            'Led frontend on an international-trade initiative with external vendors (feature-flagged for release).',
        ],
    },
    {
        id: 'beyond-senior',
        role: 'Senior Frontend Developer',
        company: 'Beyond, Inc.',
        range: 'Jun 2018 – Oct 2024',
        location: 'Midvale, UT',
        highlights: [
            'Migrated OverstockGovernment.com from CRA/JSX to Next.js and TypeScript for scalability, performance, and state/federal security requirements.',
            'Isomorphic React with Node for SEO and faster TTI; Webpack, React, Storybook; Jest and linting discipline.',
            'REST messaging service delivering HTML fragments with inline styling for downstream renderers.',
        ],
    },
    {
        id: 'beyond-fe',
        role: 'Frontend Developer',
        company: 'Beyond, Inc.',
        range: 'Aug 2013 – May 2018',
        location: 'Midvale, UT',
        highlights: [
            'Photoshop/Zeplin to production UIs for web and internal apps; SEO, style guide conformance, and page-weight optimization.',
            'Liaison between creative, NOC, and IT; documentation and cross-team delivery.',
        ],
    },
    {
        id: 'xango-content',
        role: 'Web Content Manager',
        company: 'XanGo',
        range: 'Mar 2010 – Jul 2013',
        location: 'Lehi, UT',
        highlights: [
            'Web and email content across WordPress, Drupal, and in-house systems; Lyris and ExactTarget campaigns.',
            'Coordinated web projects and email performance reporting; consistent brand across digital properties.',
        ],
    },
    {
        id: 'xango-desk',
        role: 'Service Desk Specialist',
        company: 'XanGo',
        range: 'Jun 2005 – Mar 2010',
        location: 'Lehi, UT',
        highlights: [
            'Supervisor, technician, and agent roles; training on Windows and Mac; Apple Certified Technical Coordinator.',
        ],
    },
    {
        id: 'xango-cs',
        role: 'Customer Service Agent',
        company: 'XanGo',
        range: 'Feb 2005 – May 2005',
        location: 'Lehi, UT',
        highlights: [
            'Inbound/outbound support for distributors; account assistance and solutions.',
        ],
    },
];

export const education: EducationItem[] = [
    {
        degree: 'Bachelor of Science, Business Administration',
        school: 'University of Utah',
        range: '2006 – 2012',
        location: 'Salt Lake City, UT',
    },
    {
        degree: 'Associate of Science, Business and Computer Science',
        school: 'Salt Lake Community College',
        range: '2004 – 2007',
        location: 'Taylorsville, UT',
    },
];

export const certifications: Certification[] = [
    { name: 'Web Design Professional', issuer: 'CIW', issued: 'Jul 2011' },
    {
        name: 'Microsoft Certified Technology Specialist: .NET Framework 4, Web Applications',
        issuer: 'Microsoft',
        issued: 'May 2011',
    },
    { name: 'Apple Certified Technical Coordinator 10.4', issuer: 'Apple', issued: 'May 2007' },
];

export const skillGroups: SkillGroup[] = [
    {
        title: 'Frontend',
        skills: [
            'React',
            'Next.js',
            'TypeScript',
            'JavaScript',
            'HTML',
            'CSS',
            'Material UI',
            'Webpack',
            'Storybook',
        ],
    },
    {
        title: 'Backend & APIs',
        skills: ['Node.js', 'Express', 'REST', 'GraphQL'],
    },
    {
        title: 'Quality & DevOps',
        skills: [
            'Git',
            'Bitbucket',
            'Docker',
            'Kubernetes',
            'Jenkins',
            'Jest',
            'React Testing Library',
            'ESLint',
            'Prettier',
        ],
    },
];

export const projects: ProjectItem[] = [
    {
        id: 'trade',
        title: 'Trade',
        description:
            'Scaled an MVP with cross-functional teams: Git, Bitbucket, Docker, Kubernetes, Jenkins. Next.js, TypeScript, React, MUI; Jest and RTL. Trade professionals built boards, shared resources and social posts, earned kickbacks, and generated PDFs for accounting.',
        href: 'https://www.bedbathandbeyond.com/trade/profiles/1/Tiffany%20Doe',
        imageSrc: '/trade.jpeg',
        imageAlt: 'Trade product',
    },
    {
        id: 'loyalty',
        title: 'Loyalty (Beyond+)',
        description:
            'Mobile-first UX, performance, Core Web Vitals, testability, ESLint/Prettier. Helped relaunch Beyond+ with new APIs alongside the Ireland-based team.',
        href: 'https://www.bedbathandbeyond.com/beyondplus/benefits',
        imageSrc: '/loyalty.jpeg',
        imageAlt: 'Beyond+ loyalty',
    },
];

export const contact: Contact = {
    email: 'itzjonas@gmail.com',
    linkedinLabel: 'linkedin.com/in/jasonseegmiller',
    linkedinHref: 'https://www.linkedin.com/in/jasonseegmiller',
    githubLabel: 'github.com/itzjonas',
    githubHref: 'https://github.com/itzjonas',
};
