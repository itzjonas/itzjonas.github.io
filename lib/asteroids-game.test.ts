import {
    createInitialGameState,
    distance,
    mulberry32,
    resizeGameState,
    stepGame,
} from '@/lib/asteroids-game';

describe('asteroids-game', () => {
    it('computes distance', () => {
        expect(distance(0, 0, 3, 4)).toBe(5);
    });

    it('mulberry32 is deterministic for same seed', () => {
        const rng = mulberry32(12_345);
        const a = rng();
        const b = rng();
        const rng2 = mulberry32(12_345);
        expect(rng2()).toBe(a);
        expect(b).not.toBe(a);
    });

    it('resizeGameState centers ship in new dimensions', () => {
        const rng = mulberry32(1);
        const state = createInitialGameState(400, 300, rng);
        const next = resizeGameState(state, 800, 600);
        expect(next.ship?.x).toBe(400);
        expect(next.ship?.y).toBe(300);
    });

    it('stepGame applies thrust over time', () => {
        const rng = mulberry32(99);
        let state = createInitialGameState(800, 600, rng);

        for (let i = 0; i < 90; i++) {
            const out = stepGame(state, 16.67, {
                aimLeft: false,
                aimRight: false,
                fire: false,
                thrust: true,
            }, rng);
            state = out.state;
        }

        const thrustMag = Math.hypot(state.ship!.thrust.x, state.ship!.thrust.y);
        expect(thrustMag).toBeGreaterThan(0.5);
    });

    it('wraps ship position at horizontal bounds', () => {
        const rng = mulberry32(42);
        const state = createInitialGameState(100, 100, rng);
        if (!state.ship) throw new Error('expected ship');
        state.ship.x = -1;
        const out = stepGame(
            state,
            16.67,
            { aimLeft: false, aimRight: false, fire: false, thrust: false },
            rng,
        );
        expect(out.state.ship!.x).toBe(100);
    });
});
