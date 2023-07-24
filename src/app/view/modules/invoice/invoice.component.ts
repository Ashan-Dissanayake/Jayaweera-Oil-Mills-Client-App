import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {Order} from "../../../entity/order";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Invoice} from "../../../entity/invoice";
import {Employee} from "../../../entity/employee";
import {Invoiceorderproduct} from "../../../entity/invoiceorderproduct";
import {Invoicestatus} from "../../../entity/invoicestatus";
import {Orderservice} from "../../../service/orderservice";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {Invoiceservice} from "../../../service/invoiceservice";
import {Invoicestatusservice} from "../../../service/invoicestatusservice";
import {Product} from "../../../entity/product";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Productservice} from "../../../service/productservice";
import {EmployeeService} from "../../../service/EmployeeService";

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  public innerform!: FormGroup;

  columns: string[] = ['name', 'grandtotal', 'date', 'employee', 'invoicestatus'];
  headers: string[] = ['Name', 'Grand Total', 'Date', 'Employee', 'Invoice Status'];
  binders: string[] = ['name', 'grandtotal', 'date', 'employee.callingname', 'invoicestatus.name'];

  cscolumns: string[] = ['csname', 'csgrandtotal', 'csdate', 'csemployee', 'csinvoicestatus'];
  csprompts: string[] = ['Search by Name', 'Search by Grand Total', 'Search By Date', 'Search By Employee', 'Search by Invoice Status'];

  incolumns: string[] = ['name', 'quatity', 'linetotal', 'remove'];
  inheaders: string[] = ['Name', 'Quantity', 'Line Total', 'Remove'];
  inbinders: string[] = ['product.name', 'qty', 'linetotal', 'getBtn()'];

  data!: MatTableDataSource<Invoice>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  indata!:MatTableDataSource<Invoiceorderproduct>

  invoices: Array<Invoice> = [];
  invoicestasuses: Array<Invoicestatus> = [];
  employees: Array<Employee> = [];
  orders: Array<Order> = [];
  invoiceorderproducts: Array<Invoiceorderproduct> = [];
  products: Array<Product> = [];

  grandtotal = 0;

  imageurl: string = '';

  uiassist: UiAssist;

  invoice!: Invoice;
  oldinvoice!: Invoice;

  innerdata:any;
  oldinnerdata:any;

  selectedrow: any;

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  constructor(
    private is: Invoiceservice,
    private ist: Invoicestatusservice,
    private fb: FormBuilder,
    private os: Orderservice,
    private es: EmployeeService,
    private ps: Productservice,
    private dp: DatePipe,
    private dg: MatDialog
  ) {
    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "csgrandtotal": new FormControl(),
      "csdate": new FormControl(),
      "csemployee": new FormControl(),
      "csinvoicestatus": new FormControl()
    });

    this.ssearch = this.fb.group({
      "ssname":new FormControl(),
      "ssinvoicestatus":new FormControl(),
      "ssdate":new FormControl()

    });

    this.form = this.fb.group({
      "name":new FormControl('',Validators.required),
      "grandtotal":new FormControl('',Validators.required),
      "date":new FormControl('',Validators.required),
      "employee":new FormControl('',Validators.required),
      "order":new FormControl('',Validators.required),
      "invoicestatus":new FormControl('',Validators.required)
    });

    this.innerform = this.fb.group({
      "orderproduct":new FormControl(),
      "qty": new FormControl(),
      "linetotal":new FormControl()
    });
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();

    this.ist.getAllList().then((invs:Invoicestatus[])=>this.invoicestasuses = invs);
    this.es.getAllListNameId().then((emps:Employee[])=>this.employees = emps);
    this.os.getAllListNameId().then((ords:Order[])=>this.orders = ords);
    this.ps.getAllListNameId().then((pds:Product[])=> this.products = pds);
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {

    this.is.getAll(query)
      .then((invs: Invoice[]) => {
        this.invoices = invs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.invoices);
        this.data.paginator = this.paginator;
      });

  }
  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (invoice: Invoice, filter: string) => {
      return(cserchdata.csname == null || invoice.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.csgrandtotal == null || invoice.grandtotal.toString().includes(cserchdata.csgrandtotal)) &&
        (cserchdata.csdate == null || invoice.date.includes(cserchdata.csdate)) &&
        (cserchdata.csemployee == null || invoice.employee.callingname.includes(cserchdata.csemployee)) &&
        (cserchdata.csinvoicestatus == null || invoice.invoicestatus.name.toLowerCase().includes(cserchdata.csinvoicestatus));        ;
    };

    this.data.filter = 'xx';

  }

  btnSearchMc() {

    const ssearchdata = this.ssearch.getRawValue();

    let invoicestatusid = ssearchdata.ssinvoicestatus;
    let name = ssearchdata.ssname;
    let date = this.dp.transform(ssearchdata.ssdate,'yyyy-MM-dd');

    let query = "";

    if (invoicestatusid != null) query = query + "&invoicestatusid=" + invoicestatusid;
    if (name != null) query = query + "&name=" + name;
    if (date != null && date.trim() != "") query = query + "&date=" + date;

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


    if (this.innerdata != null) {

      let invoiceitem = new Invoiceorderproduct(this.id, this.innerdata.orderproduct, this.innerdata.qty, this.innerdata.linetotal);

      let tem: Invoiceorderproduct[] = [];
      if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      this.invoiceorderproducts = [];
      tem.forEach((t) => this.invoiceorderproducts.push(t));

      this.invoiceorderproducts.push(invoiceitem);
      this.indata = new MatTableDataSource(this.invoiceorderproducts);

      this.id++;

      this.calculateFinalTotal();
      this.innerform.reset();

    }
  }
    calculateFinalTotal(){

      this.grandtotal = 0;

      this.indata.data.forEach((e)=>{
        this.grandtotal = this.grandtotal+e.linetotal
      })

      this.form.controls['grandtotal'].setValue(this.grandtotal);
    }

    deleteRaw(x:any) {

      // this.indata.data = this.indata.data.reduce((element) => element.id !== x.id);

      let datasources = this.indata.data

      const index = datasources.findIndex(item => item.id === x.id);
      if (index > -1) {
        datasources.splice(index, 1);
      }
      this.indata.data = datasources;
      this.invoiceorderproducts = this.indata.data;

      this.calculateFinalTotal();
    }

  createForm() {

    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['grandtotal'].setValidators([Validators.required]);
    this.form.controls['date'].setValidators([Validators.required]);
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['order'].setValidators([Validators.required]);
    this.form.controls['invoicestatus'].setValidators([Validators.required]);

    this.innerform.controls['orderproduct'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required]);
    this.innerform.controls['linetotal'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );
    Object.values(this.innerform.controls).forEach( control => { control.markAsTouched(); } );


    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldinvoice != undefined && control.valid) {
            // @ts-ignore
            if (value === this.invoice[controlName]) {
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
        data: {heading: "Errors - Invoice Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.invoice = this.form.getRawValue();
      this.invoice.invoiceorderproduct = this.invoiceorderproducts;

      // @ts-ignore
      this.invoiceorderproducts.forEach((i)=> delete  i.id);

      // @ts-ignore
      this.invoice.date = this.dp.transform(this.invoice.date,"yyy-mm-dd");


      let invdata: string = "";

      invdata = invdata + "<br>Invoice Day is : " + this.invoice.date
      invdata = invdata + "<br>Added by : " + this.invoice.employee.callingname;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Invoice Add",
          message: "Are you sure to Add the following Invoice? <br> <br>" + invdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          // console.log("EmployeeService.add(emp)");
          this.is.add(this.invoice).then((responce: [] | undefined) => {
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

  fillForm(invoice: Invoice) {

    this.enableButtons(false,true,true);

    this.selectedrow=invoice;

    this.invoice = JSON.parse(JSON.stringify(invoice));
    this.oldinvoice = JSON.parse(JSON.stringify(invoice));

    //@ts-ignore
    this.invoice.order = this.orders.find(o => o.id === this.invoice.order.id);

    //@ts-ignore
    this.invoice.employee = this.employees.find(e => e.id === this.invoice.employee.id);

    //@ts-ignore
    this.invoice.invoicestatus = this.invoicestasuses.find(i => i.id === this.invoice.invoicestatus.id);

    this.indata = new MatTableDataSource(this.invoice.invoiceorderproduct);

    this.form.patchValue(this.invoice);
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
        data: {heading: "Errors - Invoice Update ", message: "You have following Errors <br> " + errors}
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

            this.invoice = this.form.getRawValue();

            this.invoice.invoiceorderproduct = this.invoiceorderproducts;

            // @ts-ignore
            this.invoiceorderproducts.forEach((i)=> delete  i.id);

            // @ts-ignore
            this.invoice.date = this.dp.transform(this.invoice.date,"yyy-mm-dd");


            this.invoice.id = this.oldinvoice.id;

            this.is.update(this.invoice).then((responce: [] | undefined) => {
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
                data: {heading: "Status - Invoice Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Invoice Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }

  delete() : void {

    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Invoice Delete",
        message: "Are you sure to Delete following Invoice? <br> <br>" + this.invoice.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.is.delete(this.invoice.id).then((responce: [] | undefined) => {

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
            data: {heading: "Status - Invoice Delete ", message: delmessage}
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
