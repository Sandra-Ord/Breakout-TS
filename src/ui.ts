import { BaseRectangle } from "./BaseShapes/BaseRectangle";
import { BaseShape } from "./BaseShapes/BaseShape";
import { Ball } from "./GameComponents/Ball";
import Brain from "./brain";
import { AllowedColors } from "./utils";

export default class UI {

    private width: number = -1;
    private height: number = -1;

    private brain: Brain;
    private appContainer: HTMLDivElement;

    private scaleX: number = 1;
    private scaleY: number = 1;

    constructor(brain: Brain, appContainer: HTMLDivElement) {
        this.brain = brain;
        this.appContainer = appContainer;
        
        this.setScreenDimensions();
    }

    setScreenDimensions(width?: number, height?: number) {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;
    }

    calculateScaledX(x: number): number {
       return x * this.scaleX | 0; 
    }

    calculateScaledY(y: number): number {
        return y * this.scaleY | 0;
    }

    setDivLeftAndTop(divContainer: HTMLDivElement, left: number, top: number): void {
        divContainer.style.left = left + 'px';
        divContainer.style.top = top + 'px';
    }

    setDivWidthAndHeight(divContainer: HTMLDivElement, width: number, height: number): void {
        divContainer.style.width = width + 'px';
        divContainer.style.height = height + 'px';
    }

    setDivCommonStyle(divContainer: HTMLDivElement, zIndex: string, backgroundColor: AllowedColors, position: string = 'fixed'): void {
        divContainer.style.zIndex = zIndex;
        divContainer.style.backgroundColor = backgroundColor;
        divContainer.style.position = position;
    }

    drawBorderSingle(left: number, top: number, width: number, height: number, color: AllowedColors): void {
        let border = document.createElement('div');
        border.setAttribute('class', 'border');

        this.setDivCommonStyle(border, '20', color);
        this.setDivLeftAndTop(border, left, top);
        this.setDivWidthAndHeight(border, width, height);
        
        this.appContainer.append(border);
    }

    drawBorder(): void {
        let color: AllowedColors = 'white';
        let calculatedBorderWidth = this.calculateScaledX(this.brain.borderThickness);
        let calculatedBorderHeight = this.calculateScaledY(this.brain.borderThickness);
        // top border
        this.drawBorderSingle(0, 0, this.width, calculatedBorderHeight, color);
        // left border
        this.drawBorderSingle(0, 0, calculatedBorderWidth, this.height, color);
        // right border
        this.drawBorderSingle(this.width - calculatedBorderWidth, 0, calculatedBorderWidth, this.height, color);
        // bottom border
        this.drawBorderSingle(0, this.height - calculatedBorderHeight, this.width, calculatedBorderHeight, color);
    }

    drawShape(shape: BaseShape, borderRadius: string, className: string = ''): HTMLDivElement {
        let shapeDiv = document.createElement('div'); 
        shapeDiv.setAttribute('class', className);
        this.setDivCommonStyle(shapeDiv, '5', shape.getColor());
        shapeDiv.style.borderRadius = borderRadius;
        this.setDivLeftAndTop(shapeDiv, this.calculateScaledX(shape.getLeft()), this.calculateScaledY(shape.getTop()));
        return shapeDiv;
    }

    drawRectangle(rectangle: BaseRectangle, className: string = ''): void {
        let rectangleDiv = this.drawShape(rectangle, '50px', className);
        this.setDivWidthAndHeight(rectangleDiv, this.calculateScaledX(rectangle.getWidth()), this.calculateScaledY(rectangle.getHeight()));
        this.appContainer.append(rectangleDiv);
    }

    drawBall(ball: Ball): void {
        let ballDiv = this.drawShape(ball, '50%', 'ball');
        this.setDivWidthAndHeight(ballDiv, this.calculateScaledX(ball.getDiameter()), this.calculateScaledX(ball.getDiameter()));
        this.appContainer.append(ballDiv);
    }

