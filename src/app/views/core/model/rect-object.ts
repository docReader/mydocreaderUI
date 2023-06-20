import { fabric } from 'fabric';
import { ShapeType } from './shape-type';
import { TableCol } from './tableCol';

export class RectObject {
  cols: Array<TableCol>;
  rect: fabric.Rect;

  public constructor(
    private rectType: ShapeType,
    private left: number,
    private top: number,
    private width: number,
    private height: number
  ) {}

  getLeft() {
    return this.left;
  }
  getTop() {
    return this.top;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

  setCols(cols: Array<TableCol>) {
    this.cols = cols;
  }
  setRect(rect: fabric.Rect) {
    this.rect = rect;
  }

  getType(): ShapeType {
    return this.rectType;
  }

  getCols() {
    return this.cols;
  }
  getRect(): fabric.Rect {
    return this.rect;
  }
}
