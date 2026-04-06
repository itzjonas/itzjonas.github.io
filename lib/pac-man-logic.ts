import type { Direction, Ghost, Position } from '@/types/pac-man';

import { PAC_MAZE, TUNNEL_ROW } from '@/lib/pac-man-maze';

export function cellKey(x: number, y: number) {
    return `${x},${y}`;
}

export function nextPosition(pos: Position, dir: Direction, maze: number[][]): Position | null {
    const H = maze.length;
    const W = maze[0].length;
    const TY = TUNNEL_ROW;

    if (pos.y === TY) {
        if (dir === 'left' && pos.x === 0) {
            return maze[TY][W - 1] === 0 ? { x: W - 1, y: TY } : null;
        }
        if (dir === 'right' && pos.x === W - 1) {
            return maze[TY][0] === 0 ? { x: 0, y: TY } : null;
        }
    }

    let nx = pos.x;
    let ny = pos.y;
    if (dir === 'up') ny -= 1;
    else if (dir === 'down') ny += 1;
    else if (dir === 'left') nx -= 1;
    else if (dir === 'right') nx += 1;

    if (ny < 0 || ny >= H || nx < 0 || nx >= W) return null;
    if (maze[ny][nx] !== 0) return null;
    return { x: nx, y: ny };
}

const OPP: Record<Direction, Direction> = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left',
};

const DIR_RANK: Record<Direction, number> = {
    up: 0,
    left: 1,
    right: 2,
    down: 3,
};

export function manhattan(a: Position, b: Position) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function tryMovePacman(
    pac: Position,
    pacDir: Direction,
    queued: Direction,
    maze: number[][],
): { pac: Position; pacDir: Direction } {
    let nextDir = pacDir;
    if (nextPosition(pac, queued, maze)) {
        nextDir = queued;
    }
    const np = nextPosition(pac, nextDir, maze);
    if (np) {
        return { pac: np, pacDir: nextDir };
    }
    return { pac, pacDir };
}

/** Greedy chase toward target; avoids reversing unless stuck */
export function stepGhost(g: Ghost, target: Position, maze: number[][]): Ghost {
    const dirs: Direction[] = ['up', 'down', 'left', 'right'];
    const valid = dirs.filter((d) => {
        if (d === OPP[g.dir]) return false;
        return nextPosition(g.pos, d, maze) !== null;
    });
    let choices = valid;
    if (choices.length === 0) {
        const rev = OPP[g.dir];
        const np = nextPosition(g.pos, rev, maze);
        if (np) return { ...g, pos: np, dir: rev };
        return g;
    }

    choices.sort((a, b) => {
        const pa = nextPosition(g.pos, a, maze)!;
        const pb = nextPosition(g.pos, b, maze)!;
        const da = manhattan(pa, target);
        const db = manhattan(pb, target);
        if (da !== db) return da - db;
        return DIR_RANK[a] - DIR_RANK[b];
    });

    const pick = choices[0];
    return { ...g, pos: nextPosition(g.pos, pick, maze)!, dir: pick };
}

const NO_DOT_KEYS = new Set(['14,23', '13,14', '14,14', '15,14', '16,14']);

export function buildInitialDots(maze: number[][]) {
    const dots = new Set<string>();
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[0].length; x++) {
            if (maze[y][x] !== 0) continue;
            const k = cellKey(x, y);
            if (NO_DOT_KEYS.has(k)) continue;
            dots.add(k);
        }
    }
    return dots;
}

export function initialGhosts(): Ghost[] {
    return [
        { id: 0, pos: { x: 13, y: 14 }, dir: 'left' },
        { id: 1, pos: { x: 14, y: 14 }, dir: 'up' },
        { id: 2, pos: { x: 15, y: 14 }, dir: 'up' },
        { id: 3, pos: { x: 16, y: 14 }, dir: 'right' },
    ];
}

export function createInitialState() {
    return {
        pac: { x: 14, y: 23 } as Position,
        pacDir: 'right' as Direction,
        ghosts: initialGhosts(),
        highScore: 0,
        queued: 'right' as Direction,
        dots: buildInitialDots(PAC_MAZE),
        score: 0,
        tickCount: 0,
        status: 'playing' as 'playing' | 'won' | 'lost',
    };
}
