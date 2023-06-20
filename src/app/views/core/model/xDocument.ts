/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { XDocPage } from './xDocPage';

export class XDocument {
  name: string;
  id: string;
  projectId: number;
  noOfPages: number;
  pages: Array<XDocPage> = [];
}
