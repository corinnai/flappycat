export default class Ground{
    constructor (ctx, width, height, speed, scaleRatio){

        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.scaleRatio = scaleRatio;

        this.x = 0;
        this.y = this.canvas.height - this.height ;

        this.groundImage = new Image();
        this.groundImage.src = "./gr.png";
       

    }


    update(gameSpeed, frameTime) {
        this.x -= gameSpeed * frameTime * this.speed * this.scaleRatio; // to move with the same speed no matter resolution
    }
    draw(){
        this.ctx.drawImage(
            this.groundImage, 
            this.x, 
            this.y, 
            this.width, 
            this.height);

            this.ctx.drawImage(
                this.groundImage, 
                this.x + this.width, 
                this.y, 
                this.width, 
                this.height );


                if ( this.x < -this.width) {
                    this.x = 0;
                }
    }
    reset(){
        this.x = 0;
    }
}