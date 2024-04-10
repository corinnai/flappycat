import Cactus from "./cactus.js";

export default class CactusController {
        cactus_interval_min = 1500;
        cactus_interval_max = 2000;

    nextCactusInterval = null;
    cacti = [];

    constructor ( ctx, cactusImages , scaleRatio, speed ){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.cactusImages = cactusImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed; 

        this.setNextCactusTime();
    }

    setNextCactusTime(){
        const num = this.getRandomNumber(
             this.cactus_interval_min , 
             this.cactus_interval_max);

        this.nextCactusInterval = num;
        // console.log(this.nextCactusInterval);
    }

    getRandomNumber(min, max){
        return Math.floor(Math.random() * (max- min + 1) + min); // to get a random nr between a min and a max 
    }

    createCactus(){
        const index = this.getRandomNumber(0, this.cactusImages.length - 1);
        const cactusImage = this.cactusImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - cactusImage.height -15;

        const cactus = new Cactus( 
            this.ctx, 
            x , 
            y , 
            cactusImage.width, 
            cactusImage.height, 
            cactusImage.image);

            this.cacti.push(cactus);
    }

    update( gameSpeed, frameTime){
        if(this.nextCactusInterval <= 0 ){
            //create cactus
            this.createCactus();
            this.setNextCactusTime();

        }
        this.nextCactusInterval -= frameTime;
        

        this.cacti.forEach((cactus)=> {
            cactus.update(this.speed, gameSpeed, frameTime, this.scaleRatio);
        });

        this.cacti = this.cacti.filter((cactus) => cactus.x > -cactus.width);// to clear the cactus of screen 

        console.log(this.cacti.length);

    }

    draw() {
        this.cacti.forEach((cactus) => cactus.draw());
    }

    collideWith(sprite){
        return this.cacti.some(cactus => cactus.collideWith(sprite));

    }
    
    reset(){
        this.cacti = [];
    }
}
