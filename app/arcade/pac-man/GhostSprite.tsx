'use client';

import type { Position } from '@/types/pac-man';

type GhostSpriteProps = {
    cell: number;
    color: string;
    position: Position;
};

export default function GhostSprite({ cell, color, position }: GhostSpriteProps) {
    const s = cell * 0.82;
    const off = (cell - s) / 2;

    return (
        <div
            className="absolute z-10 rounded-t-[45%] shadow-[0_0_10px_rgba(0,0,0,0.45)]"
            style={{
                background: color,
                boxShadow: `0 0 12px ${color}66`,
                height: s,
                left: position.x * cell + off,
                top: position.y * cell + off,
                width: s,
            }}
        >
            <div
                className="absolute bottom-0 left-0 right-0 flex justify-center gap-[15%]"
                style={{ height: s * 0.22 }}
            >
                <span
                    className="w-[22%] rounded-b-sm bg-black/35"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
                />
                <span
                    className="w-[22%] rounded-b-sm bg-black/35"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
                />
                <span
                    className="w-[22%] rounded-b-sm bg-black/35"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}
                />
            </div>
            <div className="absolute left-[18%] top-[28%] flex gap-[25%]">
                <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
                <span className="h-2 w-2 rounded-full bg-white shadow-sm" />
            </div>
        </div>
    );
}
