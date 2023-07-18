import {Subcategory} from "./subcategory";
import {Producttype} from "./producttype";
import {Productstatus} from "./productstatus";
import {Unit} from "./unit";

export class Product{

  public id !: number;
  public name !: string;
  public code !: string;
  public price !: string;
  public expireduration !: string;
  public description !: string;
  public stock !: string;
  public rpp !: string;
  public dointroduction !: string;
  public image !: string;

  public subcategory !: Subcategory;
  public producttype !: Producttype;
  public productstatus !: Productstatus;
  public unit !: Unit;

  constructor(id:number, name:string,code:string,price:string,expireduration:string,description:string,stock:string,
              rpp:string,dointroduction:string,image:string,subcategory:Subcategory,producttype:Producttype,
              productstatus:Productstatus,unit:Unit) {
    this.id=id;
    this.name=name;
    this.code=code;
    this.price=price;
    this.expireduration=expireduration;
    this.description=description;
    this.stock=stock;
    this.rpp=rpp;
    this.dointroduction=dointroduction;
    this.image=image;
    this.subcategory=subcategory;
    this.producttype=producttype;
    this.productstatus=productstatus;
    this.unit=unit;
  }
}
