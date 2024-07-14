import { IShape } from "./IShape";

export interface IRectangle extends IShape {
    getWidth(): number;
    getHeight(): number;
}