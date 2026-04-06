type SectionTitleProps = {
    children: React.ReactNode;
    as?: 'h2' | 'h3';
    className?: string;
};

export function SectionTitle({ children, as: Tag = 'h2', className = '' }: SectionTitleProps) {
    return (
        <Tag className={`portfolio-heading text-xl sm:text-2xl font-bold mb-6 ${className}`}>
            {children}
        </Tag>
    );
}
