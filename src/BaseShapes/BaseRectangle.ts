import { IRectangle } from "../ShapeContracts/IRectangle";
import { BaseShape } from "./BaseShape";

export abstract class BaseRectangle extends BaseShape implements IRectangle {

    protected width: number = 200;
    protected height: number = 50;

    getWidth(): number {
        return this.width;
    }
    getHeight(): number {
        return this.height;
    }
    getBottomEdge(): number {
        return this.top + this.height;
    }
    getRightEdge(): number {
        return this.left + this.width;
    }
}