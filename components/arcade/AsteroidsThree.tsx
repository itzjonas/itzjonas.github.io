'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import {
    createInitialGameState,
    resizeGameState,
    stepGame,
    type GameState,
} from '@/lib/asteroids-game';

const PALETTE = {
    bullet: 0x00e5ff,
    grid: 0x00e5ff,
    rock: 0xe8e4ef,
    rockAlt: 0xff2a8c,
    ship: 0x00e5ff,
    star: 0xf0eef5,
    starCyan: 0x00e5ff,
    thrustCore: 0xff2a8c,
    thrustEdge: 0xff9f1c,
};

function disposeMaterial(mat: THREE.Material | THREE.Material[]): void {
    if (Array.isArray(mat)) {
        mat.forEach((m) => m.dispose());
    } else {
        mat.dispose();
    }
}

export default function AsteroidsThree({
    onScoreDelta,
    onScoreReset,
}: {
    onScoreDelta: (delta: number) => void;
    onScoreReset: () => void;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const gameRef = useRef<GameState | null>(null);
    const keysRef = useRef<Record<string, boolean>>({});
    const queuedFireRef = useRef(false);
    const rngRef = useRef(() => Math.random());
    const reducedMotionRef = useRef(false);
    const onScoreDeltaRef = useRef(onScoreDelta);
    const onScoreResetRef = useRef(onScoreReset);

    onScoreDeltaRef.current = onScoreDelta;
    onScoreResetRef.current = onScoreReset;

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedMotionRef.current = mq.matches;

        const onMq = () => {
            reducedMotionRef.current = mq.matches;
        };

        mq.addEventListener('change', onMq);

        return () => mq.removeEventListener('change', onMq);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -100, 100);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 1);

        container.appendChild(renderer.domElement);

        const starsGeom = new THREE.BufferGeometry();
        const starsMat = new THREE.PointsMaterial({
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 1,
            size: 2,
            sizeAttenuation: false,
            transparent: true,
            vertexColors: true,
        });
        const starsPoints = new THREE.Points(starsGeom, starsMat);
        scene.add(starsPoints);

        const gridRoot = new THREE.Group();
        scene.add(gridRoot);

        const shipGroup = new THREE.Group();
        scene.add(shipGroup);

        const rShip = 15;
        const shipShape = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(rShip, 0, 0),
            new THREE.Vector3(-rShip, -rShip * 0.5, 0),
            new THREE.Vector3(-rShip, rShip * 0.5, 0),
        ]);
        const shipLineMat = new THREE.LineBasicMaterial({
            blending: THREE.AdditiveBlending,
            color: new THREE.Color(PALETTE.ship),
            depthTest: false,
            depthWrite: false,
            opacity: 0.98,
            transparent: true,
        });
        const shipOutline = new THREE.LineLoop(shipShape, shipLineMat);
        shipOutline.renderOrder = 20;
        shipGroup.add(shipOutline);

        const shipFill = new THREE.Mesh(
            new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(rShip, 0, 0),
                new THREE.Vector3(-rShip, -rShip * 0.5, 0),
                new THREE.Vector3(-rShip, rShip * 0.5, 0),
            ]),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(PALETTE.ship),
                depthTest: false,
                depthWrite: false,
                opacity: 0.16,
                side: THREE.DoubleSide,
                transparent: true,
            }),
        );
        shipFill.geometry.setIndex([0, 1, 2]);
        shipFill.renderOrder = 19;
        shipGroup.add(shipFill);

        const thrustGeom = new THREE.BufferGeometry();
        thrustGeom.setIndex([0, 1, 2]);
        const thrustMat = new THREE.MeshBasicMaterial({
            blending: THREE.AdditiveBlending,
            depthTest: false,
            depthWrite: false,
            opacity: 0.95,
            side: THREE.DoubleSide,
            transparent: true,
            vertexColors: true,
        });
        const thrustMesh = new THREE.Mesh(thrustGeom, thrustMat);
        thrustMesh.renderOrder = 21;
        thrustMesh.visible = false;
        shipGroup.add(thrustMesh);

        const asteroidRoot = new THREE.Group();
        scene.add(asteroidRoot);

        const bulletRoot = new THREE.Group();
        scene.add(bulletRoot);

        let animationFrameId: number | null = null;
        let lastTime = 0;
        const asteroidMeshes: THREE.LineLoop[] = [];
        const bulletMeshes: THREE.Line[] = [];

        const gridMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(PALETTE.grid),
            opacity: 0.35,
            transparent: true,
        });

        const resize = () => {
            const { height, width } = container.getBoundingClientRect();
            const w = Math.max(1, Math.floor(width));
            const h = Math.max(1, Math.floor(height));

            renderer.setSize(w, h, false);
            camera.left = 0;
            camera.right = w;
            camera.top = 0;
            camera.bottom = h;
            camera.updateProjectionMatrix();

            rngRef.current = Math.random;

            if (!gameRef.current) {
                gameRef.current = createInitialGameState(w, h, rngRef.current);
            } else {
                gameRef.current = resizeGameState(gameRef.current, w, h);
            }

            initStars(w, h);
            buildGrid(w, h);
        };

        const initStars = (w: number, h: number) => {
            const rm = reducedMotionRef.current;
            const density = rm ? 22000 : 12000;
            const n = Math.min(rm ? 40 : 140, Math.floor((w * h) / density));
            const positions = new Float32Array(n * 3);
            const colors = new Float32Array(n * 3);
            const colorW = new THREE.Color(PALETTE.star);
            const colorC = new THREE.Color(PALETTE.starCyan);

            for (let i = 0; i < n; i++) {
                positions[i * 3] = Math.random() * w;
                positions[i * 3 + 1] = Math.random() * h;
                positions[i * 3 + 2] = 0;

                const useC = Math.random() > 0.72;
                const c = useC ? colorC : colorW;
                const a = Math.random() * 0.45 + 0.25;

                colors[i * 3] = c.r * a;
                colors[i * 3 + 1] = c.g * a;
                colors[i * 3 + 2] = c.b * a;
            }

            starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            starsGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        };

        const buildGrid = (w: number, h: number) => {
            while (gridRoot.children.length > 0) {
                const ch = gridRoot.children[0];
                gridRoot.remove(ch);

                if (ch instanceof THREE.LineSegments) {
                    ch.geometry.dispose();
                    disposeMaterial(ch.material);
                }
            }

            const g = 56;
            const segments: THREE.Vector3[] = [];

            for (let x = 0; x <= w; x += g) {
                segments.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, h, 0));
            }

            for (let y = 0; y <= h; y += g) {
                segments.push(new THREE.Vector3(0, y, 0), new THREE.Vector3(w, y, 0));
            }

            const gridGeom = new THREE.BufferGeometry().setFromPoints(segments);
            gridRoot.add(new THREE.LineSegments(gridGeom, gridMaterial));

        };

        const syncAsteroids = (game: GameState) => {
            while (asteroidMeshes.length < game.asteroids.length) {
                const geom = new THREE.BufferGeometry();
                const mat = new THREE.LineBasicMaterial({
                    blending: THREE.AdditiveBlending,
                    transparent: true,
                });
                const loop = new THREE.LineLoop(geom, mat);
                asteroidRoot.add(loop);
                asteroidMeshes.push(loop);
            }

            while (asteroidMeshes.length > game.asteroids.length) {
                const m = asteroidMeshes.pop();

                if (m) {
                    m.geometry.dispose();
                    disposeMaterial(m.material);
                    asteroidRoot.remove(m);
                }
            }

            for (let i = 0; i < game.asteroids.length; i++) {
                const ast = game.asteroids[i];
                const mesh = asteroidMeshes[i];
                const pts = ast.vertices.map(
                    (v) =>
                        new THREE.Vector3(ast.x + v.x, ast.y + v.y, 0),
                );

                mesh.geometry.dispose();
                mesh.geometry = new THREE.BufferGeometry().setFromPoints(pts);

                const mat = mesh.material as THREE.LineBasicMaterial;
                const alt = ast.hue === 'alt';
                mat.color = new THREE.Color(alt ? PALETTE.rockAlt : PALETTE.rock);
                mat.linewidth = ast.radius > 28 ? 1.5 : 1;
                mat.needsUpdate = true;
            }
        };

        const syncBullets = (game: GameState) => {
            while (bulletMeshes.length < game.bullets.length) {
                const geom = new THREE.BufferGeometry();
                geom.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 3));
                const mat = new THREE.LineBasicMaterial({
                    blending: THREE.AdditiveBlending,
                    color: new THREE.Color(0xffcc00),
                    depthTest: false,
                    depthWrite: false,
                    opacity: 1,
                    transparent: true,
                });
                const m = new THREE.Line(geom, mat);
                m.renderOrder = 30;
                bulletRoot.add(m);
                bulletMeshes.push(m);
            }

            while (bulletMeshes.length > game.bullets.length) {
                const m = bulletMeshes.pop();

                if (m) {
                    m.geometry.dispose();
                    disposeMaterial(m.material);
                    bulletRoot.remove(m);
                }
            }

            for (let i = 0; i < game.bullets.length; i++) {
                const b = game.bullets[i];
                const mesh = bulletMeshes[i];
                const tail = 2.25;
                const positionAttr = mesh.geometry.getAttribute('position') as THREE.BufferAttribute;
                positionAttr.setXYZ(0, b.x, b.y, 2);
                positionAttr.setXYZ(1, b.x - b.velocityX * tail, b.y - b.velocityY * tail, 2);
                positionAttr.needsUpdate = true;
            }
        };

        const updateShipVisual = (game: GameState, thrusting: boolean) => {
            const ship = game.ship;
            if (!ship) return;

            shipGroup.position.set(ship.x, ship.y, 0);
            shipGroup.rotation.z = ship.angle;

            if (thrusting) {
                thrustMesh.visible = true;
                const tip = new THREE.Vector3(-rShip - 14, 0, 0);
                const wingA = new THREE.Vector3(-rShip - 4, 6, 0);
                const wingB = new THREE.Vector3(-rShip - 4, -6, 0);
                const ce = new THREE.Color(PALETTE.thrustEdge);
                const cc = new THREE.Color(PALETTE.thrustCore);

                thrustGeom.setAttribute(
                    'position',
                    new THREE.Float32BufferAttribute(
                        [wingA.x, wingA.y, 0, tip.x, tip.y, 0, wingB.x, wingB.y, 0],
                        3,
                    ),
                );
                thrustGeom.setAttribute(
                    'color',
                    new THREE.Float32BufferAttribute(
                        [ce.r, ce.g, ce.b, cc.r, cc.g, cc.b, ce.r, ce.g, ce.b],
                        3,
                    ),
                );
            } else {
                thrustMesh.visible = false;
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            keysRef.current[e.code] = true;
            if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
                queuedFireRef.current = true;
            }

            if (['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysRef.current[e.code] = false;
        };

        const loop = (timestamp: number) => {
            const game = gameRef.current;
            if (!game || !game.ship) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }

            const deltaTime = timestamp - (lastTime || timestamp);
            lastTime = timestamp;

            const k = keysRef.current;
            const fire = queuedFireRef.current || !!k.Space;

            if (k.Space) {
                k.Space = false;
            }
            queuedFireRef.current = false;

            const input = {
                aimLeft: !!(k.ArrowLeft || k.KeyA),
                aimRight: !!(k.ArrowRight || k.KeyD),
                fire,
                thrust: !!(k.ArrowUp || k.KeyW),
            };

            const outcome = stepGame(game, deltaTime, input, rngRef.current);
            gameRef.current = outcome.state;

            if (outcome.resetScore) {
                onScoreResetRef.current();
            } else if (outcome.scoreDelta !== 0) {
                onScoreDeltaRef.current(outcome.scoreDelta);
            }

            const g = gameRef.current;
            if (!g || !g.ship) {
                animationFrameId = requestAnimationFrame(loop);
                return;
            }

            syncAsteroids(g);
            syncBullets(g);
            updateShipVisual(g, input.thrust);

            renderer.render(scene, camera);

            animationFrameId = requestAnimationFrame(loop);
        };

        const ro = new ResizeObserver(() => {
            resize();
        });

        ro.observe(container);
        resize();

        animationFrameId = requestAnimationFrame(loop);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            ro.disconnect();

            if (animationFrameId != null) {
                cancelAnimationFrame(animationFrameId);
            }

            renderer.dispose();
            container.removeChild(renderer.domElement);

            starsGeom.dispose();
            starsMat.dispose();
            shipShape.dispose();
            shipLineMat.dispose();
            shipFill.geometry.dispose();

            const shipFillMat = shipFill.material;

            if (!Array.isArray(shipFillMat)) {
                shipFillMat.dispose();
            }
            thrustGeom.dispose();
            thrustMat.dispose();
            gridMaterial.dispose();

            while (gridRoot.children.length > 0) {
                const ch = gridRoot.children[0];
                gridRoot.remove(ch);

                if (ch instanceof THREE.LineSegments) {
                    ch.geometry.dispose();
                    disposeMaterial(ch.material);
                }
            }

            for (const m of asteroidMeshes) {
                m.geometry.dispose();
                disposeMaterial(m.material);
            }

            for (const m of bulletMeshes) {
                disposeMaterial(m.material);
            }

            asteroidMeshes.length = 0;
            bulletMeshes.length = 0;
        };
    }, []);

    return <div className="relative h-full w-full" ref={containerRef} />;
}
