export type Profile = {
    about: string[];
    company: string;
    heroLine1: string;
    heroLine2: string;
    location: string;
    name: string;
    tagline: string;
    title: string;
};

export type ExperienceItem = {
    company: string;
    highlights: string[];
    id: string;
    location?: string;
    range: string;
    role: string;
};

export type EducationItem = {
    degree: string;
    location?: string;
    range: string;
    school: string;
};

export type Certification = {
    href?: string;
    id?: string;
    imageAlt?: string;
    /** Path under /public, e.g. /certifications/foo.png */
    imageSrc?: string;
    issued: string;
    issuer: string;
    name: string;
    /** Set when planned; add href + issued date when the cert is earned */
    pending?: boolean;
};

export type SkillGroup = {
    skills: string[];
    title: string;
};

export type ProjectItem = {
    description: string;
    href: string;
    id: string;
    imageAlt: string;
    imageSrc: string;
    title: string;
};

export type Contact = {
    email: string;
    githubHref: string;
    githubLabel: string;
    linkedinHref: string;
    linkedinLabel: string;
};

export const profile: Profile = {
    about: [
        'I lead the frontend at ShedRx, building web experiences in healthcare tech with React, TypeScript, and Next.js, focused on performance, accessibility, and maintainable architecture.',
        'Before Shed, I spent years at Beyond, Inc. scaling trade and loyalty products, hardening government-facing apps for strict security requirements, and mentoring other engineers on the frontend.',
        'I care about mobile-first delivery, Core Web Vitals, and testable UIs. ESLint, Jest, and RTL have been part of my daily toolkit for a long time.',
    ],
    company: 'Shed',
    heroLine1: 'Jason',
    heroLine2: 'Seegmiller',
    location: 'Saratoga Springs, UT',
    name: 'Jason Seegmiller',
    tagline:
        'Frontend architecture, React, and shipping polished UX from healthcare to high-traffic retail.',
    title: 'Principal Front End Developer',
};

export const experience: ExperienceItem[] = [
    {
        company: 'Shed (ShedRx)',
        highlights: [
            'Migrated patient Portal from Vite to Next.js incrementally; checkout, signup, scheduling, and support without blocking delivery.',
            'Upgraded provider app (Shedweb) to Next.js 15 with Turbopack, Node, and CI.',
            'Integrated Whereby for HIPAA telehealth visits in the provider app, replacing Zoom.',
            'Updated Checkout: automated tax, unified purchasing; Put Me In Coach (coaching in checkout).',
            'Orders experience: payments, shipments, refills, and next steps; architecture docs for Checkout and Orders.',
            'CVE patches, reduced sensitive config exposure, runtime upgrades; stabilized payments, scheduling, and subscriptions.',
        ],
        id: 'shed',
        location: 'South Jordan, UT',
        range: 'Mar 2025 - Present',
        role: 'Principal Front End Developer',
    },
    {
        company: 'Beyond, Inc.',
        highlights: [
            'Scaled an MVP with cross-functional teams; DevOps with Git, Bitbucket, Docker, Kubernetes, Jenkins.',
            'Next.js, TypeScript, React, Material UI; Jest and React Testing Library for complex search and UI flows.',
            'Trade platform: custom boards, social sharing (Open Graph), sales kickbacks, PDF generation with Puppeteer.',
            'Mobile-first UX, performance and Core Web Vitals; ESLint/Prettier; “A-Team” support for high-priority issues.',
            'Beyond+ loyalty relaunch with new APIs; coordination with Ireland-based team.',
            'Led frontend on an international-trade initiative with external vendors (feature-flagged for release).',
        ],
        id: 'beyond-staff',
        location: 'Midvale, UT',
        range: 'Oct 2024 - Mar 2025',
        role: 'Staff Frontend Developer',
    },
    {
        company: 'Beyond, Inc.',
        highlights: [
            'Migrated OverstockGovernment.com from CRA/JSX to Next.js and TypeScript for scalability, performance, and state/federal security requirements.',
            'Isomorphic React with Node for SEO and faster TTI; Webpack, React, Storybook; Jest and linting discipline.',
            'REST messaging service delivering HTML fragments with inline styling for downstream renderers.',
        ],
        id: 'beyond-senior',
        location: 'Midvale, UT',
        range: 'Jun 2018 - Oct 2024',
        role: 'Senior Frontend Developer',
    },
    {
        company: 'Beyond, Inc.',
        highlights: [
            'Photoshop/Zeplin to production UIs for web and internal apps; SEO, style guide conformance, and page-weight optimization.',
            'Liaison between creative, NOC, and IT; documentation and cross-team delivery.',
        ],
        id: 'beyond-fe',
        location: 'Midvale, UT',
        range: 'Aug 2013 - May 2018',
        role: 'Frontend Developer',
    },
    {
        company: 'XanGo',
        highlights: [
            'Web and email content across WordPress, Drupal, and in-house systems; Lyris and ExactTarget campaigns.',
            'Coordinated web projects and email performance reporting; consistent brand across digital properties.',
        ],
        id: 'xango-content',
        location: 'Lehi, UT',
        range: 'Mar 2010 - Jul 2013',
        role: 'Web Content Manager',
    },
    {
        company: 'XanGo',
        highlights: [
            'Supervisor, technician, and agent roles; training on Windows and Mac; Apple Certified Technical Coordinator.',
        ],
        id: 'xango-desk',
        location: 'Lehi, UT',
        range: 'Jun 2005 - Mar 2010',
        role: 'Service Desk Specialist',
    },
    {
        company: 'XanGo',
        highlights: [
            'Inbound/outbound support for distributors; account assistance and solutions.',
        ],
        id: 'xango-cs',
        location: 'Lehi, UT',
        range: 'Feb 2005 - May 2005',
        role: 'Customer Service Agent',
    },
];

