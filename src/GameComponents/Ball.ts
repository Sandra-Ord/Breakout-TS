import { BaseShape } from "../BaseShapes/BaseShape";
import { IShape } from "../ShapeContracts/IShape";
import { AllowedColors, Side } from "../utils";

export class Ball extends BaseShape implements IShape {

    private diameter: number = 50;

    private direction: number = 135;

    protected color: AllowedColors = 'blue';

    private step: number;

    intervalId: number | undefined;

    constructor(left: number, top: number, color: AllowedColors, step: number = 10) {
        super(left, top, color);
        this.step = step;
    }

    getRightEdge(): number {
        return this.left + this.diameter;
    }
    getBottomEdge(): number {
        return this.top + this.diameter;
    }
    getLeftCenter(): number {
        return this.left + (this.diameter / 2);
    }
    getTopCenter(): number {
        return this.top + (this.diameter / 2);
    }
    getDiameter(): number {
        return this.diameter;
    }
    setDiameter(diameter: number): void {
        this.diameter = diameter;
    }
    getDirection(): number {
        return this.direction;
    }
    setDirection(direction: number): void {
        this.direction = direction;
    }
    getStep(): number {
        return this.step;
    }
    setStep(newStep: number): void {
        this.step = newStep;
    }

    degToRad(degrees: number): number {
        return degrees * (Math.PI/180);
    }

    directionUp(): boolean {
        return 180 < this.direction && this.direction < 360;
    }
    directionDown(): boolean {
        return 0 < this.direction && this.direction < 180;
    }

    // Reflects the ball's direction based on where it landed and what direction it was going (used to create the feeling of a curved paddle).
    horizontalReflection(landingOn: Side | undefined = undefined): void {
        this.direction = 360 - this.direction;
        if (landingOn == undefined || landingOn == 'center') return;

        let changeBy = (this.directionDown() ? Math.abs(90 - this.direction) : Math.abs(270 - this.direction)) / 4;

        this.direction += (this.directionUp() && landingOn == 'right' || this.directionDown() && landingOn == 'left') ? changeBy : 0;
        this.direction -= (this.directionDown() && landingOn == 'right' || this.directionUp() && landingOn == 'left') ? changeBy : 0;

        this.direction = (360 + this.direction) % 360;

        if (Math.abs(180 - this.direction) < 10 || Math.abs(0 - this.direction) < 10) {
            // Make sure the game play is not too slow
            if (0 < this.direction && this.direction < 90 || 180 < this.direction && this.direction < 270) {
                this.direction += 10;
            } else {
                this.direction -= 10;
            }
        }
    }
    verticalReflection(): void {
        this.direction = (360 + (180 - this.direction)) % 360;
    }

    // Fixes the coordinates so the ball would not go inside the obstacle and gives the ball a new direction after the bounce.
    handleHorizontalCollision(fixedTop: number, landingOn: Side | undefined = undefined): void {
        this.top = fixedTop;
        this.horizontalReflection(landingOn);
    }
    handleVerticalCollision(fixedLeft: number): void {
        this.left = fixedLeft;
        this.verticalReflection();
    }
} 