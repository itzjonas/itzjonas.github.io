type SectionTitleProps = {
    /** e.g. 1 → // 01. */
    sectionNumber: number;
    /** Uppercase label after the dot */
    label: string;
    as?: 'h2' | 'h3';
    className?: string;
};

export function SectionTitle({ sectionNumber, label, as: Tag = 'h2', className = '' }: SectionTitleProps) {
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
