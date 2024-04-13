export default class Mouse
    {
    constructor (ctx, width, height, speed, scaleRatio){

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 70 * scaleRatio;
        this.y = this.canvas.height - this.height - 13 * scaleRatio;

      

         // Array to hold the mouse images
        this.mouseImages = [new Image(), new Image()];
        this.mouseImages[0].src = "./mouse1.png";
        this.mouseImages[1].src = "./mouse4.png";
       

         // Animation frame control
         this.currentFrame = 0;
         this.frameSpeed = 15 ; // Change this value to adjust the speed of the animation
         this.frameCounter = 0;
    }


    update(gameSpeed, frameTime) {
        this.x += gameSpeed * frameTime * this.speed * this.scaleRatio;
        
        // Update the frame counter and change the image if it's time
        this.frameCounter++;
        if (this.frameCounter >= this.frameSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.mouseImages.length;
            this.frameCounter = 0;
        }
    }
    draw() {
        // Check if images are loaded before drawing
        if (this.mouseImages[0].complete && this.mouseImages[1].complete) {
            this.ctx.drawImage(
                this.mouseImages[this.currentFrame], 
                this.x, 
                this.y, 
                this.width, 
                this.height
            );
        }
    }

    reset() {
        this.x = 70 * this.scaleRatio; // Reset the x position off-screen to the left
        this.currentFrame = 0; // Start the animation from the first frame
        this.frameCounter = 0; // Reset the frame counter
    }
}
    