export const education: EducationItem[] = [
    {
        degree: 'Bachelor of Science, Business Administration',
        location: 'Salt Lake City, UT',
        range: '2006 - 2012',
        school: 'University of Utah',
    },
    {
        degree: 'Associate of Science, Business and Computer Science',
        location: 'Taylorsville, UT',
        range: '2004 - 2007',
        school: 'Salt Lake Community College',
    },
];

export const certifications: Certification[] = [
    {
        href: 'https://www.hackerrank.com/certificates/6bd811791ca0',
        id: 'hackerrank-software-engineer',
        imageAlt: 'HackerRank certificate: Software Engineer',
        imageSrc: '/certifications/hackerrank-software-engineer.png',
        issued: 'Apr 2026',
        issuer: 'HackerRank',
        name: 'Software Engineer - Role Certification',
    },
    {
        href: 'https://www.hackerrank.com/certificates/9db252691240',
        id: 'hackerrank-frontend-react',
        imageAlt: 'HackerRank certificate: Frontend Developer (React)',
        imageSrc: '/certifications/hackerrank-frontend-react.png',
        issued: 'Apr 2026',
        issuer: 'HackerRank',
        name: 'Frontend Developer (React) - Role Certification',
    },
    {
        href: 'https://www.hackerrank.com/certificates/7ffa7ee91ab4',
        id: 'hackerrank-javascript-intermediate',
        imageAlt: 'HackerRank certificate: JavaScript (Intermediate)',
        imageSrc: '/certifications/hackerrank-javascript-intermediate.png',
        issued: 'Apr 2026',
        issuer: 'HackerRank',
        name: 'JavaScript (Intermediate)',
    },
    {
        href: 'https://www.hackerrank.com/certificates/39f616b6ebef',
        id: 'hackerrank-node-intermediate',
        imageAlt: 'HackerRank certificate: Node.js (Intermediate)',
        imageSrc: '/certifications/hackerrank-node-intermediate.png',
        issued: 'Apr 2026',
        issuer: 'HackerRank',
        name: 'Node.js (Intermediate)',
    },
    {
        href: 'https://www.hackerrank.com/certificates/ff5bd207d4cf',
        id: 'hackerrank-rest-api-intermediate',
        imageAlt: 'HackerRank certificate: Rest API (Intermediate)',
        imageSrc: '/certifications/hackerrank-rest-api-intermediate.png',
        issued: 'Apr 2026',
        issuer: 'HackerRank',
        name: 'Rest API (Intermediate)',
    },
    {
        id: 'hackerrank-problem-solving-intermediate',
        issued: '—',
        issuer: 'HackerRank',
        name: 'Problem Solving (Intermediate)',
        pending: true,
    },
    { issued: 'Jul 2011', issuer: 'CIW', name: 'Web Design Professional' },
    {
        issued: 'May 2011',
        issuer: 'Microsoft',
        name: 'Microsoft Certified Technology Specialist: .NET Framework 4, Web Applications',
    },
    { issued: 'May 2007', issuer: 'Apple', name: 'Apple Certified Technical Coordinator 10.4' },
];

export const skillGroups: SkillGroup[] = [
    {
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
        title: 'Frontend',
    },
    {
        skills: ['Node.js', 'Express', 'REST', 'GraphQL'],
        title: 'Backend & APIs',
    },
    {
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
        title: 'Quality & DevOps',
    },
    {
        skills: [
            'Cursor',
            'Antigravity',
            'LM Studio',
            'Claude',
            'Gemini',
            'GPT',
            'Local distilled / GGUF models',
            'MCP',
            'Flux · flux.dev',
            'Prompt & agent workflows',
        ],
        title: 'AI',
    },
];

export const projects: ProjectItem[] = [
    {
        description:
            'Scaled an MVP with cross-functional teams: Git, Bitbucket, Docker, Kubernetes, Jenkins. Next.js, TypeScript, React, MUI; Jest and RTL. Trade professionals built boards, shared resources and social posts, earned kickbacks, and generated PDFs for accounting.',
        href: 'https://www.bedbathandbeyond.com/trade/profiles/1/Tiffany%20Doe',
        id: 'trade',
        imageAlt: 'Trade product',
        imageSrc: '/trade.jpeg',
        title: 'Trade',
    },
    {
        description:
            'Mobile-first UX, performance, Core Web Vitals, testability, ESLint/Prettier. Helped relaunch Beyond+ with new APIs alongside the Ireland-based team.',
        href: 'https://www.bedbathandbeyond.com/beyondplus/benefits',
        id: 'loyalty',
        imageAlt: 'Beyond+ loyalty',
        imageSrc: '/loyalty.jpeg',
        title: 'Loyalty (Beyond+)',
    },
];

export const contact: Contact = {
    email: 'itzjonas@gmail.com',
    githubHref: 'https://github.com/itzjonas',
    githubLabel: 'github.com/itzjonas',
    linkedinHref: 'https://www.linkedin.com/in/jasonseegmiller',
    linkedinLabel: 'linkedin.com/in/jasonseegmiller',
};
