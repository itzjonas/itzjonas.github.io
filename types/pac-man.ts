export type Position = {
    x: number;
    y: number;
};

export type Direction = 'down' | 'left' | 'right' | 'up';

export type Ghost = {
    dir: Direction;
    id: number;
    pos: Position;
};
