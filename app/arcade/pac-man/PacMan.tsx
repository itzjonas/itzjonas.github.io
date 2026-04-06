'use client';

import type { Direction, Position } from '@/types/pac-man';

const ROTATE: Record<Direction, string> = {
    down: '90deg',
    left: '180deg',
    right: '0deg',
    up: '-90deg',
};

type PacManProps = {
    cell: number;
    direction: Direction;
    position: Position;
};

export default function PacMan({ cell, direction, position }: PacManProps) {
    const s = cell * 0.85;
    const off = (cell - s) / 2;

    return (
        <div
            className="absolute z-10"
            style={{
                height: s,
                left: position.x * cell + off,
                top: position.y * cell + off,
                transform: `rotate(${ROTATE[direction]})`,
                transition: 'transform 0.08s linear',
                width: s,
            }}
        >
            <div
                className="h-full w-full rounded-full bg-[#ffe066] shadow-[0_0_14px_rgba(255,224,102,0.55)]"
                style={{
                    background: 'conic-gradient(from 45deg at 50% 50%, transparent 55deg, #ffe066 55deg, #fbbf24 360deg)',
                }}
            />
        </div>
    );
}
