'use client';

import React, { useRef, useEffect, useState } from 'react';

const AsteroidGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  // Store the score in a ref to access current value inside animation loop
  const scoreRef = useRef(0);
  
  const gameRef = useRef({
    ship: null,
    asteroids: [],
    bullets: [],
    keys: {},
    animationFrameId: null,
    lastTime: 0,
  });

  // Update scoreRef whenever score changes
  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    const game = gameRef.current;

    // Function to resize canvas to fit container
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // If ship exists, move it to the center when resizing
      if (game.ship) {
        game.ship.x = canvas.width / 2;
        game.ship.y = canvas.height / 2;
      }
    };

    // Initial resize
    resizeCanvas();

    // Initialize game objects
    game.ship = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 15,
      angle: 0,
      thrust: { x: 0, y: 0 },
      friction: 0.98 // Added friction for better control
    };

    const createAsteroid = (x?: number, y?: number, radius?: number) => {
      return {
        x: x || Math.random() * canvas.width,
        y: y || Math.random() * canvas.height,
        radius: radius || Math.random() * 30 + 20,
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2,
        // Pre-calculate vertices for polygon asteroids
        vertices: generateAsteroidVertices(radius || Math.random() * 30 + 20)
      };
    };

    // Generate vertices for more interesting asteroid shapes
    const generateAsteroidVertices = (radius) => {
      const vertices = [];
      const numVertices = Math.floor(Math.random() * 5) + 7;
      
      for (let i = 0; i < numVertices; i++) {
        const angle = (i / numVertices) * Math.PI * 2;
        const vertexRadius = radius * (0.75 + Math.random() * 0.25);
        vertices.push({
          x: Math.cos(angle) * vertexRadius,
          y: Math.sin(angle) * vertexRadius
        });
      }
      
      return vertices;
    };

    const createBullet = () => {
      // Only create a bullet if we haven't reached the maximum
      if (game.bullets.length < 10) {
        const bullet = {
          x: game.ship.x + Math.cos(game.ship.angle) * game.ship.radius,
          y: game.ship.y + Math.sin(game.ship.angle) * game.ship.radius,
          velocityX: Math.cos(game.ship.angle) * 7,
          velocityY: Math.sin(game.ship.angle) * 7,
          radius: 3,
          lifeTime: 60 // Bullets expire after 60 frames
        };
        game.bullets.push(bullet);
      }
    };

    // Initial asteroids
    game.asteroids = [];
    for (let i = 0; i < 5; i++) {
      // Ensure asteroids don't spawn too close to the ship
      let x, y, distance;
      do {
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        const dx = x - game.ship.x;
        const dy = y - game.ship.y;
        distance = Math.sqrt(dx * dx + dy * dy);
      } while (distance < 150); // Minimum safe distance
      
      game.asteroids.push(createAsteroid(x, y));
    }

    const handleKeyDown = (e) => {
      game.keys[e.keyCode] = true;
      
      // Prevent scrolling when using arrow keys
      if([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      game.keys[e.keyCode] = false;
    };

    // For handling window and container resizing
    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    // Create a ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const updateScore = (points) => {
      // Update the state using the function form
      setScore(prevScore => prevScore + points);
    };

    const update = (timestamp) => {
      // Calculate delta time for smooth animation
      const deltaTime = timestamp - (game.lastTime || timestamp);
      game.lastTime = timestamp;
      const timeScale = deltaTime / 16.67; // Normalize to ~60 FPS

      // Ship controls
      if (game.keys[37] || game.keys[65]) { // Left arrow or A
        game.ship.angle -= 0.05 * timeScale;
      }
      if (game.keys[39] || game.keys[68]) { // Right arrow or D
        game.ship.angle += 0.05 * timeScale;
      }
      if (game.keys[38] || game.keys[87]) { // Up arrow or W
        game.ship.thrust.x += Math.cos(game.ship.angle) * 0.1 * timeScale;
        game.ship.thrust.y += Math.sin(game.ship.angle) * 0.1 * timeScale;
      }

      // Space bar - shoot (with rate limiting)
      if (game.keys[32]) {
        createBullet();
        game.keys[32] = false;
      }

      // Apply friction to thrust
      game.ship.thrust.x *= game.ship.friction;
      game.ship.thrust.y *= game.ship.friction;

      // Update ship position
      game.ship.x += game.ship.thrust.x * timeScale;
      game.ship.y += game.ship.thrust.y * timeScale;

      // Screen wrapping for ship
      if (game.ship.x < 0) game.ship.x = canvas.width;
      if (game.ship.x > canvas.width) game.ship.x = 0;
      if (game.ship.y < 0) game.ship.y = canvas.height;
      if (game.ship.y > canvas.height) game.ship.y = 0;

      // Update asteroids
      for (let i = 0; i < game.asteroids.length; i++) {
        const asteroid = game.asteroids[i];
        
        asteroid.x += asteroid.velocityX * timeScale;
        asteroid.y += asteroid.velocityY * timeScale;

        // Screen wrapping for asteroids
        if (asteroid.x < -asteroid.radius) asteroid.x = canvas.width + asteroid.radius;
        if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = -asteroid.radius;
        if (asteroid.y < -asteroid.radius) asteroid.y = canvas.height + asteroid.radius;
        if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = -asteroid.radius;
      }

      // Update bullets
      for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        
        bullet.x += bullet.velocityX * timeScale;
        bullet.y += bullet.velocityY * timeScale;
        
        // Decrease bullet lifetime
        bullet.lifeTime--;
        
        // Remove bullets that are off screen or expired
        if (
          bullet.x < 0 || 
          bullet.x > canvas.width || 
          bullet.y < 0 || 
          bullet.y > canvas.height ||
          bullet.lifeTime <= 0
        ) {
          game.bullets.splice(i, 1);
          continue;
        }
        
        // Collision detection (bullets and asteroids)
        let hit = false;
        for (let j = game.asteroids.length - 1; j >= 0; j--) {
          if (hit) break; // Skip if we already hit something with this bullet
          
          const asteroid = game.asteroids[j];
          const dx = bullet.x - asteroid.x;
          const dy = bullet.y - asteroid.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < bullet.radius + asteroid.radius) {
            // Remove the bullet
            game.bullets.splice(i, 1);
            hit = true;
            
            // Split asteroid into smaller pieces if large enough
            if (asteroid.radius > 25) {
              // Create two smaller asteroids
              for (let k = 0; k < 2; k++) {
                game.asteroids.push(createAsteroid(
                  asteroid.x, 
                  asteroid.y, 
                  asteroid.radius / 2
                ));
              }
              // Award more points for breaking a large asteroid
              updateScore(20);
            } else {
              // Award fewer points for destroying a small asteroid
              updateScore(10);
            }
            
            // Remove the original asteroid
            game.asteroids.splice(j, 1);
            
            // Add a new asteroid if there aren't too many
            if (game.asteroids.length < 10) {
              game.asteroids.push(createAsteroid());
            }
          }
        }
      }

      // Collision detection (ship and asteroids)
      for (let i = 0; i < game.asteroids.length; i++) {
        const asteroid = game.asteroids[i];
        const dx = game.ship.x - asteroid.x;
        const dy = game.ship.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < game.ship.radius + asteroid.radius) {
          // Game Over logic
          game.ship.x = canvas.width / 2;
          game.ship.y = canvas.height / 2;
          game.ship.thrust = { x: 0, y: 0 };
          
          // Reset asteroids
          game.asteroids = [];
          for (let j = 0; j < 5; j++) {
            let x, y, dist;
            do {
              x = Math.random() * canvas.width;
              y = Math.random() * canvas.height;
              const dx = x - game.ship.x;
              const dy = y - game.ship.y;
              dist = Math.sqrt(dx * dx + dy * dy);
            } while (dist < 150);
            
            game.asteroids.push(createAsteroid(x, y));
          }
          
          // Clear bullets
          game.bullets = [];
          
          // Reset score
          setScore(0);
          
          break;
        }
      }

      draw();
      game.animationFrameId = requestAnimationFrame(update);
    };

    const draw = () => {
      // Clear canvas with slight opacity for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ship
      ctx.save();
      ctx.translate(game.ship.x, game.ship.y);
      ctx.rotate(game.ship.angle);
      
      // Draw ship body
      ctx.beginPath();
      ctx.moveTo(game.ship.radius, 0);
      ctx.lineTo(-game.ship.radius, -game.ship.radius / 2);
      ctx.lineTo(-game.ship.radius, game.ship.radius / 2);
      ctx.closePath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw engine thrust when moving forward
      if (game.keys[38] || game.keys[87]) {
        ctx.beginPath();
        ctx.moveTo(-game.ship.radius, 0);
        ctx.lineTo(-game.ship.radius - 10, -5);
        ctx.lineTo(-game.ship.radius - 5, 0);
        ctx.lineTo(-game.ship.radius - 10, 5);
        ctx.closePath();
        ctx.fillStyle = `hsl(${Math.random() * 60 + 20}, 100%, 60%)`;
        ctx.fill();
      }
      
      ctx.restore();

      // Draw asteroids
      game.asteroids.forEach(asteroid => {
        ctx.beginPath();
        
        // Draw polygon asteroids instead of circles
        ctx.save();
        ctx.translate(asteroid.x, asteroid.y);
        
        ctx.moveTo(asteroid.vertices[0].x, asteroid.vertices[0].y);
        for (let i = 1; i < asteroid.vertices.length; i++) {
          ctx.lineTo(asteroid.vertices[i].x, asteroid.vertices[i].y);
        }
        
        ctx.closePath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Draw bullets
      game.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });

      // Draw score from the scoreRef instead of the state
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
    };

    // Start the game loop
    game.animationFrameId = requestAnimationFrame(update);

    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      cancelAnimationFrame(game.animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
        <canvas ref={canvasRef} className="bg-background block w-full h-full" />
        <div className="absolute top-2 right-2 text-foreground p-2 bg-background bg-opacity-75 rounded-md">
        Score: {score}
        </div>
    </div>  
  );
};

export default AsteroidGame;
