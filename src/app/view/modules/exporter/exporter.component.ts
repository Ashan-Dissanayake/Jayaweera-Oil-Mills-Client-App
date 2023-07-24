import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Exporter} from "../../../entity/exporter";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {Exporterstatus} from "../../../entity/exporterstatus";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Exportertype} from "../../../entity/exportertype";
import {ExporterstatusService} from "../../../service/exporterstatusservice";
import {ExportertypeService} from "../../../service/exportertypeservice";
import {DatePipe} from "@angular/common";
import { MessageComponent } from '../../../util/dialog/message/message.component';
import {ExporterService} from "../../../service/exporterservice";
import {RegexService} from "../../../service/RegexService";

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.css']
})
export class ExporterComponent {

  public form!: FormGroup;
  public csearch!: FormGroup;
  public ssearch!: FormGroup;

  exporter!: Exporter;
  oldexporter!: Exporter|undefined;

  exporters: Array<Exporter> = [];
  exporterstatus: Array<Exporterstatus>=[];
  exportertypes: Array<Exportertype>=[];

  imageempurl: string = 'assets/default.png';

  regexes!:any;

  columns: string[] = ['name', 'telephone', 'email', 'address','contactperson','contacttlp','description','creditlimit','exporterstatus','exportertype'];
  headers: string[] = ['Name', 'Telephone', 'Email', 'Address','Contact Person','Contact Telephone','Description','Credit Limit','Exporter Status','Exporter Type'];
  binders: string[] = ['name', 'telephone', 'email', 'address','contactperson','contacttlp','description','creditlimit','exporterstatus.name','exportertype.name'];

  cscolumns: string[] = ['csname', 'cstelephone', 'csemail', 'csaddress','cscontactperson','cscontacttlp','csdescription','cscreditlimit','csexporterstatus','csexportertype'];
  csprompts: string[] = ['Search by Name', 'Search by Telephone', 'Search by Email', 'Search by Address',
    'Search by Contact Person', 'Search by Contact Telephone','Search by Description','Search by Credit Limit',
    'Search by Exporter Status','Search by Exporter Type'];

  imageurl: string = '';

