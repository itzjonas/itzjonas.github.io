'use client';

import React, { useRef, useEffect, useState } from 'react';

const SpaceInvaders = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'victory' | 'defeat'>('playing');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to fit the viewable area with padding
    canvas.width = Math.min(800, window.innerWidth - 40);
    canvas.height = Math.min(600, window.innerHeight - 100);

    const player = {
      x: canvas.width / 2 - 15,
      y: canvas.height - 50,
      width: 30,
      height: 20,
      velocityX: 5,
    };

    const invaders: { x: number; y: number; width: number; height: number; velocityX: number }[] = [];
    const invaderRows = 5;
    const invaderCols = 10;
    const invaderWidth = 20;
    const invaderHeight = 15;
    const invaderSpacing = 10;
    const invaderVelocityX = 1 + (level * 0.2);

    const createInvaders = () => {
      invaders.length = 0;
      for (let row = 0; row < invaderRows; row++) {
        for (let col = 0; col < invaderCols; col++) {
          invaders.push({
            x: col * (invaderWidth + invaderSpacing) + 50,
            y: row * (invaderHeight + invaderSpacing) + 50,
            width: invaderWidth,
            height: invaderHeight,
            velocityX: invaderVelocityX,
          });
        }
      }
    };

    createInvaders();

    const playerBullets: { x: number; y: number; radius: number; velocityY: number }[] = [];
    const invaderBullets: { x: number; y: number; radius: number; velocityY: number }[] = [];

    const keys: { [key: number]: boolean } = {};
    let lastBulletTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.keyCode] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.keyCode] = false;
    };

    const handleResize = () => {
      canvas.width = Math.min(800, window.innerWidth - 40);
      canvas.height = Math.min(600, window.innerHeight - 100);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    const update = () => {
      if (gameStatus === 'playing') {
        // Player movement
        if (keys[37] && player.x > 0) {
          player.x -= player.velocityX; // Left arrow
        }
        if (keys[39] && player.x + player.width < canvas.width) {
          player.x += player.velocityX; // Right arrow
        }
        
        // Player shooting with cooldown
        const currentTime = Date.now();
        if (keys[32] && currentTime - lastBulletTime > 300) {
          playerBullets.push({
            x: player.x + player.width / 2,
            y: player.y,
            radius: 3,
            velocityY: -5,
          });
          lastBulletTime = currentTime;
        }

        // Invader movement
        invaders.forEach((invader) => {
          invader.x += invader.velocityX;

          // Check if invaders hit the walls
          if (invader.x <= 0 || invader.x + invader.width >= canvas.width) {
            invaders.forEach((i) => {
              i.velocityX *= -1;
              i.y += 20;
            });
            return;
          }

          // Check if invaders reach the player
          if (invader.y + invader.height >= player.y) {
            setGameStatus('defeat');
          }

          // Random invader shooting
          if (Math.random() < 0.001 + (level * 0.001)) {
            invaderBullets.push({
              x: invader.x + invader.width / 2,
              y: invader.y + invader.height,
              radius: 3,
              velocityY: 3 + (level * 0.5),
            });
          }
        });

        // Bullet movement
        playerBullets.forEach((bullet) => {
          bullet.y += bullet.velocityY;
        });

        invaderBullets.forEach((bullet) => {
          bullet.y += bullet.velocityY;
        });

        // Collision detection (player bullets and invaders)
        for (let i = playerBullets.length - 1; i >= 0; i--) {
          const bullet = playerBullets[i];
          let bulletHit = false;

          for (let j = invaders.length - 1; j >= 0; j--) {
            const invader = invaders[j];
            if (
              bullet.x > invader.x &&
              bullet.x < invader.x + invader.width &&
              bullet.y > invader.y &&
              bullet.y < invader.y + invader.height
            ) {
              invaders.splice(j, 1);
              bulletHit = true;
              setScore((prevScore) => prevScore + 10);
              break;
            }
          }

          if (bulletHit) {
            playerBullets.splice(i, 1);
          }
        }

        // Check if all invaders are defeated
        if (invaders.length === 0) {
          setGameStatus('victory');
          setLevel((prevLevel) => prevLevel + 1);
        }

        // Collision detection (invader bullets and player)
        for (let i = invaderBullets.length - 1; i >= 0; i--) {
          const bullet = invaderBullets[i];
          if (
            bullet.x > player.x &&
            bullet.x < player.x + player.width &&
            bullet.y > player.y &&
            bullet.y < player.y + player.height
          ) {
            setGameStatus('defeat');
            invaderBullets.splice(i, 1);
            break;
          }
        }

        // Bullet cleanup
        for (let i = playerBullets.length - 1; i >= 0; i--) {
          if (playerBullets[i].y < 0) {
            playerBullets.splice(i, 1);
          }
        }
        for (let i = invaderBullets.length - 1; i >= 0; i--) {
          if (invaderBullets[i].y > canvas.height) {
            invaderBullets.splice(i, 1);
          }
        }
      } else if (gameStatus === 'victory' || gameStatus === 'defeat') {
        // Reset game on space press
        if (keys[13]) {
          if (gameStatus === 'defeat') {
            setScore(0);
            setLevel(1);
          }
          
          player.x = canvas.width / 2 - 15;
          createInvaders();
          invaderBullets.length = 0;
          playerBullets.length = 0;
          setGameStatus('playing');
          keys[13] = false;
        }
      }

      draw();
      requestAnimationFrame(update);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw player
      ctx.fillStyle = 'green';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Draw invaders
      invaders.forEach((invader) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
      });

      // Draw player bullets
      playerBullets.forEach((bullet) => {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw invader bullets
      invaderBullets.forEach((bullet) => {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw game status messages
      if (gameStatus === 'victory') {
        ctx.fillStyle = 'green';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL CLEARED! Level ${level} complete!`, canvas.width / 2, canvas.height / 2);
        ctx.font = '18px Arial';
        ctx.fillText('Press ENTER to continue to next level', canvas.width / 2, canvas.height / 2 + 30);
      } else if (gameStatus === 'defeat') {
        ctx.fillStyle = 'red';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '18px Arial';
        ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 30);
      }
    };

    update();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [level, gameStatus]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex justify-between w-full max-w-[800px] mb-2">
        <div className="text-foreground text-xl font-bold">Score: {score}</div>
        <div className="text-foreground text-xl font-bold">Level: {level}</div>
      </div>
      <div className="relative border border-gray-700 rounded shadow-lg">
        <canvas ref={canvasRef} style={{ background: 'var(--background-dark)' }} />
      </div>
      <div className="text-foreground mt-4 text-sm">
        <p>Controls: Use ← → arrow keys to move and SPACE to shoot</p>
      </div>
    </div>
  );
};

export default SpaceInvaders;