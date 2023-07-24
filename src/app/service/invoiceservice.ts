import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../entity/order";
import {Invoice} from "../entity/invoice";

@Injectable({
  providedIn: 'root'
})
export class Invoiceservice{

  constructor(private http: HttpClient) {
  }
  async getAll(query:string): Promise<Array<Invoice>> {
    const invoices = await this.http.get<Array<Invoice>>('http://localhost:8080/invoices'+query).toPromise();
    if(invoices == undefined){
      return [];
    }
    return invoices;
  }

  async add(invoice: Invoice): Promise<[]|undefined>{
    console.log("Invoice Adding-"+JSON.stringify(invoice))
    return this.http.post<[]>('http://localhost:8080/invoices/',invoice).toPromise();
  }

  async update(invoice: Invoice): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/invoices', invoice).toPromise();
  }
  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/invoices/' + id).toPromise(); }

  async getAllListNameId(): Promise<Array<Invoice>> {

    const invoices = await this.http.get<Array<Invoice>>('http://localhost:8080/invoices/list').toPromise();
    if(invoices == undefined){
      return [];
    }
    return invoices;
  }
}
