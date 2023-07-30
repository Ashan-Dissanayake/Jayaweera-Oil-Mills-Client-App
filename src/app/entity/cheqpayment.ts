import {Bank} from "./bank";
import {Cheqstatus} from "./cheqstatus";

export class Cheqpayment{

  public id !: number;
  public cheqnumber !: string;
  public dorealized !: string;
  public description !: string;

  public bankid !: Bank;
  public cheqstatusid !: Cheqstatus;

  constructor(id:number, cheqnumber:string,dorealized:string,bankid:Bank,cheqstatusid:Cheqstatus) {
    this.id=id;
    this.cheqnumber=cheqnumber;
    this.dorealized=dorealized;
    this.bankid=bankid;
    this.cheqstatusid=cheqstatusid;

  }
}
