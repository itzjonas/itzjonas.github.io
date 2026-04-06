import { contact } from '@/lib/resume';

import { ContactForm } from './ContactForm';
import { SectionTitle } from './SectionTitle';

export function Contact() {
    return (
        <section className="portfolio-section mb-16 md:mb-24" id="contact">
            <SectionTitle label="DATA_CONTACT" sectionNumber={7} />
            <p className="text-synth-text-muted mb-8 max-w-xl">
                Want to connect? Drop a line below, or reach me directly.
            </p>
            <ContactForm />
            <ul className="space-y-2 text-synth-accent mt-10 pt-8 border-t border-white/10 font-mono-label text-sm">
                <li>
                    <a className="portfolio-link" href={`mailto:${contact.email}`}>
                        {contact.email}
                    </a>
                </li>
                <li>
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
                    <a className="portfolio-link" href={contact.githubHref} rel="noopener noreferrer" target="_blank">
                        {contact.githubLabel}
                    </a>
                </li>
            </ul>
        </section>
    );
}