  data !:MatTableDataSource<Exporter>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist: UiAssist;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  selectedrow:any;
  constructor(
    private fb:FormBuilder,
    private dg:MatDialog,
    private dp:DatePipe,
    private rs:RegexService,
    private es:ExporterService,
    private est:ExporterstatusService,
    private et:ExportertypeService
  ){
    this.uiassist = new UiAssist(this)

    this.form = this.fb.group({
      "name": new FormControl('',Validators.required),
      "telephone": new FormControl('',Validators.required),
      "email": new FormControl('',Validators.required),
      "address": new FormControl('',Validators.required),
      "contactperson": new FormControl('',Validators.required),
      "contacttlp": new FormControl('',Validators.required),
      "description": new FormControl('',Validators.required),
      "creditlimit": new FormControl('',Validators.required),
      "exporterstatus": new FormControl('',Validators.required),
      "exportertype": new FormControl('',Validators.required)
    });

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "cstelephone": new FormControl(),
      "csemail": new FormControl(),
      "csaddress": new FormControl(),
      "cscontactperson": new FormControl(),
      "cscontacttlp": new FormControl(),
      "csdescription": new FormControl(),
      "cscreditlimit": new FormControl(),
      "csexporterstatus": new FormControl(),
      "csexportertype": new FormControl()

    });

    this.ssearch = this.fb.group({
      "ssname": new FormControl(),
      "ssemail": new FormControl(),
      "sscontactperson": new FormControl(),
      "ssexporterstatus": new FormControl(),
      "ssexportertype": new FormControl(),
    })
  }
  async ngOnInit(): Promise<void> {
    this.initialize();

  }

  initialize(){
    this.createView();
    this.est.getAllList().then((est:Exporterstatus[])=> {
      this.exporterstatus = est;
    });
    this.et.getAllList().then((et:Exportertype[])=> {
      this.exportertypes = et;
    });

    this.rs.get("product").then((rxs:RegexService[])=> {
      this.regexes = rxs;
      this.createForm();
    });
  }
  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string):void{

    this.es.getAll(query)
      .then((exps: Exporter[]) => {
        this.exporters = exps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.exporters);
        this.data.paginator = this.paginator;
      });
  }
  filterTable():void{
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (exporter: Exporter, filter: string) =>{

      return(csearchdata.csname==null||exporter.name.toLowerCase().includes(csearchdata.csname)) &&
        (csearchdata.cstelephone==null||exporter.telephone.includes(csearchdata.cstelephone)) &&
        (csearchdata.csemail==null||exporter.email.toString().includes(csearchdata.csemail)) &&
        (csearchdata.csaddress==null||exporter.address.toString().includes(csearchdata.csaddress)) &&
        (csearchdata.cscontactperson==null||exporter.contactperson.toLowerCase().includes(csearchdata.cscontactperson)) &&
        (csearchdata.cscontacttlp==null||exporter.contacttlp.toLowerCase().includes(csearchdata.cscontacttlp)) &&
        (csearchdata.csdescription==null||exporter.description.toLowerCase().includes(csearchdata.csdescription)) &&
        (csearchdata.cscreditlimit==null||exporter.creditlimit.toString().includes(csearchdata.cscreditlimit)) &&
        (csearchdata.csexporterstatus==null||exporter.exporterstatus.name.toString().includes(csearchdata.csexporterstatus)) &&
        (csearchdata.csexportertype==null||exporter.exportertype.name.toLowerCase().includes(csearchdata.csexportertype))
    }
    this.data.filter = 'xx';
  }

  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let name = ssearchdata.ssname;
    let email = ssearchdata.ssemail;
    let contactperson = ssearchdata.sscontactperson;
    let exporterstatus = ssearchdata.ssexporterstatus;
    let exportertype = ssearchdata.ssexportertype;

    let query="";

    if (name!=null && name.trim()!="") query=query+"&name="+name;
    if (email!=null && email.trim()!="") query=query+"&email="+email;
    if (contactperson!=null && contactperson.trim()!="") query=query+"&contactperson="+contactperson;
    if (exporterstatus!=null) query=query+"&exporterstatus="+exporterstatus;
    if (exportertype!=null) query=query+"&exportertype="+exportertype;

    if (query!="") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(): void{
    const confirm = this.dg.open(ConfirmComponent,{
      width: '400px',
      data:{heading:"Clear Search", message: "This will clear current search results. Confirm?"}
    });
    confirm.afterClosed().subscribe(async result =>{
      if (result){
        this.ssearch.reset();
        this.loadTable("");
      }
    });
  }

  createForm() {

    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['telephone'].setValidators([Validators.required]);
    this.form.controls['email'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required]);
    this.form.controls['contactperson'].setValidators([Validators.required]);
    this.form.controls['contacttlp'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['creditlimit'].setValidators([Validators.required]);
    this.form.controls['exporterstatus'].setValidators([Validators.required]);
    this.form.controls['exportertype'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    this.enableButtons(true, false, false);
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }
  getErrors(): string {
    let errors:string="";
    for (const controlName in this.form.controls){
      const control = this.form.controls[controlName];
      if (control.errors){
        if (this.regexes[controlName]!=undefined){
          errors=errors+"<br>"+ this.regexes[controlName]['message'];
        }
        else {
          errors=errors+"<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  add(){
    let errors:string = this.getErrors();
    if (errors!="") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - New Exporter Adding", message: "Error adding following due to <br> " + errors}
      });

      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else{
      this.exporter = this.form.getRawValue();

      let expdata: string = "";
      expdata = expdata + "<br>Name is : "+ this.exporter.name;
      expdata = expdata + "<br>Code is : "+ this.exporter.email;
      expdata = expdata + "<br>Code is : "+ this.exporter.contactperson;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px', data: {heading: "Confirmation - Exporter Add", message: "Are you sure to Add the following Exporter? <br> <br>"+ expdata}
      });

      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.es.add(this.exporter).then((response: [] | undefined) => {
            if (response != undefined) {
              // @ts-ignore
              addstatus = response['errors'] == "";
              if (!addstatus) { // @ts-ignore
                addmessage = response['errors'];
              }
            } else {
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {
            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Exporter Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => {if (!result) { return; }
            });
          });
        }
      });
    }
  }

  fillForm(exporter: Exporter) {

    this.enableButtons(false, true, true);

    this.selectedrow = exporter;

    this.exporter = JSON.parse(JSON.stringify(exporter));
    this.oldexporter = JSON.parse(JSON.stringify(exporter));

    // @ts-ignore
    this.exporter.exporterstatus = this.exporterstatus.find(e => e.id === this.exporter.exporterstatus.id);

    // @ts-ignore
    this.exporter.exportertype = this.exportertypes.find(e => e.id === this.exporter.exporterstatus.id);

    this.form.patchValue(this.exporter);
    this.form.markAsPristine();
  }

  getUpdates(): string{
    let updates: string = "";
    for (const contolName in this.form.controls){
      const control = this.form.controls[contolName];
      if(control.dirty){
        updates = updates + "<br>" + contolName.charAt(0).toUpperCase() + contolName.slice(1)+ "changed";
      }
    }
    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Exporter Update", message: "You have following errors" + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {return;}});
    } else {
      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Exporter Update",
            message: "Are you sure to Save the following Exporter? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()")
            this.exporter = this.form.getRawValue();
            // @ts-ignore
            this.exporter.id=this.oldexporter.id;

            this.es.update(this.exporter).then((response: [] | undefined)=>{
              if (response != undefined){ // @ts-ignore
                // @ts-ignore
                updstatus = response['errors'] == "";
                if (!updstatus){ // @ts-ignore
                  updmessage = response['errors'];
                }
              } else{
                updstatus = false;
                updmessage = "Content not found"
              }
            }).finally(() => {
              if (updstatus){
                updmessage = "Successfully Updated";
                this.form.reset();
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent,{
                width: '500px',
                data: {heading: "Status - Exporter Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result =>{if (!result){return;}})
            });
          }
        });
      } else {
        const updmsg = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {heading: "Confirmation - Exporter Update", message: "No Changes"}
        });
      updmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
      }
    }
  }

  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Exporter Delete",
        message: "Are you sure to Delete following Exporter? <br> <br>" + this.exporter.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.es.delete(this.exporter.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Exporter Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => {
            if (!result) {
              return;
            }
          });

        });
      }
    });
  }

  clear() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: { heading: "Confirmation - Clear Form",
        message: "Are you sure to Clear the form? <br> <br> Any changes will be lost"
      } });
    confirm.afterClosed().subscribe(async result =>{
      if (result){
        this.loadForm();
        // this.oldemployee = undefined;
        // this.form.reset();
        // this.clearImage();
        // Object.values(this.form.controls).forEach(control => {
        //   control.markAsTouched(); });
        // this.enableButtons(true,false,false);
        // this.selectedrow = null;
      }
    })
  }
  loadForm(){
    this.oldexporter = undefined;
    this.form.reset();
    Object.values(this.form.controls).forEach(control => {
      control.markAsPristine(); });
    // this.enableButtons(true,false,false);
    this.selectedrow = null;
  }
}
