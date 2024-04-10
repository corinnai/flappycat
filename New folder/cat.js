export default class Cat {

    walk_animation_timer = 200;
    walkAnimationTimer = this.walk_animation_timer;
    catRunImages=[];

    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    jump_speed = 0.6;
    gravity = 0.4;


    constructor( ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio){
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;



        this.x = 10 * scaleRatio;
        this.y = this.canvas.height - this.height - 15 * scaleRatio;
        this.yStandingPosition = this.y;

        this.stillCat= new Image();
        this.stillCat.src = "./stillcat.png";
        this.image = this.stillCat; 


        const catRunImage1 = new Image();
        catRunImage1.src = "./cat1.png";

        const catRunImage2 = new Image();
        catRunImage2.src = "./cat2.png";

        this.catRunImages.push(catRunImage1);
        this.catRunImages.push(catRunImage2);

        //event listners // keywoard
        window.removeEventListener('keydown', this.keydown);//first remove the previous event listners if they already exist 
        window.removeEventListener('keyup', this.keyup);

        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        //touch event
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend); 

        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);
    }

    touchstart =()=>{
        this.jumpPressed= true;
    }

    touchend =()=>{
        this.jumpPressed= false;
    }


    keydown = (event) =>{
        if(event.code === "Space"){
            this.jumpPressed = true;
        }
    };

    keyup = (event) =>{
        if(event.code === "Space"){
            this.jumpPressed = false;
        }
    };
    
    update(gameSpeed, frameTime){
        // console.log(this.jumpPressed);
        this.run(gameSpeed, frameTime);

        if(this.jumpInProgress){
            this.image = this.stillCat;
        }
        this.jump(frameTime);

    } 

    jump(frameTime){
        if(this.jumpPressed){
            this.jumpInProgress = true;
        }
        if(this.jumpInProgress && !this.falling){
            if(this.y > this.canvas.height - this.minJumpHeight || (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed) ){
                this.y -= this.jump_speed * frameTime * this.scaleRatio;
            }
            else{
                this.falling = true; 
            }
        }
        else{
            if( this.y < this.yStandingPosition){
                this.y += this.gravity * frameTime * this.scaleRatio; // frame size, screen ratio
                if(this.y + this.height > this.canvas.height){
                    this.y = this.yStandingPosition;
                }
            }
            else{
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }
    
    run(gameSpeed, frameTime){
        if(this.walkAnimationTimer <= 0){
            if(this.image === this.catRunImages[0]){
                this.image = this.catRunImages[1];
            }
            else{
                this.image = this.catRunImages[0];
            }
            this.walkAnimationTimer = this.walk_animation_timer;
        }
        this.walkAnimationTimer -= frameTime * gameSpeed;
    }


    draw() {
         this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}