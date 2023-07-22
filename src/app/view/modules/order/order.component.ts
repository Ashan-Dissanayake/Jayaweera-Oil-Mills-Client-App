import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Order} from "../../../entity/order";
import {Orderservice} from "../../../service/orderservice";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Exporter} from "../../../entity/exporter";
import {Exporterservice} from "../../../service/exporterservice";
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/EmployeeService";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Product} from "../../../entity/product";
import {Productservice} from "../../../service/productservice";
import {Orderproduct} from "../../../entity/orderproduct";
import {Orderstatusservice} from "../../../service/orderstatusservice";
import {Orderstatus} from "../../../entity/orderstatus";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['exporter','employee','doplaced', 'doexpected', 'expectedgrandtotal','description','orderstatus'];
  headers: string[] = ['Exporter','Employee', 'Do Placed', 'Do Expected', 'Expected Grand Total','Description','Invoice Status'];
  binders: string[] = ['exporter.name','employee.callingname','doplaced', 'doexpected', 'expectedgrandtotal','description','orderstatus.name'];

  cscolumns: string[] = ['csexporter','csemployee','csdoplaced', 'csdoexpected', 'csexpectedgrandtotal','csdescription','csorderstatus'];
  csprompts: string[] = ['Search by Exporter','Search by Employee', 'Search by Do Placed', 'Search by Do Expected',
    'Search by Expected Grand Total','Search by Description','Search by Status'];

  incolumns: string[] = ['name', 'quatity', 'unitprice', 'linetotal', 'remove'];
  inheaders: string[] = ['Name', 'Quantity', 'Unit Price', 'Expected Line Total', 'Remove'];
  inbinders: string[] = ['product.name', 'qty', 'product.price', 'expectedlinetotal', 'getBtn()'];

  orders: Array<Order> = [];
  data!: MatTableDataSource<Order>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Orderproduct>

  exporters:Array<Exporter> = [];
  employees:Array<Employee> = [];
  producs:Array<Product> = [];
  orderproducts:Array<Orderproduct> = [];
  orderstatuses:Array<Orderstatus> = [];

  grandtotal = 0;

  imageurl: string = '';

  uiassist: UiAssist;

  order!:Order;
  oldorder!:Order;

  innerdata:any;
  oldinnerdata:any;

  selectedrow:any;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  constructor(
    private os:Orderservice,
    private ost:Orderstatusservice,
    private fb:FormBuilder,
    private ex:Exporterservice,
    private es:EmployeeService,
    private ps:Productservice,
    private dp:DatePipe,
    private dg:MatDialog
  ) {
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csexporter": new FormControl(),
      "csemployee": new FormControl(),
      "csdoplaced": new FormControl(),
      "csdoexpected": new FormControl(),
      "csexpectedgrandtotal": new FormControl(),
      "csdescription": new FormControl(),
      "csorderstatus": new FormControl()
    });

    this.ssearch = this.fb.group({
      "ssexporter":new FormControl(),
      "ssemployee":new FormControl(),
      "ssdoplaced":new FormControl()
    });

    this.form = this.fb.group({
      "exporter":new FormControl('',Validators.required),
      "employee":new FormControl('',Validators.required),
      "doplaced":new FormControl('',Validators.required),
      "doexpected":new FormControl('',Validators.required),
      "expectedgrandtotal":new FormControl('',Validators.required),
      "description":new FormControl('',Validators.required),
      "orderstatus":new FormControl('',Validators.required)
    });

    this.innerform = this.fb.group({
      "product":new FormControl(),
      "qty": new FormControl(),
      "expectedlinetotal":new FormControl()
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();

    this.ex.getAllList().then((exps:Exporter[])=>this.exporters = exps);
    this.es.getAllListNameId().then((emps:Employee[])=> this.employees = emps);
    this.ps.getAllListNameId().then((pds:Product[])=> this.producs = pds);
    this.ost.getAllList().then((ost:Orderstatus[])=> this.orderstatuses = ost);

    this.createForm();
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.os.getAll(query)
      .then((ords: Order[]) => {
        this.orders = ords;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.orders);
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (order: Order, filter: string) => {
      return(cserchdata.csexporter == null || order.exporter.name.toLowerCase().includes(cserchdata.csexporter)) &&
        (cserchdata.csemployee == null || order.employee.callingname.toLowerCase().includes(cserchdata.csemployee)) &&
        (cserchdata.csdoplaced == null || order.doplaced.includes(cserchdata.csdoplaced)) &&
        (cserchdata.csdoexpected == null || order.doexpected.includes(cserchdata.csdoexpected)) &&
        (cserchdata.csexpectedgrandtotal == null || order.expectedgrandtotal.toString().includes(cserchdata.csexpectedgrandtotal)) &&
        (cserchdata.csdescription == null || order.description.toLowerCase().includes(cserchdata.csdescription)) &&
        (cserchdata.csorderstatus == null || order.orderstatus.name.toLowerCase().includes(cserchdata.csorderstatus));        ;
    };

    this.data.filter = 'xx';

  }

  btnSearchMc() {

    const ssearchdata = this.ssearch.getRawValue();

    let exporterid = ssearchdata.ssexporter;
    let employeeid = ssearchdata.ssemployee;
    let doplaced = this.dp.transform(ssearchdata.ssdoplaced,'yyyy-MM-dd');

    let query = "";

    if (exporterid != null) query = query + "&exporterid=" + exporterid;
    if (employeeid != null) query = query + "&employeeid=" + employeeid;
    if (doplaced != null && doplaced.trim() != "") query = query + "&doplaced=" + doplaced;


    if (query != "") query = query.replace(/^./,"?")
    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  getBtn(element:Order){
    return `<button mat-raised-button>Remove</button>`;
  }


  id = 0;

  btnaddMc() {

    this.innerdata = this.innerform.getRawValue();


    if( this.innerdata != null){

      let invoiceitem = new  Orderproduct(this.id,this.innerdata.product,this.innerdata.qty,this.innerdata.expectedlinetotal);

      let tem: Orderproduct[] = [];
      if(this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.orderproducts = [];
      tem.forEach((t)=> this.orderproducts.push(t));

      this.orderproducts.push(invoiceitem);
      this.indata = new MatTableDataSource(this.orderproducts);

      this.id++;

      this.calculateGrandTotal();
      this.innerform.reset();

    }

  }

  calculateGrandTotal(){

    this.grandtotal = 0;

    this.indata.data.forEach((e)=>{
      this.grandtotal = this.grandtotal+e.expectedlinetotal
    })

    this.form.controls['expectedgrandtotal'].setValue(this.grandtotal);
  }

  deleteRaw(x:any) {

    // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

    let datasources = this.indata.data

    const index = datasources.findIndex(item => item.id === x.id);
    if (index > -1) {
      datasources.splice(index, 1);
    }
    this.indata.data = datasources;
    this.orderproducts = this.indata.data;

    this.calculateGrandTotal();
  }


  createForm() {

    this.form.controls['exporter'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['doplaced'].setValidators([Validators.required]);
    this.form.controls['doexpected'].setValidators([Validators.required]);
    this.form.controls['expectedgrandtotal'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['orderstatus'].setValidators([Validators.required]);

    this.innerform.controls['product'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);
    this.innerform.controls['expectedlinetotal'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doplaced" || controlName =="doexpected")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.order[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }


    for (const controlName in this.innerform.controls) {
      const control = this.innerform.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldinnerdata != undefined && control.valid) {
            // @ts-ignore
            if (value === this.innerdata[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }

    this.enableButtons(true,false,false);

  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
  }


  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors) errors = errors + "<br>Invalid " + controlName;
    }

    return errors;
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Order Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.order = this.form.getRawValue();
      this.order.orderproducts = this.orderproducts;

      // @ts-ignore
      this.orderproducts.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.order.doplaced = this.dp.transform(this.order.doplaced,"yyy-mm-dd");

      // @ts-ignore
      this.order.doexpected = this.dp.transform(this.order.doexpected,"yyy-mm-dd");

      let invdata: string = "";

      invdata = invdata + "<br>Ordered Day is : " + this.order.doplaced
      invdata = invdata + "<br>Export by : " + this.order.exporter.name;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Order Add",
          message: "Are you sure to Add the following Order? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");
          this.os.add(this.order).then((responce: [] | undefined) => {
            //console.log("Res-" + responce);
            //console.log("Un-" + responce == undefined);
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.innerform.reset();
              this.indata.data=[];
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Invoice Add", message: addmessage}
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
  }


  fillForm(order: Order) {

    this.enableButtons(false,true,true);

    this.selectedrow=order;

    this.order = JSON.parse(JSON.stringify(order));
    this.oldorder = JSON.parse(JSON.stringify(order));

    //@ts-ignore
    this.order.exporter = this.exporters.find(e => e.id === this.order.exporter.id);

    //@ts-ignore
    this.order.employee = this.employees.find(e => e.id === this.order.employee.id);

    //@ts-ignore
    this.order.orderstatus = this.orderstatuses.find(s => s.id === this.order.orderstatus.id);

    this.indata = new MatTableDataSource(this.order.orderproducts);

    this.form.patchValue(this.order);
    this.form.markAsPristine();

    for (const controlName in this.innerform.controls) {
      this.innerform.controls[controlName].clearValidators();
      this.innerform.controls[controlName].updateValueAndValidity();
    }

  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;

  }


  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Order Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Order Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.order = this.form.getRawValue();

            this.order.orderproducts = this.orderproducts;

            // @ts-ignore
            this.orderproducts.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.order.doplaced = this.dp.transform(this.order.doplaced,"yyy-mm-dd");

            // @ts-ignore
            this.order.doexpected = this.dp.transform(this.order.doexpected,"yyy-mm-dd");

            this.order.id = this.oldorder.id;

            this.os.update(this.order).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.innerform.reset();
                this.innerdata=[];
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Order Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Order Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }


  }


  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Order Delete",
        message: "Are you sure to Delete following Order? <br> <br>" + this.order.exporter.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.os.delete(this.order.id).then((responce: [] | undefined) => {

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
            this.innerform.reset();
            this.innerdata = [];
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Order Delete ", message: delmessage}
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

}
