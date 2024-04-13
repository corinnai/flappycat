export default class Coin {
    constructor(ctx, x, y, width, height, image) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
      }


      
    moveToRightEdge(canvasWidth) {
        this.x = canvasWidth + this.width + 70; // Move the coin to just outside the right edge of the canvas
    }


      update(speed, gameSpeed, frameTime, scaleRatio){
          this.x -= speed * gameSpeed * frameTime * scaleRatio;
      }
  
      draw(){
          this.ctx.drawImage(
              this.image, 
              this.x, 
              this.y, 
              this.width, 
              this.height);
      }
  
      collideWith(sprite){
          const adjustBy = 1;
  
          if(
              sprite.x < this.x + this.width / adjustBy &&
              sprite.x + sprite.width / adjustBy > this.x &&
              sprite.y < this.y + this.height / adjustBy &&
              sprite.height + sprite.y / adjustBy > this.y 
          ) {
              return true;
          }
          else{
              return false;
          }
      }
}
