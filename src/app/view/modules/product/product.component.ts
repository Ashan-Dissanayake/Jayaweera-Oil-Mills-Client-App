import {Component, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../../entity/user";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Productservice} from "../../../service/productservice";
import {Productstatus} from "../../../entity/productstatus";
import {Producttypeservice} from "../../../service/producttypeservice";
import {Categoryservice} from "../../../service/categoryservice";
import {Subcategoryservice} from "../../../service/subcategoryservice";
import {Unitservice} from "../../../service/unitservice";
import {Employee} from "../../../entity/employee";
import {Product} from "../../../entity/product";
import {Userstatus} from "../../../entity/userstatus";
import {Role} from "../../../entity/role";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Productstatusservice} from "../../../service/productstatusservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {

  public csearch!: FormGroup;
  public ssearch!: FormGroup;

  products: Array<Product> = [];
  productstatus: Array<Productstatus> = [];

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

  constructor(
    private fb:FormBuilder,
    private ps:Productservice,
    private pst:Productstatusservice,
    private dg:MatDialog,
    // private pt:Producttypeservice,
    // private cs:Categoryservice,
    // private sc:Subcategoryservice,
    // private us:Unitservice,
  ) {

    this.uiassist = new UiAssist(this);

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
      this.productstatus = pst;
    });
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
        (csearchdata.cssubcategory==null||product.subcategory.name.toLowerCase().includes(csearchdata.cssubcategory)) &&
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

}
