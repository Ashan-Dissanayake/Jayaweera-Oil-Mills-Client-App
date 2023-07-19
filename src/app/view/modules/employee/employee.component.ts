import {Component, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/EmployeeService";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Gender} from "../../../entity/gender";
import {Designation} from "../../../entity/designation";
import {DesignationService} from "../../../service/DesignationService";
import {GenderService} from "../../../service/GenderService";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Employeestatus} from "../../../entity/employeestatus";
import {EmployeestatusService} from "../../../service/EmployeeStatusService";
import {RegexService} from "../../../service/RegexService";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {DatePipe} from "@angular/common";


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  columns: string[] = ['nic', 'number', 'callingname', 'fullname', 'gender', 'designation', 'modi'];
  headers: string[] = ['NIC', 'Number', 'Calling Name', 'Full Name', 'Gender', 'Designation', 'Modification'];
  binders: string[] = ['nic', 'number', 'callingname', 'fullname', 'gender.name', 'designation.name', 'getModi()'];

  cscolumns: string[] = ['csnic', 'csnumber', 'cscallingname', 'csfullname', 'csgender', 'csdesignation', 'csmodi'];
  csprompts: string[] = ['Search NIC', 'Search Number', 'Search Callingname', 'Search Fullname', 'Search gender', 'Search Designation', 'Search Modification'];

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  data!: MatTableDataSource<Employee>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png';

  uiassist: UiAssist;
  employee!: Employee;
  oldemployee!: Employee|undefined;

  selectedrow: any;

  enaadd:boolean = false;
  enaupd:boolean = false;
  enadel:boolean = false;

  employees: Array<Employee> = [];
  genders: Array<Gender> = [];
  designations: Array<Designation> = [];
  employeestatuses: Array<Employeestatus> = [];

  regexes: any;

  constructor(
    private es: EmployeeService,
    private ds: DesignationService,
    private gs: GenderService,
    private ss: EmployeestatusService,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csnic": new FormControl(),
      "csnumber": new FormControl(),
      "cscallingname": new FormControl(),
      "csfullname": new FormControl(),
      "csgender": new FormControl(),
      "csdesignation": new FormControl(),
      "csmodi": new FormControl()
    })

    this.ssearch = this.fb.group({
      "ssnic": new FormControl(),
      "ssnumber": new FormControl(),
      "sscallingname": new FormControl(),
      "ssfullname": new FormControl(),
      "ssgender": new FormControl(),
      "ssdesignation": new FormControl(),
    })


    this.form = this.fb.group({
      "number": new FormControl('', [Validators.required]),
      "fullname": new FormControl('', [Validators.required]),
      "callingname": new FormControl('', [Validators.required]),
      "gender": new FormControl('', [Validators.required]),
      "nic": new FormControl('', [Validators.required]),
      "dobirth": new FormControl('', [Validators.required]),
      "photo": new FormControl('', [Validators.required]),
      "address": new FormControl('', [Validators.required]),
      "mobile": new FormControl('', [Validators.required]),
      "land": new FormControl('', ),
      "designation": new FormControl('', [Validators.required]),
      "doassignment": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "employeestatus": new FormControl('', [Validators.required])
    });


  }

  ngOnInit(){
    this.initialize();
  }

  initialize(){
    this.createView();


    this.gs.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
      console.log("G-" + this.genders)
    });
    this.ds.getAllList().then((dess: Designation[]) => {
      this.designations = dess;
      console.log("D-" + this.designations)
    });
    this.ss.getAllList().then((esss: Employeestatus[]) => {
      this.employeestatuses = esss;
      console.log("E-" + this.employeestatuses)
    });
    this.rs.get('employee').then((regs: []) => {
      this.regexes = regs;
      console.log("R-" + this.regexes['number']['regex']);
      this.createForm();
    });

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string) {
    this.es.getAll(query)
      .then((emps: Employee[]) => {
        this.employees = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.employees);
        this.data.paginator = this.paginator
      });
  }

  filterTable():void{
    const csearchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (employee: Employee, filter: string) =>{

      return(csearchdata.csnumber==null||employee.number.toLowerCase().includes(csearchdata.csnumber)) &&
      (csearchdata.csnic==null||employee.nic.toLowerCase().includes(csearchdata.csnic)) &&
      (csearchdata.cscallingname==null||employee.callingname.toLowerCase().includes(csearchdata.cscallingname)) &&
      (csearchdata.csfullname==null||employee.fullname.toLowerCase().includes(csearchdata.csfullname)) &&
      (csearchdata.csgender==null||employee.gender.name.toLowerCase().includes(csearchdata.csgender)) &&
      (csearchdata.csdesignation==null||employee.designation.name.toLowerCase().includes(csearchdata.csdesignation)) &&
      (csearchdata.csmodi==null||this.getModi(employee).toLowerCase().includes(csearchdata.csmodi));
    }
    this.data.filter = 'xx';
  }

  getModi(element: Employee){
    return element.number + '(' + element.callingname + ')';
  }

  btnSearchMc(): void{
    const ssearchdata = this.ssearch.getRawValue();

    let number = ssearchdata.ssnumber;
    let callingname = ssearchdata.sscallingname;
    let nic = ssearchdata.ssnic;
    let fullname = ssearchdata.ssfullname;
    let genderid = ssearchdata.ssgender;
    let designationid = ssearchdata.ssdesignation;

    let query="";

    if (number!=null && number.trim()!="") query=query+"&number="+number;
    if (callingname!=null && callingname.trim()!="") query=query+"&callingname="+callingname;
    if (nic!=null && nic.trim()!="") query=query+"&nic="+nic;
    if (fullname!=null && fullname.trim()!="") query=query+"&fullname="+fullname;
    if (genderid!=null) query=query+"&genderid="+genderid;
    if (designationid!=null) query=query+"&designationid="+designationid;

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
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage():void{
    this.imageempurl = 'assets/default.png';
    this.form.controls['photo'].setErrors({'required':true});
  }

  add(){
    let errors:string = this.getErrors();
    if (errors!=""){
      const errmsg = this.dg.open(MessageComponent,{
        width: '500px',
        data:{heading:"Errors - New Employee Adding", message: "Error adding following due to <br> " + errors}
      });

      errmsg.afterClosed().subscribe(async result =>{if (!result){return;}});
    }
    else{
      this.employee = this.form.getRawValue();
      //console.log("Photo-Before"+this.employee.photo);
      this.employee.photo=btoa(this.imageempurl);
      //console.log("Photo-After"+this.employee.photo);

      let empdata: string = "";
      empdata = empdata + "<br>Number is : "+ this.employee.number;
      empdata = empdata + "<br>Full Name is : "+ this.employee.fullname;
      empdata = empdata + "<br>Calling Name is : "+ this.employee.callingname;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px', data: {heading: "Confirmation - Employee Add", message: "Are you sure to Add the following Employee? <br> <br>"+ empdata}
      });

      let addstatus:boolean=false;
      let addmessage:string="Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          //{ console.log("EmployeeService.add(emp)");
          this.es.add(this.employee).then((response: [] | undefined) => {
            console.log("Res-" + response);
            console.log("Un-" + response == undefined);
            if (response != undefined) {
              // @ts-ignore
              console.log("Add-" + response['id'] + "-" + response['url'] + "-" + (response['errors'] == ""));
              // @ts-ignore
              addstatus = response['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = response['errors'];
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
              this.clearImage();
            }
            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Employee Add", message: addmessage}
            });
            stsmsg.afterClosed().subscribe(async result => {if (!result) { return; }
            });
          });
        }
      });
    }
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

