import { AllowedColors } from "../utils";

export abstract class BaseShape {
    protected left: number;
    protected top: number;
    protected color: AllowedColors;

    constructor(left: number, top: number, color: AllowedColors) {
        this.left = left;
        this.top = top;
        this.color = color;
    }

    getLeft(): number {
        return this.left;
    }
    getTop(): number {
        return this.top;
    }
    setLeft(left: number): void {
        this.left = left;
    }
    setTop(top: number): void {
        this.top = top;
    }
    getColor(): AllowedColors {
        return this.color;
    }
}