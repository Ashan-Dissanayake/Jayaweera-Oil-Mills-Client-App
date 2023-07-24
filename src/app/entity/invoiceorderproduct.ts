import {Product} from "./product";
import {Orderproduct} from "./orderproduct";

export class Invoiceorderproduct {

  public id !: number;
  public qty !: number;
  public linetotal !: number;
  public orderproduct!:Orderproduct;

  constructor(id:number,orderproduct:Orderproduct,qty:number,linetotal:number) {
    this.id=id;
    this.qty=qty;
    this.orderproduct = orderproduct;
    this.linetotal=linetotal;
  }

}


