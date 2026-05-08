export type AsteroidHue = 'alt' | 'rock';

export type Asteroid = {
    hue: AsteroidHue;
    radius: number;
    velocityX: number;
    velocityY: number;
    vertices: { x: number; y: number }[];
    x: number;
    y: number;
};

export type Bullet = {
    lifeTime: number;
    radius: number;
    velocityX: number;
    velocityY: number;
    x: number;
    y: number;
};

export type Ship = {
    angle: number;
    friction: number;
    radius: number;
    thrust: { x: number; y: number };
    x: number;
    y: number;
};

export type GameState = {
    asteroids: Asteroid[];
    bullets: Bullet[];
    height: number;
    ship: Ship | null;
    width: number;
};

export type GameInput = {
    aimLeft: boolean;
    aimRight: boolean;
    fire: boolean;
    thrust: boolean;
};

export type StepOutcome = {
    resetScore: boolean;
    scoreDelta: number;
    state: GameState;
};

const MAX_BULLETS = 10;
const SHIP_FRICTION = 0.98;
const SHIP_RADIUS = 15;
const ROT_SPEED = 0.05;
const THRUST = 0.1;
const BULLET_LIFE = 60;
const BULLET_RADIUS = 3;
const BULLET_SPEED = 7;
const SPLIT_RADIUS_THRESHOLD = 25;
const MIN_ASTEROIDS_BEFORE_SPAWN = 10;
const INITIAL_ASTEROID_COUNT = 5;
const RESPAWN_ASTEROID_COUNT = 5;
const CLEAR_RADIUS = 150;

