export type Position = {
    x: number;
    y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type Ghost = {
    id: number;
    pos: Position;
    dir: Direction;
};
