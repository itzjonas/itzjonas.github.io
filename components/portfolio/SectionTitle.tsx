type SectionTitleProps = {
    as?: 'h2' | 'h3';
    className?: string;
    /** Uppercase label after the dot */
    label: string;
    /** e.g. 1 → // 01. */
    sectionNumber: number;
};

export function SectionTitle({ as: Tag = 'h2', className = '', label, sectionNumber }: SectionTitleProps) {
    const num = String(sectionNumber).padStart(2, '0');

    return (
        <Tag className={`mb-6 md:mb-8 flex flex-wrap items-baseline gap-x-2 gap-y-1 ${className}`}>
            <span className="font-mono-label text-sm md:text-base text-synth-primary/90 tracking-wide shrink-0">
                {'// '}
                {num}.{' '}
            </span>
            <span className="portfolio-heading text-xl sm:text-2xl font-bold">{label}</span>
        </Tag>
    );
}
