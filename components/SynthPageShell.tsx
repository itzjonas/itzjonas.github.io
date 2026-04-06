type SynthPageShellProps = {
    children: React.ReactNode;
    className?: string;
    innerClassName?: string;
};

/**
 * Same visual shell as the home page: grid background, synth palette, inner padding aligned with portfolio-inner.
 */
export function SynthPageShell({ children, className = '', innerClassName = '' }: SynthPageShellProps) {
    return (
        <div className={`portfolio-root text-synth-text min-h-screen ${className}`}>
            <div
                className={`portfolio-inner relative z-10 flex w-full flex-col py-8 sm:py-12 md:py-16 lg:py-20 ${innerClassName}`}
            >
                {children}
            </div>
        </div>
    );
}
