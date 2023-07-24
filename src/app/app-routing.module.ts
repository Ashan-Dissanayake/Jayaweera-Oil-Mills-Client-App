import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {ProductComponent} from "./view/modules/product/product.component";
import {OrderComponent} from "./view/modules/order/order.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {ExporterComponent} from "./view/modules/exporter/exporter.component";
import {InvoiceComponent} from "./view/modules/invoice/invoice.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path: "product", component: ProductComponent},
      {path: "order", component: OrderComponent},
      {path: "privilege", component: PrivilageComponent},
      {path: "exporter", component: ExporterComponent},
      {path: "invoice", component: InvoiceComponent},
    ]
  },
  {
    path: "home",
    component: HomeComponent,
    children:[
      {path: "employee", component: EmployeeComponent}
    ]
  }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
