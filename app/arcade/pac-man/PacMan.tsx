'use client';

import { Position, Direction } from '@/types/pac-man';

const GRID_SIZE = 20;

type PacManProps = {
    direction: Direction;
  position: Position;
};

export default function PacMan({ position, direction }: PacManProps) {
  return (
    <div
      style={{
        background: '#ffff00',
        borderRadius: '50%',
        height: GRID_SIZE,
        left: position.x * GRID_SIZE,
        position: 'absolute',
        top: position.y * GRID_SIZE,
        transform: direction === 'left' ? 'scaleX(-1)' : 'none',
        transition: 'all 0.1s linear',
        width: GRID_SIZE,
      }}
    />
  );
}
