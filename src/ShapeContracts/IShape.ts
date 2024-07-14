import { AllowedColors } from "../utils";

export interface IShape {
    getLeft(): number;
    getTop(): number;

    getRightEdge(): number;
    getBottomEdge(): number;

    setLeft(left: number): void;
    setTop(top: number): void;

    getColor(): AllowedColors;
}