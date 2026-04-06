import { contact } from '@/lib/resume';

import { SectionTitle } from './SectionTitle';

export function Contact() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="contact">
            <SectionTitle>Contact</SectionTitle>
            <p className="text-synth-text-muted mb-6 max-w-xl">
                Want to connect? Reach out — always happy to talk frontend, architecture, or collaboration.
            </p>
            <ul className="space-y-3 text-synth-accent">
                <li>
                    Email:{' '}
                    <a className="portfolio-link" href={`mailto:${contact.email}`}>
                        {contact.email}
                    </a>
                </li>
                <li>
                    LinkedIn:{' '}
                    <a
                        className="portfolio-link"
                        href={contact.linkedinHref}
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        {contact.linkedinLabel}
                    </a>
                </li>
                <li>
                    GitHub:{' '}
                    <a className="portfolio-link" href={contact.githubHref} rel="noopener noreferrer" target="_blank">
                        {contact.githubLabel}
                    </a>
                </li>
            </ul>
        </section>
    );
}
