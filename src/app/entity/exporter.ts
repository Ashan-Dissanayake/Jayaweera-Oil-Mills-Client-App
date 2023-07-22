import {Exportertype} from "./exportertype";
import {Exporterstatus} from "./exporterstatus";

export class Exporter{

  public id !: number;
  public name !: string;
  public telephone !: string;
  public email !: string;
  public address !: string;
  public contactperson !: string;
  public contacttlp !: string;
  public description !: string;
  public creditlimit !: string;

  public exporterstatus !: Exporterstatus;
  public exportertype !: Exportertype;


  constructor(id:number, name:string, telephone:string,email:string,address:string,contactperson:string,
              contacttlp:string,description:string,creditlimit:string,exporterstatus:Exporterstatus,exportertype:Exportertype) {
    this.id=id;
    this.name=name;
    this.telephone=telephone;
    this.email=email;
    this.address=address;
    this.contactperson=contactperson;
    this.contacttlp=contacttlp;
    this.description=description;
    this.creditlimit=creditlimit;
    this.exporterstatus=exporterstatus;
    this.exportertype=exportertype;
  }
}
