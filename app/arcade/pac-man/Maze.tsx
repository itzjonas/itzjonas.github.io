'use client';

type MazeProps = {
    cell: number;
    maze: number[][];
};

export default function Maze({ cell, maze }: MazeProps) {
    return (
        <>
            {maze.map((row, y) =>
                row.map((tile, x) =>
                    tile === 1 ? (
                        <div
                            className="absolute border border-cyan-500/25 bg-gradient-to-br from-synth-bg-mid to-black shadow-[inset_0_0_12px_rgba(0,229,255,0.08)]"
                            key={`${x}-${y}`}
                            style={{
                                height: cell,
                                left: x * cell,
                                top: y * cell,
                                width: cell,
                            }}
                        />
                    ) : null,
                ),
            )}
        </>
    );
}
