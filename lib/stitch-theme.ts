/**
 * Design tokens for the portfolio shell. Intended to be overwritten when Google Stitch
 * MCP (list_projects / get_project / list_design_systems) is used to pull designTheme
 * and DTCG tokens — Stitch was unavailable during implementation, so these match the
 * plan’s sleek + synthwave direction (dark base, cyan/magenta accents, ROUND_EIGHT cards).
 */
export const stitchThemeFallback = {
    namedColors: {
        background: '#0c0618',
        surface: '#150a24',
        surfaceElevated: '#1e0f32',
        primary: '#00e5ff',
        secondary: '#ff2a8c',
        tertiary: '#7c3aed',
        accent: '#ff9f1c',
        text: '#e8e4ef',
        textMuted: '#9b92b0',
        border: '#ff00ff',
    },
    /** Maps Stitch DesignTheme.roundness ROUND_* to Tailwind-ish radius */
    roundness: 'ROUND_EIGHT' as const,
    bodyFontHint: 'DM_SANS' as const,
    headlineFontHint: 'ORBITRON' as const,
} as const;
