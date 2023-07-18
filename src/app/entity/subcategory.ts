import {Category} from "./category";

export class Subcategory{

  public id !: number;
  public name !: string;
  public category !: Category;
  constructor(id:number, name:string) {
    this.id=id;
    this.name=name;

  }
}
