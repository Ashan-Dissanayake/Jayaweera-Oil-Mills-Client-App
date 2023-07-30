import {Paymenttype} from "./paymenttype";
import {Paymentstatus} from "./paymentstatus";
import {Employee} from "./employee";

export class Payment{

  public id !: number;
  public date !: string;
  public amount !: string;
  public description !: string;

  public paymenttypeid !: Paymenttype;
  public paymentstatus !: Paymentstatus;
  public employeeid !: Employee;
 // public invoiceid !: Invoice;

  constructor(id:number, date:string,amount:string,description:string,paymenttypeid:Paymenttype,
              paymentstatus:Paymentstatus,employeeid:Employee) {
    this.id=id;
    this.date=date;
    this.amount=amount;
    this.description=description;
    this.paymenttypeid=paymenttypeid;
    this.paymentstatus=paymentstatus;
    this.employeeid=employeeid;
  }
}
