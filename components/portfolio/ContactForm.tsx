'use client';

import { FormEvent, useState } from 'react';

import { contact } from '@/lib/resume';

export function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Portfolio contact from ${name || 'visitor'}`);
        const body = encodeURIComponent(
            `${message}\n\n---\n${name ? `Name: ${name}\n` : ''}${email ? `Reply-to: ${email}` : ''}`,
        );
        window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    };

    return (
        <form className="flex flex-col gap-4 max-w-xl" noValidate onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
                <span className="font-mono-label text-xs text-synth-text-muted uppercase tracking-wider">Name</span>
                <input
                    autoComplete="name"
                    className="portfolio-input"
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ada Lovelace"
                    type="text"
                    value={name}
                />
            </label>
            <label className="flex flex-col gap-2">
                <span className="font-mono-label text-xs text-synth-text-muted uppercase tracking-wider">Email</span>
                <input
                    autoComplete="email"
                    className="portfolio-input"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                />
            </label>
            <label className="flex flex-col gap-2">
                <span className="font-mono-label text-xs text-synth-text-muted uppercase tracking-wider">Message</span>
                <textarea
                    className="portfolio-input min-h-[140px] resize-y"
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Say hello…"
                    required
                    rows={5}
                    value={message}
                />
            </label>
            <button className="btn-gradient w-full sm:w-auto mt-2" type="submit">
                Send message
            </button>
            <p className="font-mono-label text-xs text-synth-text-muted/80">
                Opens your mail client with this draft.
            </p>
        </form>
    );
}
