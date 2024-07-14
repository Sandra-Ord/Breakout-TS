import { BaseRectangle } from "./BaseShapes/BaseRectangle";
import { Ball } from "./GameComponents/Ball";
import { Brick } from "./GameComponents/Brick";
import { Paddle } from "./GameComponents/Paddle";
import { AllowedColors } from "./utils";

export default class Brain {

    readonly width: number = 1000;
    readonly height: number = 1000;
    readonly borderThickness: number = 25;

    private paddleColor: AllowedColors = 'purple';
    private ballColor: AllowedColors = 'blue';

    paddle: Paddle = new Paddle(500, 800, this.paddleColor);

    ball: Ball = new Ball(500, 500, this.ballColor);

    readonly brickRows: number = 3;
    readonly brickColumns: number = 5;

    private brickNr: number = this.brickRows * this.brickColumns;
    
    readonly brickWidth: number = 178;
    readonly brickHeight: number = 75;

    readonly brickGap: number = 10;

    bricks: Brick[][] = [];

    gamePaused: boolean = true;
    gameStatus: number = 0;
    score: number = 0;

    lastResults: number[] = [];
    bestResults: number[] = [];
 
    constructor() {
        console.log("Brain ctor");
        this.initializeBricks();
        this.initializeRandomDirectionBall();
    }

    // -------------------------------------------- Paddle moving --------------------------------------------

    // Paddle is moved by the step.
    startMovePaddle(paddle: Paddle, step: number): void {
        if (this.gamePaused) return;
        paddle.startMove(step, this.borderThickness);
    }

    // Paddle's motion is stopped.
    stopMovePaddle(paddle: Paddle): void {
        if (this.gamePaused) return;
        paddle.stopMove(this.borderThickness);
    }

    // -------------------------------------------- Ball moving --------------------------------------------

    // Ball is moved in its current direction by the current step value.
    moveBall(): void {
        if (this.ball.intervalId !== undefined) return;

        this.ball.intervalId = setInterval(() => {
            if (this.gamePaused) {
                clearInterval(this.ball.intervalId);
                this.ball.intervalId = undefined;
            }
            this.ball.setLeft(this.ball.getLeft() + this.ball.getStep() * Math.cos(this.ball.degToRad(this.ball.getDirection())));
            this.ball.setTop(this.ball.getTop() + this.ball.getStep() * Math.sin(this.ball.degToRad(this.ball.getDirection())));
            this.collisionDetection(this.borderThickness);
        }, 40);
    }

    // ---------------------------------------- Collision detection ----------------------------------------

    // Detect any collision (bricks, paddle, border).
    collisionDetection(borderThickness: number): void {
        // detect paddle collision
        this.checkAndHandleRectangleCollision(this.ball, this.paddle);
        
        // detect border collision
        this.checkAndHandleBorderCollision(this.ball, borderThickness);

        // detect brick collisions
        for (let row = 0; row < this.brickRows; row++) {
            for (let column = 0; column < this.brickColumns; column++) {
                let brick = this.bricks[row][column];
                
                if (!brick.getExists()) {
                    continue;
                }

                let collision = this.checkAndHandleRectangleCollision(this.ball, brick);
                if (collision) {
                    brick.decreaseLives();
                    this.score += 50;
                    if (brick.getLives() == 1) { 
                        this.ball.setStep(this.ball.getStep() + 0.5); 
                    }
                    if (brick.getLives() == 0) { 
                        this.destroyBrick(); 
                        this.ball.setStep(this.ball.getStep() + 1);
                    }
                }      
            }
        }
    }

    // ------------------------------------------ Collision handling -----------------------------------------

    // Collision detection and handler for paddle and bricks.
    private checkAndHandleRectangleCollision(ball: Ball, rectangle: BaseRectangle): boolean {
        const collisions = [
            { condition: Brain.ballCollisionRectangleBottom, handler: () => ball.handleHorizontalCollision(rectangle.getBottomEdge(), this.paddle.landingSide(this.ball.getLeftCenter())) },
            { condition: Brain.ballCollisionRectangleLeft, handler: () => ball.handleVerticalCollision(rectangle.getLeft() - ball.getDiameter()) },
            { condition: Brain.ballCollisionRectangleRight, handler: () => ball.handleVerticalCollision(rectangle.getRightEdge()) },
            { condition: Brain.ballCollisionRectangleTop, handler: () => ball.handleHorizontalCollision(rectangle.getTop() - ball.getDiameter(), this.paddle.landingSide(this.ball.getLeftCenter())) }
        ];
    
        for (const collision of collisions) {
            if (collision.condition(ball, rectangle)) {
                collision.handler();
                return true;
            }
        }
        return false;
    }

    // Collision detection and handler for borders.
    private checkAndHandleBorderCollision(ball: Ball, borderThickness: number): void {
        const collisions = [
            { condition: ball.getBottomEdge() + borderThickness > this.height, handler: () => this.setNewGameStatus(-1)},
            { condition: ball.getLeft() < borderThickness, handler: () => ball.handleVerticalCollision(borderThickness) },
            { condition: ball.getRightEdge() + borderThickness > this.width, handler: () => ball.handleVerticalCollision(this.width - (ball.getDiameter() + borderThickness)) },
            { condition: ball.getTop() < borderThickness, handler: () => ball.handleHorizontalCollision(borderThickness) }
        ];

        for (const collision of collisions) {
            if (collision.condition) {
                collision.handler();
                return;
            }
        }
    }