    drawBricks(): void {
        for (let row = 0; row < this.brain.brickRows; row++) {
            for (let column = 0; column < this.brain.brickColumns; column++) {
                let brick = this.brain.bricks[row][column];
                if (brick.getExists()) {
                    this.drawRectangle(brick, 'brick');
                }
            }
        }
    }

    instructionsScreen(): HTMLDivElement {
        let instructionsDiv = document.createElement('div');
        instructionsDiv.setAttribute('class', 'instructions');

        instructionsDiv.append(this.statusTitle());

        this.addEmptyLine(instructionsDiv);

        instructionsDiv.appendChild(this.currentPoints());

        this.addEmptyLine(instructionsDiv);

        this.appendInstructions(instructionsDiv);

        this.addEmptyLine(instructionsDiv);

        instructionsDiv.append(this.resultList());

        return instructionsDiv;
    }

    statusTitle(): HTMLDivElement {
        let statusDiv = document.createElement('div');
        statusDiv.setAttribute('class', 'status');
        statusDiv.innerHTML = (this.brain.gameStatus < 0) ? 'GAME OVER!' : (this.brain.gameStatus > 0) ? 'GAME WON!' : 'GAME PAUSED!';
        return statusDiv;
    }

    currentPoints(): HTMLDivElement {
        let pointsDiv = document.createElement('div');
        pointsDiv.setAttribute('class', 'points');
        pointsDiv.innerHTML = this.brain.score + ' points';
        return pointsDiv;
    }

    appendInstructions(container: HTMLDivElement): void {
        let instructions = [
            'ENTER - unpause game', 
            'ESC - pause game', 
            'SPACE - start a new game', 
            '&#x2190; | A - paddle to left', 
            '&#x2192; | D - paddle to right'
        ];

        instructions.forEach(instruction => {
            let instructionDiv = document.createElement('div');
            instructionDiv.innerHTML = instruction;
            container.append(instructionDiv);
        });
    }

    resultList(): HTMLDivElement {
        let bestResultsDiv = document.createElement('div'); 
        bestResultsDiv.setAttribute('class', 'points');
        let resultTitle = document.createElement('div');
        resultTitle.innerHTML = 'Best results:';
        bestResultsDiv.append(resultTitle);
        let divider = document.createElement('div');
        divider.innerHTML = '...';
        bestResultsDiv.append(divider);

        let index = 0;
        this.brain.bestResults.forEach(result => {
            let resultDiv = document.createElement('div');
            resultDiv.innerHTML = ++index + '. ' +  result.toString();
            bestResultsDiv.append(resultDiv);
        });
        return bestResultsDiv;
    }

    addEmptyLine(container: HTMLDivElement): void {
        let emptyLineDiv = document.createElement('div');
        emptyLineDiv.innerHTML = '&nbsp';
        container.appendChild(emptyLineDiv);
    }

    drawPauseScreen(): void {
        let pauseDiv = document.createElement('div');
        pauseDiv.setAttribute('class', 'pause');

        this.setDivCommonStyle(pauseDiv, '10', 'gray');
        pauseDiv.style.opacity = '0.75';
  
        this.setDivLeftAndTop(pauseDiv, 0, 0);
        this.setDivWidthAndHeight(pauseDiv, this.width, this.height);

        let textDiv = document.createElement('div');
        this.setDivWidthAndHeight(textDiv, this.width, this.height);
        textDiv.setAttribute('class', 'vertical-alignment');

        textDiv.append(this.instructionsScreen());

        pauseDiv.append(textDiv);
        this.appContainer.append(pauseDiv);
    }

    draw(): void {
    
        this.appContainer.innerHTML = '';

        if (this.brain.gamePaused) {                
            this.drawPauseScreen();
        }

        this.setScreenDimensions();
        this.drawBorder();

        this.drawRectangle(this.brain.paddle, 'paddle')
        this.drawBricks();
        this.drawBall(this.brain.ball);
    }
}