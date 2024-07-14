import { BaseRectangle } from "../BaseShapes/BaseRectangle";
import { AllowedColors, Side } from "../utils";

export class Paddle extends BaseRectangle {

    protected width: number = 200;
    protected height: number = 50;
    protected color: AllowedColors = 'purple';

    private intervalId: number | undefined;

    validateAndFixPosition(borderThickness: number): void {
        // Left border
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
        // Right border
        if (this.getRightEdge() + borderThickness > 1000) {
            this.left = 1000 - (this.width + borderThickness) 
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    startMove(step: number, borderThickness: number): void {
        if (this.intervalId !== undefined) return;
        this.intervalId = setInterval(() => {
            this.left += step * 25;
            this.validateAndFixPosition(borderThickness);
        }, 40);
    }

    stopMove(borderThickness: number): void {
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }

    landingSide(landingSpot: number): Side | undefined {
        if (!(this.left < landingSpot && landingSpot < this.getRightEdge())) return undefined;
        return (this.left + (this.width / 4) > landingSpot) ? 'left' : (landingSpot < this.getRightEdge() - (this.width / 4)) ? 'right' : 'center';
    }
}