export function mulberry32(seed: number): () => number {
    return () => {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export function distance(ax: number, ay: number, bx: number, by: number): number {
    const dx = ax - bx;
    const dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
}

export function generateAsteroidVertices(radius: number, rng: () => number): { x: number; y: number }[] {
    const vertices: { x: number; y: number }[] = [];
    const numVertices = Math.floor(rng() * 5) + 7;

    for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const vertexRadius = radius * (0.75 + rng() * 0.25);
        vertices.push({
            x: Math.cos(angle) * vertexRadius,
            y: Math.sin(angle) * vertexRadius,
        });
    }

    return vertices;
}

export function createAsteroid(
    width: number,
    height: number,
    rng: () => number,
    x?: number,
    y?: number,
    radius?: number,
): Asteroid {
    const r = radius ?? rng() * 30 + 20;

    return {
        hue: rng() > 0.5 ? 'alt' : 'rock',
        radius: r,
        velocityX: (rng() - 0.5) * 2,
        velocityY: (rng() - 0.5) * 2,
        vertices: generateAsteroidVertices(r, rng),
        x: x ?? rng() * width,
        y: y ?? rng() * height,
    };
}

function spawnInitialAsteroids(width: number, height: number, shipX: number, shipY: number, rng: () => number): Asteroid[] {
    const asteroids: Asteroid[] = [];

    for (let i = 0; i < INITIAL_ASTEROID_COUNT; i++) {
        let ax: number;
        let ay: number;
        let dist: number;

        do {
            ax = rng() * width;
            ay = rng() * height;
            dist = distance(ax, ay, shipX, shipY);
        } while (dist < CLEAR_RADIUS);

        asteroids.push(createAsteroid(width, height, rng, ax, ay));
    }

    return asteroids;
}

export function createInitialGameState(width: number, height: number, rng: () => number): GameState {
    const ship: Ship = {
        angle: 0,
        friction: SHIP_FRICTION,
        radius: SHIP_RADIUS,
        thrust: { x: 0, y: 0 },
        x: width / 2,
        y: height / 2,
    };

    return {
        asteroids: spawnInitialAsteroids(width, height, ship.x, ship.y, rng),
        bullets: [],
        height,
        ship,
        width,
    };
}

export function resizeGameState(state: GameState, width: number, height: number): GameState {
    if (!state.ship) {
        return { ...state, height, width };
    }

    return {
        ...state,
        height,
        ship: {
            ...state.ship,
            x: width / 2,
            y: height / 2,
        },
        width,
    };
}

export function respawnAfterDeath(width: number, height: number, rng: () => number): GameState {
    const ship: Ship = {
        angle: 0,
        friction: SHIP_FRICTION,
        radius: SHIP_RADIUS,
        thrust: { x: 0, y: 0 },
        x: width / 2,
        y: height / 2,
    };

    const asteroids: Asteroid[] = [];

    for (let j = 0; j < RESPAWN_ASTEROID_COUNT; j++) {
        let ax: number;
        let ay: number;
        let dist: number;

        do {
            ax = rng() * width;
            ay = rng() * height;
            dist = distance(ax, ay, ship.x, ship.y);
        } while (dist < CLEAR_RADIUS);

        asteroids.push(createAsteroid(width, height, rng, ax, ay));
    }

    return {
        asteroids,
        bullets: [],
        height,
        ship,
        width,
    };
}

function cloneState(state: GameState): GameState {
    return {
        asteroids: state.asteroids.map((a) => ({
            ...a,
            vertices: a.vertices.map((v) => ({ ...v })),
        })),
        bullets: state.bullets.map((b) => ({ ...b })),
        height: state.height,
        ship: state.ship
            ? {
                  ...state.ship,
                  thrust: { ...state.ship.thrust },
              }
            : null,
        width: state.width,
    };
}

export function stepGame(state: GameState, deltaMs: number, input: GameInput, rng: () => number): StepOutcome {
    const game = cloneState(state);
    let scoreDelta = 0;

    if (!game.ship) {
        return { resetScore: false, scoreDelta: 0, state: game };
    }

    const timeScale = deltaMs / 16.67;
    const { height, width } = game;
    const ship = game.ship;

    if (input.aimLeft) {
        ship.angle -= ROT_SPEED * timeScale;
    }

    if (input.aimRight) {
        ship.angle += ROT_SPEED * timeScale;
    }

    if (input.thrust) {
        ship.thrust.x += Math.cos(ship.angle) * THRUST * timeScale;
        ship.thrust.y += Math.sin(ship.angle) * THRUST * timeScale;
    }

    if (input.fire && game.bullets.length < MAX_BULLETS) {
        game.bullets.push({
            lifeTime: BULLET_LIFE,
            radius: BULLET_RADIUS,
            velocityX: Math.cos(ship.angle) * BULLET_SPEED,
            velocityY: Math.sin(ship.angle) * BULLET_SPEED,
            x: ship.x + Math.cos(ship.angle) * ship.radius,
            y: ship.y + Math.sin(ship.angle) * ship.radius,
        });
    }

    ship.thrust.x *= ship.friction;
    ship.thrust.y *= ship.friction;

    ship.x += ship.thrust.x * timeScale;
    ship.y += ship.thrust.y * timeScale;

    if (ship.x < 0) ship.x = width;
    if (ship.x > width) ship.x = 0;
    if (ship.y < 0) ship.y = height;
    if (ship.y > height) ship.y = 0;

    for (const asteroid of game.asteroids) {
        asteroid.x += asteroid.velocityX * timeScale;
        asteroid.y += asteroid.velocityY * timeScale;

        if (asteroid.x < -asteroid.radius) asteroid.x = width + asteroid.radius;
        if (asteroid.x > width + asteroid.radius) asteroid.x = -asteroid.radius;
        if (asteroid.y < -asteroid.radius) asteroid.y = height + asteroid.radius;
        if (asteroid.y > height + asteroid.radius) asteroid.y = -asteroid.radius;
    }

    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];

        bullet.x += bullet.velocityX * timeScale;
        bullet.y += bullet.velocityY * timeScale;
        bullet.lifeTime--;

        if (
            bullet.x < 0 ||
            bullet.x > width ||
            bullet.y < 0 ||
            bullet.y > height ||
            bullet.lifeTime <= 0
        ) {
            game.bullets.splice(i, 1);
            continue;
        }

        let hit = false;

        for (let j = game.asteroids.length - 1; j >= 0; j--) {
            if (hit) break;

            const asteroid = game.asteroids[j];
            const dist = distance(bullet.x, bullet.y, asteroid.x, asteroid.y);

            if (dist < bullet.radius + asteroid.radius) {
                game.bullets.splice(i, 1);
                hit = true;

                if (asteroid.radius > SPLIT_RADIUS_THRESHOLD) {
                    for (let k = 0; k < 2; k++) {
                        game.asteroids.push(createAsteroid(width, height, rng, asteroid.x, asteroid.y, asteroid.radius / 2));
                    }

                    scoreDelta += 20;
                } else {
                    scoreDelta += 10;
                }

                game.asteroids.splice(j, 1);

                if (game.asteroids.length < MIN_ASTEROIDS_BEFORE_SPAWN) {
                    game.asteroids.push(createAsteroid(width, height, rng));
                }
            }
        }
    }

    let resetScore = false;

    for (const asteroid of game.asteroids) {
        const dist = distance(ship.x, ship.y, asteroid.x, asteroid.y);

        if (dist < ship.radius + asteroid.radius) {
            const next = respawnAfterDeath(width, height, rng);
            resetScore = true;

            return {
                resetScore,
                scoreDelta,
                state: next,
            };
        }
    }

    return {
        resetScore,
        scoreDelta,
        state: game,
    };
}
