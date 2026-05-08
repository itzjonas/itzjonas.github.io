'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type HeroThreeSceneProps = {
    accentPrimary: string;
    accentSecondary: string;
};

export function HeroThreeScene({ accentPrimary, accentSecondary }: HeroThreeSceneProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const reducedRef = useRef(false);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        reducedRef.current = mq.matches;

        const onMq = () => {
            reducedRef.current = mq.matches;
        };

        mq.addEventListener('change', onMq);

        return () => mq.removeEventListener('change', onMq);
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
        camera.position.z = 6;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);

        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const count = reducedRef.current ? 240 : 4200;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
            velocities[i * 3] = (Math.random() - 0.5) * 0.012;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.008;
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.55,
            size: reducedRef.current ? 0.06 : 0.035,
            sizeAttenuation: true,
            transparent: true,
            vertexColors: true,
        });

        const colors = new Float32Array(count * 3);
        const c1 = new THREE.Color(accentPrimary);
        const c2 = new THREE.Color(accentSecondary);

        for (let i = 0; i < count; i++) {
            const t = Math.random();
            const c = c1.clone().lerp(c2, t);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }

        geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const points = new THREE.Points(geom, mat);
        group.add(points);

        const ringGeom = new THREE.TorusGeometry(2.2, 0.012, 12, 160);
        const ringMat = new THREE.MeshBasicMaterial({
            blending: THREE.AdditiveBlending,
            color: new THREE.Color(accentPrimary),
            opacity: 0.35,
            transparent: true,
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2.35;
        group.add(ring);

        let animationFrameId: number | null = null;
        let last = performance.now();

        const resize = () => {
            const { height, width } = container.getBoundingClientRect();
            const w = Math.max(1, width);
            const h = Math.max(1, height);
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };

        const ro = new ResizeObserver(resize);
        ro.observe(container);
        resize();

        const animate = (now: number) => {
            const dt = Math.min(33, now - last);
            last = now;
            const rm = reducedRef.current;

            group.rotation.y += rm ? 0.00015 : 0.00055;
            group.rotation.x += rm ? 0.00008 : 0.00022;

            const pos = geom.attributes.position.array as Float32Array;

            if (!rm) {
                for (let i = 0; i < count; i++) {
                    pos[i * 3] += velocities[i * 3]! * dt * 0.08;
                    pos[i * 3 + 1] += velocities[i * 3 + 1]! * dt * 0.08;
                    pos[i * 3 + 2] += velocities[i * 3 + 2]! * dt * 0.08;

                    if (pos[i * 3]! > 7 || pos[i * 3]! < -7) velocities[i * 3]! *= -1;
                    if (pos[i * 3 + 1]! > 5 || pos[i * 3 + 1]! < -5) velocities[i * 3 + 1]! *= -1;
                    if (pos[i * 3 + 2]! > 4 || pos[i * 3 + 2]! < -4) velocities[i * 3 + 2]! *= -1;
                }

                geom.attributes.position.needsUpdate = true;
            }

            mat.opacity = rm ? 0.22 : 0.45;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            ro.disconnect();

            if (animationFrameId != null) {
                cancelAnimationFrame(animationFrameId);
            }

            renderer.dispose();
            container.removeChild(renderer.domElement);
            geom.dispose();
            mat.dispose();
            ringGeom.dispose();
            ringMat.dispose();
        };
    }, [accentPrimary, accentSecondary]);

    return <div className="pointer-events-none absolute inset-0 h-full w-full" ref={containerRef} />;
}
