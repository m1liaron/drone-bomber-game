window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("game");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // canvas.width = 1280;
    // canvas.height = 720;


    class Player {
        constructor(game) {
            this.game = game;

            // Position the drone near the left side of the canvas
            this.collisionX = this.game.width * 0.1;
            this.collisionY = this.game.height * 0.1;

            this.collisionRadius = 30;
            this.speedX = 0;
            this.speedY = 0;
            this.maxSpeed = 5;
            this.dx = 0;
            this.dy = 0;
            this.image = document.getElementById('drone');

            const scale = 0.4;
            this.spriteWidth = this.image.width * scale;
            this.spriteHeight = this.image.height * scale;

            this.width = this.spriteWidth;
            this.height = this.spriteHeight;

            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5;

            this.frameX = 0;
            this.frameY = 0;
        }

        controls() {
            window.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowUp':
                        this.speedY = -this.maxSpeed;
                        break;
                    case 'ArrowDown':
                        this.speedY = this.maxSpeed;
                        break;
                    case 'ArrowLeft':
                        this.speedX = -this.maxSpeed;
                        break;
                    case 'ArrowRight':
                        this.speedX = this.maxSpeed;
                        break;
                }
            })
            window.addEventListener('keyup', (e) => {
                switch (e.key) {
                    case 'ArrowUp':
                    case 'ArrowDown':
                        this.speedY = 0;
                        break;
                    case 'ArrowLeft':
                    case 'ArrowRight':
                        this.speedX = 0;
                        break;
                }
            })
        }

        draw(context) {
            context.drawImage(
                this.image,
                0,  // source x
                0,  // source y
                this.image.width,  // source width
                this.image.height, // source height
                this.spriteX,      // destination x
                this.spriteY,      // destination y
                this.width,        // destination width
                this.height        // destination height
            );
        }

        update() {
            this.collisionX += this.speedX;
            this.collisionY += this.speedY;

            if (this.collisionX - this.width * 0.5 < 0) this.collisionX = this.width * 0.5;
            if (this.collisionX + this.width * 0.5 > this.game.width) this.collisionX = this.game.width - this.width * 0.5;
            if (this.collisionY - this.height * 0.5 < 0) this.collisionY = this.height * 0.5;
            if (this.collisionY + this.height * 0.5 > this.game.height) this.collisionY = this.game.height - this.height * 0.5;
    
            // Update the sprite position
            this.spriteX = this.collisionX - this.width * 0.5;
            this.spriteY = this.collisionY - this.height * 0.5;
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.width = this.canvas.width;
            this.height = this.canvas.height
            this.player = new Player(this);
            this.player.controls();
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000/this.fps;

            // Background 
            this.background = new Image();
            this.background.src= 'assets/images/background/background.jpg';
            this.bgX = 0;
            this.bgSpeed = 4;

            this.start();
        }

        drawBackground() {
            this.context.drawImage(this.background, this.bgX, 0, this.width, this.height);
            this.context.drawImage(this.background, this.bgX + this.width, 0, this.width, this.height );
        }

        updateBackground() {
            this.bgX -= this.bgSpeed; 
            if(this.bgX <= -this.width) this.bgX = 0;
        }

        start() {
            this.lastTime = 0;
            requestAnimationFrame(this.gameLoop.bind(this));
        }

        draw() {
            this.context.clearRect(0, 0, this.width, this.height);
            this.player.draw(this.context);
        }

        gameLoop(timestamp) {
            const deltaTime  = timestamp - this.lastTime;
            this.lastTime = timestamp;

            if (this.timer > this.interval) {
                this.context.clearRect(0, 0, this.width, this.height);
                
                this.updateBackground();
                this.drawBackground();

                this.player.update();
                this.player.draw(this.context);

                this.timer = 0;
            } else {
                this.timer += deltaTime;
            }
    
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }


    const game = new Game(canvas);
    game.start();
});