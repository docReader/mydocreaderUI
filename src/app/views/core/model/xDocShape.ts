/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { ShapeType } from './shape-type';
import { TableCol } from './tableCol';

export class XDocShape {
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  cols: Array<TableCol>;
  id: string;
}
