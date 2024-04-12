import Coin from "./coin.js";

export default class CoinController {
        coin_interval_min = 1900;
        coin_interval_max = 2000;

    nextCoinInterval = null;
    coins = [];

    constructor ( ctx, coinImages , scaleRatio, speed ){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.coinImages = coinImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed; 

        this.setNextCoinTime();
    }

    setNextCoinTime(){
        const num = this.getRandomNumber(
             this.coin_interval_min , 
             this.coin_interval_max);

        this.nextCoinInterval = num;
        // console.log(this.nextCactusInterval);
    }

    getRandomNumber(min, max){
        return Math.floor(Math.random() * (max- min + 1) + min); // to get a random nr between a min and a max 
    }

    createCoin(){
        const coinNumber = this.getRandomNumber(0, this.coinImages.length - 1);
        const coinImage = this.coinImages[coinNumber];
        const x = this.canvas.width * 1.5 ;
        const y = this.canvas.height - coinImage.height - 120;

        const coin = new Coin( 
            this.ctx, 
            x , 
            y , 
            coinImage.width, 
            coinImage.height, 
            coinImage.image);

            this.coins.push(coin);
    }

    update( gameSpeed, frameTime){
        if(this.nextCoinInterval <= 0 ){
            //create cactus
            this.createCoin();
            this.setNextCoinTime();

        }
        this.nextCoinInterval -= frameTime;
        

        this.coins.forEach((coin)=> {
            if (!coin.collected) {
                coin.update(this.speed, gameSpeed, frameTime, this.scaleRatio);
            }
        });

        // this.coins = this.coins.filter((coin) => coin.x > -coin.width);// to clear the cactus of screen // Remove collected coins from the update loop
        this.coins = this.coins.filter((coin) => !coin.collected && coin.x > -coin.width);

        // console.log(this.coins.length);

    }

    // draw() {
    //     this.coins.forEach((coin) => coin.draw());
    // }
    draw() {
        this.coins.forEach((coin) => {
            if (!coin.collected) {
                coin.draw();
            }
        });
    }

    // collideWith(sprite){
    //     return this.coins.some(coin => coin.collideWith(sprite));

    // }
    // checkCollisionsWith(sprite) {
    //     this.coins.forEach(coin => {
    //         if (coin.collideWith(sprite)) {
    //             coin.collected = true;  // Mark the coin as collected
    //         }
    //     });
    // }

    // In CoinController
    checkCollisionsWith(sprite, onCollectCallback) {
    this.coins.forEach(coin => {
        if (!coin.collected && coin.collideWith(sprite)) {
            coin.collected = true;  // Mark the coin as collected
            onCollectCallback();    // Call the callback function to handle the collection
        }
    });
}

    
    reset(){
        this.coins = [];
    }

}