createForm(){

    this.form.controls['number'].setValidators([Validators.required,Validators.pattern(this.regexes['number']['regex'])]);
    this.form.controls['fullname'].setValidators([Validators.required,Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['callingname'].setValidators([Validators.required,Validators.pattern(this.regexes['callingname']['regex'])]);
    this.form.controls['gender'].setValidators([Validators.required]);
    this.form.controls['nic'].setValidators([Validators.required,Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['dobirth'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['address'].setValidators([Validators.required,Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['mobile'].setValidators([Validators.required,Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['land'].setValidators([Validators.required,Validators.pattern(this.regexes['land']['regex'])]);
    this.form.controls['designation'].setValidators([Validators.required]);
    this.form.controls['doassignment'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.required,Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['employeestatus'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control=>{control.markAsTouched();});

  for (const controlName in this.form.controls) {
    const control = this.form.controls[controlName];
    control.valueChanges.subscribe(value => {
      // @ts-ignore
      if(controlName=="dobirth" || controlName=="doassignment")
        value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
      if (this.oldemployee != undefined && control.valid) {
        // @ts-ignore
        if (value === this.employee[controlName]){
          control.markAsPristine();
        } else {
          control.markAsDirty(); }
      } else{
        control.markAsPristine(); }
    });
  }
}

  fillForm(employee: Employee){
    console.log(employee.callingname);

    this.enableButtons(false,true,true);
    this.loadForm();

    this.selectedrow=employee;

    this.employee = JSON.parse(JSON.stringify(employee));
    this.oldemployee = JSON.parse(JSON.stringify(employee));

    if (this.employee.photo!= null){
      this.imageempurl = atob(this.employee.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.employee.photo = "";

    // @ts-ignore
    this.employee.gender = this.genders.find(g => g.id === this.employee.gender.id);

    // @ts-ignore
    this.employee.designation = this.designations.find(d => d.id === this.employee.designation.id);

    // @ts-ignore
    this.employee.employeestatus = this.employeestatuses.find(s => s.id === this.employee.employeestatus.id);

    this.form.patchValue(this.employee);
    this.form.markAsPristine();
}
  update() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Employee Update", message: "You have following errors" + errors}
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
            heading: "Confirmation - Employee Update",
            message: "Are you sure to Save the following Employee? <br> <br>" + updates
          }
        });

        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()")
            this.employee = this.form.getRawValue();
            if (this.form.controls['photo'].dirty) this.employee.photo = btoa(this.imageempurl);
            else
            { // @ts-ignore
              this.employee.photo=this.oldemployee.photo;
            }
            // @ts-ignore
            this.employee.id=this.oldemployee.id;

            this.es.update(this.employee).then((response: [] | undefined)=>{
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
             // console.log("Updated")
            }).finally(() => {
              if (updstatus){
                updmessage = "Successfully Updated";
                // this.oldemployee = undefined;
                // this.form.reset();
                // this.clearImage();
                // Object.values(this.form.controls).forEach(control => {control.markAsTouched();});
                // this.enableButtons(true,false,false);
                this.loadForm();
                this.loadTable("");
              }
              const stsmsg = this.dg.open(MessageComponent,{
                width: '500px',
                data: {heading: "Status - Empoyee Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result =>{if (!result){return;}})
            });
          }
        });
      } else {
        const updmsg = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "No Changes"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });
      }
    }
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

  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '500px',
      data: { heading: "Confirmation - Employee Delete", message: "Are you sure to Delete folowing Employee? <br> <br>" + this.employee.callingname
      } });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.es.delete(this.employee.id).then((response: [] | undefined) => {
          if (response != undefined) {
            // @ts-ignore
            delstatus = response['errors'] == "";
            if (!delstatus) {
              // @ts-ignore
              delmessage = response['errors']; }
          }
          else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            // this.oldemployee = undefined;
            // this.form.reset();
            // this.clearImage();
            // Object.values(this.form.controls).forEach(control => {
            //   control.markAsTouched(); });
            // this.enableButtons(true,false,false);
            this.loadForm();
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Employee Delete ", message: delmessage} });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; }
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
    this.oldemployee = undefined;
    this.form.reset();
    this.clearImage();
    Object.values(this.form.controls).forEach(control => {
      control.markAsPristine(); });
    // this.enableButtons(true,false,false);
    this.selectedrow = null;
  }



}
