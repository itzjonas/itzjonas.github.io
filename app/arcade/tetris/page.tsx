'use client';

import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { SynthPageShell } from '@/components/SynthPageShell';

const C = {
    background: '#000000',
    blockBorder: 'rgba(240, 238, 245, 0.2)',
    emptyCell: 'rgba(5, 5, 12, 0.78)',
    ghost: 'rgba(240, 238, 245, 0.14)',
    grid: 'rgba(0, 229, 255, 0.05)',
    panelBorder: 'rgba(0, 229, 255, 0.2)',
    panelFill: 'rgba(0, 0, 0, 0.55)',
    textLose: '#ff2a8c',
    textPause: '#ff9f1c',
    textWin: '#00e5ff',
};

const BOARD_COLS = 10;
const BOARD_ROWS = 20;
const DROP_MS_BASE = 700;
const LOCK_DELAY_MS = 440;

type GameStatus = 'game-over' | 'paused' | 'playing';
type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
type Cell = null | PieceType;
type Board = Cell[][];
type Piece = { shape: number[][]; type: PieceType; x: number; y: number };

const PIECE_COLORS: Record<PieceType, string> = {
    I: '#00e5ff',
    J: '#7c3aed',
    L: '#ff9f1c',
    O: '#ffcc00',
    S: '#39ff14',
    T: '#ff2a8c',
    Z: '#f43f5e',
};

const PIECES: Record<PieceType, number[][]> = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
};

function getFullscreenElement(): Element | null {
    const doc = document as { webkitFullscreenElement?: Element | null } & Document;
    return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

async function requestFullscreen(el: HTMLElement): Promise<void> {
    const anyEl = el as {
        mozRequestFullScreen?: () => void;
        msRequestFullscreen?: () => void;
        webkitRequestFullscreen?: () => void;
    } & HTMLElement;
    if (el.requestFullscreen) {
        await el.requestFullscreen();
    } else if (anyEl.webkitRequestFullscreen) {
        anyEl.webkitRequestFullscreen();
    } else if (anyEl.mozRequestFullScreen) {
        anyEl.mozRequestFullScreen();
    } else if (anyEl.msRequestFullscreen) {
        anyEl.msRequestFullscreen();
    }
}

async function exitFullscreen(): Promise<void> {
    const doc = document as {
        mozCancelFullScreen?: () => void;
        msExitFullscreen?: () => void;
        webkitExitFullscreen?: () => void;
    } & Document;
    if (document.exitFullscreen) {
        await document.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    }
}

function createEmptyBoard(): Board {
    return Array.from({ length: BOARD_ROWS }, () => Array.from({ length: BOARD_COLS }, () => null));
}

function rotateShape(shape: number[][]): number[][] {
    const size = shape.length;
    const next = Array.from({ length: size }, () => Array.from({ length: size }, () => 0));
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            next[x][size - y - 1] = shape[y][x];
        }
    }
    return next;
}

function cloneBoard(board: Board): Board {
    return board.map((row) => row.slice());
}

function TetrisCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [status, setStatus] = useState<GameStatus>('playing');
    const [nextType, setNextType] = useState<PieceType>('I');

    const gameRef = useRef({
        board: createEmptyBoard(),
        current: null as null | Piece,
        dropAccumulator: 0,
        lastTime: 0,
        lockAccumulator: 0,
        next: 'I' as PieceType,
        rafId: 0 as null | number,
    });

    const pickRandomType = useCallback((): PieceType => {
        const all: PieceType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        return all[Math.floor(Math.random() * all.length)];
    }, []);

    const canPlace = useCallback((board: Board, piece: Piece): boolean => {
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] === 0) continue;
                const px = piece.x + x;
                const py = piece.y + y;
                if (px < 0 || px >= BOARD_COLS || py >= BOARD_ROWS) {
                    return false;
                }
                if (py >= 0 && board[py][px] !== null) {
                    return false;
                }
            }
        }
        return true;
    }, []);

    const getSpawnedPiece = useCallback((type: PieceType): Piece => {
        const shape = PIECES[type].map((row) => row.slice());
        const x = Math.floor((BOARD_COLS - shape[0].length) / 2);
        return { shape, type, x, y: -1 };
    }, []);

    const mergePiece = useCallback((board: Board, piece: Piece): Board => {
        const merged = cloneBoard(board);
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x] === 0) continue;
                const py = piece.y + y;
                const px = piece.x + x;
                if (py < 0) continue;
                merged[py][px] = piece.type;
            }
        }
        return merged;
    }, []);

    const clearLines = useCallback((board: Board) => {
        const keep = board.filter((row) => row.some((cell) => cell === null));
        const removed = BOARD_ROWS - keep.length;
        while (keep.length < BOARD_ROWS) {
            keep.unshift(Array.from({ length: BOARD_COLS }, () => null));
        }
        return { board: keep, removed };
    }, []);

    const award = useCallback(
        (removed: number) => {
            if (removed === 0) return;
            const pointsByLine = [0, 100, 300, 500, 800];
            setLines((prevLines) => {
                const nextLines = prevLines + removed;
                const nextLevel = Math.floor(nextLines / 10) + 1;
                setLevel(nextLevel);
                return nextLines;
            });
            setScore((prevScore) => {
                const gain = pointsByLine[removed] * level;
                const nextScore = prevScore + gain;
                setHighScore((prevHigh) => {
                    if (nextScore <= prevHigh) return prevHigh;
                    try {
                        localStorage.setItem('tetris-high', String(nextScore));
                    } catch {
                        /* noop */
                    }
                    return nextScore;
                });
                return nextScore;
            });
        },
        [level],
    );

    const spawnNext = useCallback(() => {
        const game = gameRef.current;
        const piece = getSpawnedPiece(game.next);
        game.current = piece;
        game.next = pickRandomType();
        setNextType(game.next);
        game.lockAccumulator = 0;
        if (!canPlace(game.board, piece)) {
            setStatus('game-over');
        }
    }, [canPlace, getSpawnedPiece, pickRandomType]);

    const hardDrop = useCallback(() => {
        const game = gameRef.current;
        const piece = game.current;
        if (!piece || status !== 'playing') return;
        let dropped = 0;
        let next = { ...piece };
        while (canPlace(game.board, { ...next, y: next.y + 1 })) {
            next = { ...next, y: next.y + 1 };
            dropped++;
        }
        game.current = next;
        if (dropped > 0) {
            setScore((prev) => prev + dropped * 2);
        }
        game.lockAccumulator = LOCK_DELAY_MS + 1;
    }, [canPlace, status]);

    const restart = useCallback(() => {
        const game = gameRef.current;
        game.board = createEmptyBoard();
        game.dropAccumulator = 0;
        game.lockAccumulator = 0;
        setScore(0);
        setLines(0);
        setLevel(1);
        setStatus('playing');
        game.next = pickRandomType();
        setNextType(game.next);
        spawnNext();
    }, [pickRandomType, spawnNext]);

    useEffect(() => {
        try {
            const stored = Number(localStorage.getItem('tetris-high') ?? '0');
            if (!Number.isNaN(stored)) {
                setHighScore(stored);
            }
        } catch {
            /* noop */
        }
    }, []);

    useEffect(() => {
        const game = gameRef.current;
        game.next = pickRandomType();
        setNextType(game.next);
        spawnNext();
    }, [pickRandomType, spawnNext]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const game = gameRef.current;
            if (e.code === 'KeyP') {
                setStatus((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
                return;
            }
            if (status === 'game-over' && e.code === 'Enter') {
                restart();
                return;
            }
            if (status !== 'playing' || !game.current) return;

            if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            if (e.code === 'ArrowLeft') {
                const next = { ...game.current, x: game.current.x - 1 };
                if (canPlace(game.board, next)) game.current = next;
                return;
            }
            if (e.code === 'ArrowRight') {
                const next = { ...game.current, x: game.current.x + 1 };
                if (canPlace(game.board, next)) game.current = next;
                return;
            }
            if (e.code === 'ArrowDown') {
                const next = { ...game.current, y: game.current.y + 1 };
                if (canPlace(game.board, next)) {
                    game.current = next;
                    setScore((prev) => prev + 1);
                }
                return;
            }
            if (e.code === 'ArrowUp') {
                const rotated = { ...game.current, shape: rotateShape(game.current.shape) };
                const kicks = [0, -1, 1, -2, 2];
                for (const kick of kicks) {
                    const candidate = { ...rotated, x: rotated.x + kick };
                    if (canPlace(game.board, candidate)) {
                        game.current = candidate;
                        return;
                    }
                }
                return;
            }
            if (e.code === 'Space') {
                hardDrop();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [canPlace, hardDrop, restart, status]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        const game = gameRef.current;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const { height, width } = container.getBoundingClientRect();
            canvas.width = Math.max(320, width);
            canvas.height = Math.max(420, height);
        };

        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(container);

        const drawCell = (x: number, y: number, color: string, cellSize: number, offsetX: number, offsetY: number) => {
            const px = offsetX + x * cellSize;
            const py = offsetY + y * cellSize;
            ctx.fillStyle = color;
            ctx.fillRect(px, py, cellSize, cellSize);
            ctx.strokeStyle = C.blockBorder;
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 0.5, py + 0.5, cellSize - 1, cellSize - 1);
        };

        const gameTick = (deltaMs: number) => {
            const game = gameRef.current;
            if (status !== 'playing' || !game.current) return;

            const dropMs = Math.max(95, DROP_MS_BASE - (level - 1) * 62);
            game.dropAccumulator += deltaMs;

            const movedDown = { ...game.current, y: game.current.y + 1 };
            const canMoveDown = canPlace(game.board, movedDown);
            if (!canMoveDown) {
                game.lockAccumulator += deltaMs;
            } else {
                game.lockAccumulator = 0;
            }

            while (game.dropAccumulator >= dropMs) {
                game.dropAccumulator -= dropMs;
                const next = { ...game.current, y: game.current.y + 1 };
                if (canPlace(game.board, next)) {
                    game.current = next;
                } else {
                    game.lockAccumulator = LOCK_DELAY_MS + 1;
                    break;
                }
            }

            if (game.lockAccumulator > LOCK_DELAY_MS && game.current) {
                game.board = mergePiece(game.board, game.current);
                const cleared = clearLines(game.board);
                game.board = cleared.board;
                award(cleared.removed);
                spawnNext();
            }
        };

        const render = (timestamp: number) => {
            const deltaMs = Math.min(40, timestamp - (game.lastTime || timestamp));
            game.lastTime = timestamp;
            gameTick(deltaMs);

            ctx.fillStyle = C.background;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = C.grid;
            for (let x = 0; x <= canvas.width; x += 52) {
                ctx.fillRect(x, 0, 1, canvas.height);
            }
            for (let y = 0; y <= canvas.height; y += 52) {
                ctx.fillRect(0, y, canvas.width, 1);
            }

            const cellSize = Math.floor(Math.min(canvas.width / (BOARD_COLS + 7), canvas.height / (BOARD_ROWS + 2)));
            const boardWidth = BOARD_COLS * cellSize;
            const boardHeight = BOARD_ROWS * cellSize;
            const offsetX = Math.floor((canvas.width - boardWidth) / 2) - cellSize;
            const offsetY = Math.floor((canvas.height - boardHeight) / 2);
            const panelX = offsetX + boardWidth + cellSize;

            ctx.fillStyle = C.panelFill;
            ctx.strokeStyle = C.panelBorder;
            ctx.lineWidth = 1;
            ctx.fillRect(offsetX - 8, offsetY - 8, boardWidth + 16, boardHeight + 16);
            ctx.strokeRect(offsetX - 8, offsetY - 8, boardWidth + 16, boardHeight + 16);

            for (let row = 0; row < BOARD_ROWS; row++) {
                for (let col = 0; col < BOARD_COLS; col++) {
                    const cell = game.board[row][col];
                    if (cell === null) {
                        drawCell(col, row, C.emptyCell, cellSize, offsetX, offsetY);
                    } else {
                        drawCell(col, row, PIECE_COLORS[cell], cellSize, offsetX, offsetY);
                    }
                }
            }

            if (game.current) {
                let ghostY = game.current.y;
                while (canPlace(game.board, { ...game.current, y: ghostY + 1 })) {
                    ghostY++;
                }
                for (let y = 0; y < game.current.shape.length; y++) {
                    for (let x = 0; x < game.current.shape[y].length; x++) {
                        if (game.current.shape[y][x] === 0) continue;
                        const gy = ghostY + y;
                        const gx = game.current.x + x;
                        if (gy < 0) continue;
                        drawCell(gx, gy, C.ghost, cellSize, offsetX, offsetY);
                    }
                }
                for (let y = 0; y < game.current.shape.length; y++) {
                    for (let x = 0; x < game.current.shape[y].length; x++) {
                        if (game.current.shape[y][x] === 0) continue;
                        const py = game.current.y + y;
                        const px = game.current.x + x;
                        if (py < 0) continue;
                        drawCell(px, py, PIECE_COLORS[game.current.type], cellSize, offsetX, offsetY);
                    }
                }
            }

            ctx.fillStyle = C.panelFill;
            ctx.strokeStyle = C.panelBorder;
            ctx.fillRect(panelX, offsetY, cellSize * 5, cellSize * 7);
            ctx.strokeRect(panelX, offsetY, cellSize * 5, cellSize * 7);

            ctx.fillStyle = '#f0eef5';
            ctx.font = `${Math.max(10, Math.floor(cellSize * 0.45))}px ui-monospace, monospace`;
            ctx.fillText('NEXT', panelX + cellSize * 0.7, offsetY + cellSize * 0.9);

            const nextShape = PIECES[nextType];
            const shapeOffsetX = panelX + cellSize;
            const shapeOffsetY = offsetY + cellSize * 1.5;
            for (let y = 0; y < nextShape.length; y++) {
                for (let x = 0; x < nextShape[y].length; x++) {
                    if (nextShape[y][x] === 0) continue;
                    drawCell(x, y, PIECE_COLORS[nextType], cellSize * 0.8, shapeOffsetX, shapeOffsetY);
                }
            }

            if (status === 'paused') {
                ctx.fillStyle = C.textPause;
                ctx.font = 'bold 24px Orbitron, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
            }
            if (status === 'game-over') {
                ctx.fillStyle = C.textLose;
                ctx.font = 'bold 24px Orbitron, system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 8);
                ctx.fillStyle = C.textWin;
                ctx.font = '13px ui-monospace, monospace';
                ctx.fillText('Press ENTER to restart', canvas.width / 2, canvas.height / 2 + 20);
            }

            game.rafId = requestAnimationFrame(render);
        };

        game.rafId = requestAnimationFrame(render);
        return () => {
            ro.disconnect();
            if (game.rafId != null) {
                cancelAnimationFrame(game.rafId);
            }
        };
    }, [award, canPlace, clearLines, level, mergePiece, nextType, spawnNext, status]);

    return (
        <div className="relative h-full w-full" ref={containerRef}>
            <canvas ref={canvasRef} className="block h-full w-full bg-black" />
            <div className="absolute top-3 left-3 z-10 max-w-[min(100%,14rem)] rounded border border-cyan-500/25 bg-black/55 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-primary/85 sm:text-xs">SCORE</p>
                <p className="font-orbitron text-xl tabular-nums text-synth-primary sm:text-2xl">{score}</p>
            </div>
            <div className="absolute top-3 right-3 z-10 rounded border border-fuchsia-500/20 bg-black/55 px-3 py-2 text-right backdrop-blur-sm sm:px-4 sm:py-3">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-secondary/90 sm:text-xs">LEVEL</p>
                <p className="font-orbitron text-xl tabular-nums text-synth-secondary sm:text-2xl">{level}</p>
            </div>
            <div className="absolute bottom-3 left-3 z-10 rounded border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-sm">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-synth-text-muted sm:text-xs">LINES / HI</p>
                <p className="font-orbitron text-lg tabular-nums text-synth-text sm:text-xl">
                    {lines} / {highScore}
                </p>
            </div>
        </div>
    );
}

