'use client';

const GRID_SIZE = 20;

type MazeProps = {
  maze: number[][];
};

export default function Maze({ maze }: MazeProps) {
  return (
    <>
      {maze.map((row, y) =>
        row.map((cell, x) => (
          cell === 1 && (
            <div
              key={`${x}-${y}`}
              style={{
                background: '#00ffff',
                border: '1px solid #ff00ff',
                height: GRID_SIZE,
                left: x * GRID_SIZE,
                position: 'absolute',
                top: y * GRID_SIZE,
                width: GRID_SIZE,
              }}
            />
          )
        ))
      )}
    </>
  );
}
