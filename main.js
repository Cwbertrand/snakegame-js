
const playBoard = document.querySelector('.play_board');
const scoreElement = document.querySelector('.score');
const highestScoreElement = document.querySelector('.high_score');
const controlsElement = document.querySelectorAll('.controls i');


let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalid;
let score = 0;

//Getting hihest scores from local storage in the name highest_score
let highestScore = localStorage.getItem('highest_score') || 0;
highestScoreElement.innerHTML = `Highest score: ${highestScore}`;


//function handling game over
const handleGameOver = function(){

    //clearing the time and reloading the page automatically
    clearInterval(setIntervalid);
    alert('Game Over! Press OK to restart!');
    location.reload();
}

// Creating snake food and snake head
const initGame = () => {

    //what happens when game is over
    if(gameOver) return handleGameOver();

    //this food changes position when the snake its the food
    if(snakeX === foodX && snakeY === foodY){
        randomPosition(); 
        snakeBody.push([foodX, foodY]); //add the food to snake body
        
        //adding the score
        score ++;
        //appending the score to dom
        scoreElement.innerHTML = `Score: ${score}`;

        //handling highest score from the local storage
        highestScore = score >= highestScore ? score : highestScore;
        localStorage.setItem('highest_score', highestScore);

    }

    //the grid_area is a shorthand property that sets values of the grid item start and end line for both columns and rows
    let htmlMarkUp = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //extend the length of the snake's body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
        
    }

    //updating the snake's head position based on the clicked arrow key
    snakeX += velocityX;
    snakeY += velocityY;
    snakeBody[0] = [snakeX, snakeY]; //setting the first position of the snake

    //Check if the snakes head is out of the wall, if so, then game over
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    //adding a size of the snake each moment he eats a food div in red.
    //htmlMarkUp += snakeBody.map(([x, y]) => `<div class="head" style="grid-area: ${y} / ${x}"></div>`).join('');
    for(let i = 0; i < snakeBody.length; i++){
        htmlMarkUp += `<div class="head" style="grid-area: ${snakeBody[i][1] } / ${snakeBody[i][0] }"></div>`;
        
        //checking if the snake head hits the body. then it's game over
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
            gameOver = true;
        }
    }

    //creating a food div and appending it to the playboard dom element
    playBoard.innerHTML = htmlMarkUp;
}

//this will make the snake to start moving immediately as the game starts
setIntervalid = setInterval(initGame, 125);


//Randomly change the position of the food element
const randomPosition = () => {
    //here you round down after you must have multiply the math.random() function by 30(being the grid template size in play_board class css)
    // it just like passing from 0 - 30 random values as food position just within .game_board
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    
}

randomPosition();

//changes direction as the key is pressed and also restrict from going inversely
const changeDirection = (e) => {
    if(e.key === 'ArrowUp' && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
    }else if(e.key === 'ArrowDown' && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }else if(e.key === 'ArrowLeft' && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }else if(e.key === 'ArrowRight' && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
}
//Moving snake head using arrow keys on the keyboard
document.addEventListener('keydown', changeDirection);

//Controlling directions with controls from the application
controlsElement.forEach(key => {
    key.addEventListener('click', () => changeDirection({key: key.dataset.key}));
});

