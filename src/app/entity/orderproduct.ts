import {Product} from "./product";

export class Orderproduct {

  public id !: number;
  public qty !: number;
  public expectedlinetotal !: number;
  public product!:Product;

  constructor(id:number,product:Product,qty:number,expectedlinetotal:number) {
    this.id=id;
    this.qty=qty;
    this.product = product;
    this.expectedlinetotal=expectedlinetotal;
  }

}


