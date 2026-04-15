/**
 * Design tokens for the portfolio shell. Intended to be overwritten when Google Stitch
 * MCP (list_projects / get_project / list_design_systems) is used to pull designTheme
 * and DTCG tokens. Stitch was unavailable during implementation, so these match the
 * plan’s sleek + synthwave direction (dark base, cyan/magenta accents, ROUND_EIGHT cards).
 */
export const stitchThemeFallback = {
    bodyFontHint: 'DM_SANS' as const,
    headlineFontHint: 'ORBITRON' as const,
    namedColors: {
        accent: '#ff9f1c',
        background: '#0c0618',
        border: '#ff00ff',
        primary: '#00e5ff',
        secondary: '#ff2a8c',
        surface: '#150a24',
        surfaceElevated: '#1e0f32',
        tertiary: '#7c3aed',
        text: '#e8e4ef',
        textMuted: '#9b92b0',
    },
    /** Maps Stitch DesignTheme.roundness ROUND_* to Tailwind-ish radius */
    roundness: 'ROUND_EIGHT' as const,
} as const;
