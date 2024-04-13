import Cat from "./cat.js";
import Ground from "./ground.js";
import CactusController from "./cactusController.js";
import Background from "./background.js";
import CoinController from "./coinController.js";
import Mouse from "./mouse.js";


const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const game_speed_start = 0.65;
const game_width = 800;
const game_height = 250;

const cat_width = 287 / 5;
const cat_height = 295 / 5 ;
const max_jump_height = game_height;
const min_jump_height = 150;

const ground_width = 2475; 
const ground_height = 129/ 10; 
const ground_and_cactus_speed = 0.5;

const mouse_width = 300/6; 
const mouse_height = 300/6; 


const background_width = 900 ;
const background_height = 555/1 ;

const coin_config = [
    { width : 193/ 4,   
      height : 198/4 ,
      image : "./coin.png"
    },
]
const cactus_config = [
    { width : 126 / 2 ,   
      height : 210 / 2,
      image : "./cantus1.png"
    },
    { width : 156 / 2 ,   
      height : 210 / 2 ,
      image : "./cantus2.png"
     }
]


//Game objects
let cat = null;
let ground = null;
let cactusController = null;
let background = null;
let coinController = null;
let mouse = null;


let scaleRatio = null;
let previousTime = null;
let gameSpeed = game_speed_start;
let gameOver = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;
let coinCounter = 0;
let gameComplete = false;
 

function createObject()
{
    const catWidthInGame = cat_width * scaleRatio;
    const catHeightInGame = cat_height * scaleRatio;
    const minJumpInGame = min_jump_height * scaleRatio;
    const maxJumpInGame = max_jump_height * scaleRatio;

    const groundWidthInGame = ground_width * scaleRatio;
    const groundHeightInGame = ground_height * scaleRatio;

    const mouseWidthInGame = mouse_width * scaleRatio;
    const mouseHeightInGame = mouse_height * scaleRatio;

    const backgroundWidthInGame = background_width * scaleRatio;
    const backgroundHeightInGame = background_height * scaleRatio; 

    

    cat = new Cat(
        ctx, 
        catWidthInGame, 
        catHeightInGame, 
        minJumpInGame, 
        maxJumpInGame, 
        scaleRatio);

    ground = new Ground(
        ctx,
        groundWidthInGame,
        groundHeightInGame, 
        ground_and_cactus_speed,
        scaleRatio);

    mouse = new Mouse(
         ctx,
        mouseWidthInGame,
        mouseHeightInGame, 
        ground_and_cactus_speed,
        scaleRatio);


    background = new Background (
        ctx,
        backgroundWidthInGame,
        backgroundHeightInGame, 
        ground_and_cactus_speed,
        scaleRatio);

    const cactusImages = cactus_config.map(cactus => { // transform the string img into an actual image
        const image = new Image();
        image.src = cactus.image;
        return {
            image : image,
            width : cactus.width * scaleRatio,
            height : cactus.height * scaleRatio
        };
    });

    cactusController = new CactusController ( 
        ctx, 
        cactusImages, 
        scaleRatio, 
        ground_and_cactus_speed );

        const coinImages = coin_config.map(coin => { // transform the string img into an actual image
            const image = new Image();
            image.src = coin.image;
            return {
                image : image,
                width : coin.width * scaleRatio,
                height : coin.height * scaleRatio
            };
        });

    coinController = new CoinController (
        ctx, 
        coinImages,
        ground_and_cactus_speed,
        scaleRatio);
    
}


function setScreen() 
{
    scaleRatio = getScaleRatio();
    canvas.width = game_width * scaleRatio;
    canvas.height = game_height * scaleRatio;
    createObject();

}
setScreen();


window.addEventListener("resize", setScreen);

    if(screen.orientation) 
    {
        screen.orientation.addEventListener("change", setScreen);
    }



function getScaleRatio()
{
    const screenHeight = Math.min( window.innerHeight, document.documentElement.clientHeight); // min height of display and user height screen
    const screenWidth = Math.min( window.innerWidth, document.documentElement.clientWidth );



    //window is wider than the game width
    if( screenWidth / screenHeight < game_width / game_height){
        return screenWidth / game_width;
    }
    else {
        return screenHeight / game_height;
    }
}


function reset()
{
    coinCounter = 0;  // Reset the coin counter
    hasAddedEventListenersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    ground.reset();
    cactusController.reset();
    mouse.reset();
    coinController.reset();
    gameSpeed = game_speed_start;
}


function showStartGameText()
{
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const x = canvas.width /14;
    const y = canvas.height / 2;
    ctx.fillText("Tap Screen or Press Space To Start", x, y);
}


function drawScore() 
{
    const fontSize = 20 * scaleRatio; // Scale the font size with the game's scale ratio
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "grey";
    const scoreText = `Coins: ${coinCounter}`;
    const x = canvas.width / 1.2;
    const y = canvas.height/9;
    ctx.fillText(scoreText, x, y); // You can adjust the position as needed
}


function clearScreen(frameTime)
{
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


function showGameOver()
{
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana `;
    ctx.fillStyle = "grey";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("Game Over" , x, y);
    ctx.fillText("Try again" , x*1.2, y*1.5);
}


function gameFinish()
{
    const fontSize = 50 * scaleRatio;
    ctx.font = `${fontSize}px Verdana `;
    ctx.fillStyle = "grey";
    const x = canvas.width/8 ;
    const y = canvas.height/2;
    ctx.fillText("Congratulations! You win!" , x, y);  
}


function setupGameReset() 
{
    if(!hasAddedEventListenersForRestart){
        hasAddedEventListenersForRestart = true;

        setTimeout(()=>{
            window.addEventListener("keyup" , reset, {once: true});
            window.addEventListener("touchstart" , reset, {once: true});
        }, 1000);
       
    }
}


function gameLoop(currentTime)
{

        if(previousTime === null){
            previousTime = currentTime;
            requestAnimationFrame(gameLoop);
            return;
        }
    const  frameTime = currentTime - previousTime; // to move the same speed doesnt matter the windows frame rate 
    previousTime = currentTime;
    clearScreen();
        

    if(!gameOver && !waitingToStart && !gameComplete)
    {
        // update game objects
        background.update(gameSpeed, frameTime);
        mouse.update(gameSpeed, frameTime)
        cat.update(gameSpeed, frameTime);
        cactusController.update(gameSpeed , frameTime); 
        ground.update(gameSpeed, frameTime);
        coinController.update(gameSpeed, frameTime);

        coinController.checkCoinCactusCollisions(cactusController.cacti); 

        coinController.checkCollisionsWith(cat, () => {
            coinCounter++;
            if (coinCounter >= 10 ) {
                gameComplete = true;
                gameFinish();
            }
        });

    }
    

    // draw game objects 
    background.draw();
    ground.draw();
    mouse.draw();
    coinController.draw();
    cactusController.draw();
    cat.draw();
    drawScore();


    if (!gameOver && cactusController.collideWith(cat)) 
    {
        gameOver = true;
        setupGameReset();
    }


    if(gameOver){
        showGameOver()
    }
     
    if(gameComplete){
        gameFinish();
    }

    if(waitingToStart){
        showStartGameText();
    }
        requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup" , reset, {once: true});
window.addEventListener("touchstart" , reset, {once: true});