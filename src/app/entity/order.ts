import {Exporter} from "./exporter";
import {Orderstatus} from "./orderstatus";
import {Employee} from "./employee";
import {Orderproduct} from "./orderproduct";

export class Order{

  public id !: number;
  public exporter!:Exporter;
  public employee!:Employee;
  public doplaced!:string;
  public doexpected!:string;
  public expectedgrandtotal!:number;
  public description!:string;
  public orderstatus!:Orderstatus;
  public orderproducts!:Array<Orderproduct>;

  constructor(id:number, exporter:Exporter,employee:Employee,doplaced:string,doexpected:string,
              expectedgrandtotal:number,description:string,orderstatus:Orderstatus,orderproducts:Array<Orderproduct>) {
    this.id=id;
    this.exporter=exporter;
    this.employee=employee;
    this.doexpected = doexpected;
    this.doplaced = doplaced;
    this.expectedgrandtotal= expectedgrandtotal;
    this.description = description;
    this.orderstatus = orderstatus;
    this.orderproducts = orderproducts;
  }
}
