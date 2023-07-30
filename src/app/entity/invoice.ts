import {Employee} from "./employee";
import {Invoicestatus} from "./invoicestatus";
import {Invoiceproduct} from "./invoiceproduct";
import {Order} from "./order";

export class Invoice{

  public id !: number;
  public grandtotal!:number;
  public date!:string;
  public name!:string;

  public employee!:Employee;
  public order!:Order;
  public invoicestatus!:Invoicestatus;
  public invoiceorderproduct!:Array<Invoiceproduct>;

  constructor(id:number,name:string,grandtotal:number,date:string,employee:Employee,order:Order,invoicestatus:Invoicestatus,
              invoiceorderproduct:Array<Invoiceproduct>) {
    this.id=id;
    this.name=name;
    this.grandtotal=grandtotal;
    this.date=date;
    this.employee=employee;
    this.order = order;
    this.invoicestatus = invoicestatus;
    this.invoiceorderproduct = invoiceorderproduct;
  }
}
