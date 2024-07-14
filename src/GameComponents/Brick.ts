import { BaseRectangle } from "../BaseShapes/BaseRectangle";
import { AllowedColors } from "../utils";

export class Brick extends BaseRectangle {

    protected width: number = 178;
    protected height: number = 75;
    protected color: AllowedColors;

    private lives: number = 1;

    constructor(left: number, top: number, color: AllowedColors, lives: number) {
        super(left, top, color);
        this.color = color;
        this.lives = lives;
    }

    getExists(): boolean {
        return this.lives > 0;
    }
    getLives(): number {
        return this.lives;
    }
    setLives(lives: number): void {
        this.lives = lives;
    }
    decreaseLives(): void {
        this.lives--;
        this.color = (Brick.getColorForLives(this.lives));
    }

    // Decides the color of the brick based on the amount of lives - the less lives the lighter the color.
    static getColorForLives(lives: number): AllowedColors {
        return (lives === 1) ? '#ccddff' : (lives === 2) ? '#99bbff' : '#6699ff';
    }

    static calculateBrickLeft(column: number, brickGap: number, brickWidth: number, borderThickness: number): number {
        return borderThickness + ((column + 1) * brickGap) + (column * brickWidth);
    }
    static calculateBrickTop(row: number, brickGap: number, brickHeight: number, borderThickness: number): number {
        return borderThickness + ((row + 1) * brickGap) + (row * brickHeight);
    }
}
