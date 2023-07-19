import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Productservice} from "../../../service/productservice";
import {Productstatus} from "../../../entity/productstatus";
import {Producttypeservice} from "../../../service/producttypeservice";
import {Categoryservice} from "../../../service/categoryservice";
import {Subcategoryservice} from "../../../service/subcategoryservice";
import {Unitservice} from "../../../service/unitservice";
import {Product} from "../../../entity/product";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Productstatusservice} from "../../../service/productstatusservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {Producttype} from "../../../entity/producttype";
import {Category} from "../../../entity/category";
import {Subcategory} from "../../../entity/subcategory";
import {Unit} from "../../../entity/unit";
import {DatePipe} from "@angular/common";
import {RegexService} from "../../../service/RegexService";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Employee} from "../../../entity/employee";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  public form!:FormGroup;
  public csearch!: FormGroup;
  public ssearch!: FormGroup;

  product!:Product;
  oldproduct!:Product;

  products: Array<Product> = [];
  productstatuses: Array<Productstatus> = [];
  producttypes: Array<Producttype> = [];
  categories: Array<Category> = [];
  subcategories: Array<Subcategory> = [];
  units: Array<Unit> = [];

  imageempurl: string = 'assets/default.png';

  regexes!:any;

  columns: string[] = ['name', 'code', 'price', 'expireduration','description','productstatus','unit','stock','rpp','dointroduction'];
  headers: string[] =  ['Name', 'Code', 'Price', 'Expire Duration','Description','Product Status','Unit','Stock','RPP','Do Introduction'];
  binders: string[] = ['name', 'code', 'price', 'expireduration','description','productstatus.name','unit.name','stock','rpp','dointroduction'];

  cscolumns: string[] = ['csname', 'cscode', 'csprice', 'csexpireduration','csdescription','csproductstatus','csunit','csstock','csrpp','csdointroduction'];
  csprompts: string[] = ['Search by Name', 'Search by Code', 'Search by Price', 'Search by Expire Duration',
    'Search by Description', 'Search by Product Status','Search by Unit','Search by Stock',
    'Search by RPP','Search by Do Introduction'];

  imageurl: string = '';

  data !:MatTableDataSource<Product>;
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
    private ps:Productservice,
    private pst:Productstatusservice,
    private pt:Producttypeservice,
    private cs:Categoryservice,
    private sc:Subcategoryservice,
    private us:Unitservice,
    private rs:RegexService
  ) {

    this.uiassist = new UiAssist(this);

    this.form = this.fb.group({
      "category":new  FormControl('',Validators.required),
      "subcategory":new  FormControl('',Validators.required),
      "name":new  FormControl('',Validators.required),
      "code":new  FormControl('',Validators.required),
      "price":new  FormControl('',Validators.required),
      "expireduration":new  FormControl('',Validators.required),
      "description":new  FormControl('',Validators.required),
      "image":new  FormControl('',Validators.required),
      "producttype":new  FormControl('',Validators.required),
      "productstatus":new  FormControl('',Validators.required),
      "unit":new  FormControl('',Validators.required),
      "stock":new  FormControl('',Validators.required),
      "rpp":new  FormControl('',Validators.required),
      "dointroduction":new  FormControl('',Validators.required)
    })

    this.csearch = this.fb.group({
      "csname": new FormControl(),
      "cscode": new FormControl(),
      "csprice": new FormControl(),
      "csexpireduration": new FormControl(),
      "csdescription": new FormControl(),
      "csproductstatus": new FormControl(),
      "csunit": new FormControl(),
      "cssubcategory": new FormControl(),
      "csstock": new FormControl(),
      "csrpp": new FormControl(),
      "csdointroduction": new FormControl(),

    });

    this.ssearch = this.fb.group({
      "ssname": new FormControl(),
      "sscode": new FormControl(),
      "ssstatus": new FormControl(),
    })

  }

  async ngOnInit(): Promise<void> {
    this.initialize();
  }

  initialize(){
    this.createView();

    this.pst.getAllList().then((pst:Productstatus[])=> {
      this.productstatuses = pst;
    });

    this.pt.getAllList().then((pts:Producttype[])=>{
      this.producttypes = pts;
    });

    this.cs.getAllList().then((cts:Category[])=>{
      this.categories = cts;
    });

    this.sc.getAllList().then((scs:Subcategory[])=>{
      this.subcategories = scs;
    });

    this.us.getAllList().then((uts:Unit[])=>{
      this.units= uts;
    });

    this.rs.get("product").then((rxs:any[])=>{
      this.regexes = rxs;
      this.createForm();
    })

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query:string):void{

    this.ps.getAll(query)
      .then((prds: Product[]) => {
        this.products = prds;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.products);
        this.data.paginator = this.paginator;
      });
  }



  filterTable():void{
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (product: Product, filter: string) =>{

      return(csearchdata.csname==null||product.name.toLowerCase().includes(csearchdata.csname)) &&
        (csearchdata.cscode==null||product.code.includes(csearchdata.cscode)) &&
        (csearchdata.csprice==null||product.price.toString().includes(csearchdata.csprice)) &&
        (csearchdata.csexpireduration==null||product.expireduration.toString().includes(csearchdata.csexpireduration)) &&
        (csearchdata.csdesignation==null||product.description.toLowerCase().includes(csearchdata.csdescription)) &&
        (csearchdata.csproductstatus==null||product.productstatus.name.toLowerCase().includes(csearchdata.csproductstatus)) &&
        (csearchdata.csunit==null||product.unit.name.toLowerCase().includes(csearchdata.csunit)) &&
        (csearchdata.csstock==null||product.stock.toString().includes(csearchdata.csstock)) &&
        (csearchdata.csrpp==null||product.rpp.toString().includes(csearchdata.csrpp)) &&
        (csearchdata.csdointroduction==null||product.dointroduction.toLowerCase().includes(csearchdata.dointroduction))
    }
    this.data.filter = 'xx';
  }


  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let name = ssearchdata.ssname;
    let code = ssearchdata.sscode;
    let statusid = ssearchdata.ssstatus;

    let query="";

    if (name!=null && name.trim()!="") query=query+"&name="+name;
    if (code!=null && code.trim()!="") query=query+"&code="+code;
    if (statusid!=null) query=query+"&statusid="+statusid;

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

  selectImage(e:any):void{
    if (e.target.files){
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(event:any)=> {
        this.imageempurl = event.target.result;
        this.form.controls['image'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imageempurl = 'assets/default.png';
    this.form.controls['image'].setErrors({'required':true});
  }

  createForm(){

    this.form.controls['category'].setValidators([Validators.required]);
    this.form.controls['subcategory'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['price'].setValidators([Validators.required]);
    this.form.controls['expireduration'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required]);
    this.form.controls['image'].setValidators([Validators.required]);
    this.form.controls['producttype'].setValidators([Validators.required]);
    this.form.controls['productstatus'].setValidators([Validators.required]);
    this.form.controls['unit'].setValidators([Validators.required]);
    this.form.controls['stock'].setValidators([Validators.required]);
    this.form.controls['rpp'].setValidators([Validators.required]);
    this.form.controls['dointroduction'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
        // @ts-ignore
        if(controlName=="dointroduction")
          value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
        if (this.oldproduct != undefined && control.valid) {
          // @ts-ignore
          if (value === this.product[controlName]){
            control.markAsPristine();
          } else {
            control.markAsDirty(); }
        } else{
          control.markAsPristine(); }
      });
    }

    this.enableButtons(true,false,false);

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
    if (errors!=""){
      const errmsg = this.dg.open(MessageComponent,{
        width: '500px',
        data:{heading:"Errors - New Product Adding", message: "Error adding following due to <br> " + errors}
      });

      errmsg.afterClosed().subscribe(async result =>{if (!result){return;}});
    }
    else{
      this.product = this.form.getRawValue();
      this.product.image=btoa(this.imageempurl);
      //@ts-ignore
      delete  this.product.category;
      //@ts-ignore
      this.product.dointroduction = this.dp.transform(this.product.dointroduction,"yyy-MM-dd");

      let prddata: string = "";
      prddata = prddata + "<br>Name is : "+ this.product.name;
      prddata = prddata + "<br>Code is : "+ this.product.code;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px', data: {heading: "Confirmation - Product Add", message: "Are you sure to Add the following Product? <br> <br>"+ prddata}
      });

      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.ps.add(this.product).then((response: [] | undefined) => {
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
              this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Product Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => {if (!result) { return; }
            });
          });
        }
      });
    }
  }


  fillForm(product: Product){

    this.enableButtons(false,true,true);

    this.selectedrow=product;

    this.product = JSON.parse(JSON.stringify(product));
    this.oldproduct = JSON.parse(JSON.stringify(product));

    if (this.product.image!= null){
      this.imageempurl = atob(this.product.image);
      this.form.controls['image'].clearValidators();
    } else {
      this.clearImage();
    }
    this.product.image = "";


    // @ts-ignore
    this.product.subcategory = this.subcategories.find(s => s.id === this.product.subcategory.id);

    // @ts-ignore
    this.product.category = this.categories.find(s => s.id === this.product.subcategory.category.id);

    // @ts-ignore
    this.product.unit = this.units.find(u => u.id === this.product.unit.id);

    // @ts-ignore
    this.product.producttype = this.producttypes.find(p => p.id === this.product.producttype.id);

    // @ts-ignore
    this.product.productstatus = this.productstatuses.find(p => p.id === this.product.productstatus.id);

    this.form.patchValue(this.product);
    this.form.markAsPristine();
  }

  enableButtons(add:boolean, upd:boolean, del:boolean){
    this.enaadd=add;
    this.enaupd=upd;
    this.enadel=del;
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
        data: {heading: "Errors - Product Update", message: "You have following errors" + errors}
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
            heading: "Confirmation - Product Update",
            message: "Are you sure to Save the following Product? <br> <br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()")
            this.product = this.form.getRawValue();

            // @ts-ignore
            delete this.product.category

            if (this.form.controls['image'].dirty) this.product.image = btoa(this.imageempurl);
            else
            { // @ts-ignore
              this.product.image=this.oldproduct.image;
            }
            // @ts-ignore
            this.product.id=this.oldproduct.id;

            this.ps.update(this.product).then((response: [] | undefined)=>{
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
                this.clearImage();
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent,{
                width: '500px',
                data: {heading: "Status - Product Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result =>{if (!result){return;}})
            });
          }
        });
      } else {
        const updmsg = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {heading: "Confirmation - Product Update", message: "No Changes"}
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
        heading: "Confirmation - Product Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.product.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.ps.delete(this.product.id).then((responce: [] | undefined) => {

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
            this.clearImage();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Product Delete ", message: delmessage}
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