    // ------------------------------------ Collision detection predicates ------------------------------------

    private static ballCollisionRectangleTop(ball: Ball, rectangle: BaseRectangle): boolean {
        return Brain.ballInRectangleTop(ball, rectangle) && Brain.ballInRectangleWidth(ball, rectangle);
    }
    private static ballCollisionRectangleBottom(ball: Ball, rectangle: BaseRectangle): boolean {
        return Brain.ballInRectangleBottom(ball, rectangle) && Brain.ballInRectangleWidth(ball, rectangle);
    }
    private static ballCollisionRectangleLeft(ball: Ball, rectangle: BaseRectangle): boolean {
        return Brain.ballInRectangleLeft(ball, rectangle) && Brain.ballInRectangleHeight(ball, rectangle);
    }
    private static ballCollisionRectangleRight(ball: Ball, rectangle: BaseRectangle): boolean {
        return Brain.ballInRectangleRight(ball, rectangle) && Brain.ballInRectangleHeight(ball, rectangle);
    }

    private static ballInRectangleTop(ball: Ball, rectangle: BaseRectangle): boolean {
        return ball.getBottomEdge() >= rectangle.getTop() && ball.getTop() < rectangle.getTop();
    }
    private static ballInRectangleBottom(ball: Ball, rectangle: BaseRectangle): boolean {
        return ball.getTop() <= rectangle.getBottomEdge() && ball.getBottomEdge() > rectangle.getBottomEdge();
    }
    private static ballInRectangleLeft(ball: Ball, rectangle: BaseRectangle): boolean {
        return ball.getRightEdge() >= rectangle.getLeft() && ball.getLeft() < rectangle.getLeft();
    }
    private static ballInRectangleRight(ball: Ball, rectangle: BaseRectangle): boolean {
        return ball.getLeft() <= rectangle.getRightEdge() && ball.getRightEdge() > rectangle.getRightEdge();
    }
    private static ballInRectangleWidth(ball: Ball, rectangle: BaseRectangle): boolean {
        return ball.getLeftCenter() > rectangle.getLeft() && ball.getLeftCenter() < rectangle.getRightEdge();
    }
    private static ballInRectangleHeight(ball: Ball, rectangle: BaseRectangle): boolean {
        return ball.getTopCenter() > rectangle.getTop() && ball.getTopCenter() < rectangle.getBottomEdge();
    }

    // --------------------------------------------------------------------------------------------------------    
    // ------------------------------------------- Game initializing ------------------------------------------
    
    // Creates a new ball with a random direction between 45 and 135 degrees.
    private initializeRandomDirectionBall() {
        this.ball = new Ball(500, 500, this.ballColor);
        this.ball.setDirection(45 + Math.floor(Math.random() * 91));
    }
    
    // Creates the brickgrid - gives each brick a random amount of lives from 1-3.
    private initializeBricks(): void {
        const livesArray = [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3];
        Brain.shuffleLivesArray(livesArray);
        this.brickNr = this.brickRows * this.brickColumns;
        let livesIndex = 0;

        for (let row = 0; row < this.brickRows; row++) {
            this.bricks[row] = [];
            for (let column = 0; column < this.brickColumns; column++) {

                const lives = livesArray[livesIndex++ % livesArray.length];

                this.bricks[row][column] = new Brick(
                    Brick.calculateBrickLeft(column, this.brickGap, this.brickWidth, this.borderThickness), 
                    Brick.calculateBrickTop(row, this.brickGap, this.brickHeight, this.borderThickness),
                    Brick.getColorForLives(lives),
                    lives);
            }
        }
    }

    // Shuffles the array of numbers - used to keep the total amount of lives the bricks in the game have constant, but randomized.
    private static shuffleLivesArray(array: number[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Destroys a brick (decreases the brick count), adds points for the brick and checks if the game is over.
    private destroyBrick(): void {
        this.score += 25;
        this.brickNr--;
        if (this.brickNr === 0) {
            this.setNewGameStatus(1);
        }
    }

    // Returns an array with the first 5 elements of the given array.
    private static reduceResultsToFive(results: Array<number>): Array<number> {
        if (results.length > 5) {
            results = results.slice(0, 5)
        }
        return results;
    }

    // Finishes the last game by saving the results.
    private finishUpLastGame(): void {
        this.lastResults.unshift(this.score);
        this.lastResults = Brain.reduceResultsToFive(this.lastResults);
        if (this.bestResults.length < 5) {
            this.addScoreSortReverseResults();
        } else if (this.score > Math.min.apply(null, this.bestResults)) {
            this.addScoreSortReverseResults();
            this.bestResults = Brain.reduceResultsToFive(this.bestResults);
        }
        this.score = 0;
    }

    // Save the current score and sort the results list.
    private addScoreSortReverseResults(): void {
        this.bestResults.push(this.score);
        this.bestResults.sort();
        this.bestResults.reverse;
    }

    // Prepare for a new game by resetting the status and score.
    private setNewGameStatus(newStatus: number): void {
        this.gameStatus = newStatus;
        this.gamePaused = true;
    }

    // Start a new game (save the last result, create a new ball, new paddle, new bricks).
    reStartGame(): void {
        this.finishUpLastGame();
        this.initializeBricks();
        this.initializeRandomDirectionBall();
        this.paddle = new Paddle(500, 800, this.paddleColor);
        this.setNewGameStatus(0);
    }

    getBrickNr(): number {
        return this.brickNr;
    }
}