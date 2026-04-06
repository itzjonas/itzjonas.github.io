'use client';

import { useEffect, useReducer } from 'react';

import { cellKey, createInitialState, stepGhost, tryMovePacman } from '@/lib/pac-man-logic';
import { PAC_MAZE } from '@/lib/pac-man-maze';

import GhostSprite from './GhostSprite';
import Maze from './Maze';
import PacMan from './PacMan';

export const CELL = 16;

type GameState = ReturnType<typeof createInitialState>;

type GameAction =
    | { key: string; type: 'KEY' }
    | { type: 'HYDRATE_HIGH'; value: number }
    | { type: 'RESET' }
    | { type: 'TICK' };

function gameReducer(state: GameState, action: GameAction): GameState {
    if (action.type === 'RESET') {
        return { ...createInitialState(), highScore: state.highScore };
    }

    if (action.type === 'HYDRATE_HIGH') {
        return { ...state, highScore: Math.max(state.highScore, action.value) };
    }

    if (action.type === 'KEY') {
        const { key } = action;
        if (state.status !== 'playing') {
            if (key === ' ' || key === 'Enter') {
                return { ...createInitialState(), highScore: state.highScore };
            }
            return state;
        }
        let q = state.queued;
        switch (key) {
            case 'ArrowDown':
                q = 'down';
                break;
            case 'ArrowLeft':
                q = 'left';
                break;
            case 'ArrowRight':
                q = 'right';
                break;
            case 'ArrowUp':
                q = 'up';
                break;
            default:
                return state;
        }
        return { ...state, queued: q };
    }

    if (action.type === 'TICK') {
        if (state.status !== 'playing') {
            return state;
        }

        const maze = PAC_MAZE;
        const tickCount = state.tickCount + 1;

        const moved = tryMovePacman(state.pac, state.pacDir, state.queued, maze);
        let { pac, pacDir } = moved;

        let dots = state.dots;
        let score = state.score;
        let highScore = state.highScore;
        const eatenKey = cellKey(pac.x, pac.y);
        if (dots.has(eatenKey)) {
            dots = new Set(dots);
            dots.delete(eatenKey);
            score += 10;
            if (score > highScore) {
                highScore = score;
            }
        }

        let ghosts = state.ghosts;
        let status: 'lost' | 'playing' | 'won' = 'playing';

        for (const g of ghosts) {
            if (g.pos.x === pac.x && g.pos.y === pac.y) {
                status = 'lost';
                break;
            }
        }

        if (status === 'playing' && tickCount % 2 === 0) {
            ghosts = ghosts.map((g) => stepGhost(g, pac, maze));
            for (const g of ghosts) {
                if (g.pos.x === pac.x && g.pos.y === pac.y) {
                    status = 'lost';
                    break;
                }
            }
        }

        if (status === 'playing' && dots.size === 0) {
            status = 'won';
        }

        return {
            ...state,
            dots,
            ghosts,
            highScore,
            pac,
            pacDir,
            score,
            status,
            tickCount,
        };
    }

    return state;
}

const GHOST_COLORS = ['#ff2a8c', '#00e5ff', '#ff9f1c', '#7c3aed'] as const;

export default function Game() {
    const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState());

    useEffect(() => {
        try {
            const v = Number(localStorage.getItem('pacman-high') ?? '0');
            if (!Number.isNaN(v) && v > 0) {
                dispatch({ type: 'HYDRATE_HIGH', value: v });
            }
        } catch {
            /* noop */
        }
    }, []);

    useEffect(() => {
        if (state.highScore <= 0) return;
        try {
            localStorage.setItem('pacman-high', String(state.highScore));
        } catch {
            /* noop */
        }
    }, [state.highScore]);

    useEffect(() => {
        const id = window.setInterval(() => {
            dispatch({ type: 'TICK' });
        }, 185);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
            dispatch({ key: e.key, type: 'KEY' });
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const w = PAC_MAZE[0].length * CELL;
    const h = PAC_MAZE.length * CELL;

    return (
        <div className="relative mx-auto" style={{ height: h, width: w }}>
            <Maze cell={CELL} maze={PAC_MAZE} />

            {Array.from(state.dots).map((k) => {
                const [x, y] = k.split(',').map(Number);
                return (
                    <div
                        aria-hidden
                        className="pointer-events-none absolute rounded-full bg-synth-primary/90 shadow-[0_0_6px_rgba(0,229,255,0.6)]"
                        key={k}
                        style={{
                            height: 3,
                            left: x * CELL + CELL / 2 - 1.5,
                            top: y * CELL + CELL / 2 - 1.5,
                            width: 3,
                        }}
                    />
                );
            })}

            {state.ghosts.map((g) => (
                <GhostSprite cell={CELL} color={GHOST_COLORS[g.id % 4]} key={g.id} position={g.pos} />
            ))}

            <PacMan cell={CELL} direction={state.pacDir} position={state.pac} />

            {state.status === 'won' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/72 px-4 text-center backdrop-blur-[2px]">
                    <p className="font-orbitron text-lg font-bold tracking-wide text-synth-primary sm:text-xl">MAZE CLEAR</p>
                    <p className="mt-2 font-mono-label text-xs text-synth-text-muted">Space / Enter — run it back</p>
                </div>
            )}
            {state.status === 'lost' && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 px-4 text-center backdrop-blur-[2px]">
                    <p className="font-orbitron text-lg font-bold tracking-wide text-synth-secondary sm:text-xl">CAUGHT</p>
                    <p className="mt-2 font-mono-label text-xs text-synth-text-muted">Space / Enter — redeploy</p>
                </div>
            )}

            <div className="pointer-events-none absolute -top-10 left-0 right-0 flex justify-between gap-2 font-mono-label text-[10px] text-synth-text-muted sm:-top-11 sm:text-xs">
                <span className="text-synth-primary/90">SCORE {state.score}</span>
                <span className="text-synth-secondary/90">HI {state.highScore}</span>
            </div>
        </div>
    );
}
