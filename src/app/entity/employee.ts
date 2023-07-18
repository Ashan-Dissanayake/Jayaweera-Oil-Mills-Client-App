import{Gender} from "./gender";
import{Designation} from "./designation";
import {Employeestatus} from "./employeestatus";

export class Employee{
  public id !: number;
  public number !: string;
  public fullname !: string;
  public callingname !: string;
  public nic !: string;
  public dobirth !: string;
  public address !: string;
  public mobile !: string;
  public land !: string;
  public doassignment !: string;
  public description !: string;
  // @ts-ignore
  public photo !: string;
  public gender !: Gender;
  public designation !: Designation;
  public employeestatus !: Employeestatus;

  constructor(id:number,number:string,nic:string,fullname:string,callingname:string,
              gender:Gender,designation:Designation,dobirth:string,address:string,mobile:string,
              land:string,doassignment:string,description:string, photo:string,employeestatus:Employeestatus) {
    this.id=id;
    this.number=number;
    this.fullname=fullname;
    this.callingname=callingname;
    this.nic=nic;
    this.gender=gender;
    this.designation=designation;
    this.dobirth=dobirth;
    this.address=address;
    this.mobile=mobile;
    this.land=land;
    this.doassignment=doassignment;
    this.description=description;
    this.photo=photo;
    this.employeestatus=employeestatus;
  }

}