export default function TetrisPage() {
    const gameShellRef = useRef<HTMLDivElement | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const syncFullscreen = useCallback(() => {
        const el = getFullscreenElement();
        setIsFullscreen(el !== null && el === gameShellRef.current);
    }, []);

    useEffect(() => {
        document.addEventListener('fullscreenchange', syncFullscreen);
        document.addEventListener('webkitfullscreenchange', syncFullscreen);
        return () => {
            document.removeEventListener('fullscreenchange', syncFullscreen);
            document.removeEventListener('webkitfullscreenchange', syncFullscreen);
        };
    }, [syncFullscreen]);

    const toggleFullscreen = useCallback(async () => {
        const el = gameShellRef.current;
        if (!el) return;
        try {
            if (!getFullscreenElement()) {
                await requestFullscreen(el);
            } else {
                await exitFullscreen();
            }
        } catch {
            /* noop */
        }
    }, []);

    return (
        <SynthPageShell innerClassName="max-w-6xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                    className="portfolio-link inline-flex items-center gap-2 font-mono-label text-sm tracking-wide"
                    href="/arcade"
                >
                    <ArrowLeft aria-hidden className="h-4 w-4" strokeWidth={2} />
                    Back to arcade
                </Link>
                <span className="font-mono-label text-sm text-synth-primary/80">{'// Neon Tetris Matrix'}</span>
            </div>

            <div className="portfolio-card overflow-hidden p-2 sm:p-3">
                <div className="hud-frame relative w-full">
                    <span aria-hidden className="hud-frame__bracket hud-frame__bracket--tr" />
                    <span aria-hidden className="hud-frame__bracket hud-frame__bracket--bl" />
                    <div
                        ref={gameShellRef}
                        className={
                            isFullscreen
                                ? 'relative h-full min-h-0 w-full overflow-hidden bg-synth-bg-mid'
                                : 'relative h-[min(75vh,820px)] min-h-[360px] w-full overflow-hidden bg-synth-bg-mid'
                        }
                    >
                        <TetrisCanvas />
                        <div className="absolute bottom-3 right-3 z-30">
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 rounded border border-cyan-500/35 bg-black/65 px-3 py-2 font-mono-label text-xs uppercase tracking-wider text-synth-primary shadow-[0_0_20px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-colors hover:border-synth-primary/60 hover:text-white"
                                aria-pressed={isFullscreen}
                                title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Fill the screen with the playfield'}
                                onClick={toggleFullscreen}
                            >
                                {isFullscreen ? (
                                    <Minimize2 aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
                                ) : (
                                    <Maximize2 aria-hidden className="h-4 w-4 shrink-0" strokeWidth={2} />
                                )}
                                <span className="max-sm:sr-only">{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-center font-mono-label text-xs leading-relaxed text-synth-text-muted sm:text-left">
                Left/Right move · Up rotate · Down soft drop · Space hard drop · P pause · Enter restarts after game over
            </p>
        </SynthPageShell>
    );
}
