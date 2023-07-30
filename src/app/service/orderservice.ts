import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Order} from "../entity/order";

@Injectable({
  providedIn: 'root'
})
export class Orderservice{

  constructor(private http: HttpClient) {
  }
  async getAll(query:string): Promise<Array<Order>> {
    const orders = await this.http.get<Array<Order>>('http://localhost:8080/orders'+query).toPromise();
    if(orders == undefined){
      return [];
    }
    return orders;
  }

  async add(order: Order): Promise<[]|undefined>{
    console.log("Employee Adding-"+JSON.stringify(order))
    return this.http.post<[]>('http://localhost:8080/orders/',order).toPromise();
  }

  async update(orders: Order): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/orders', orders).toPromise();
  }
  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/orders/' + id).toPromise(); }

  async getAllList(): Promise<Array<Order>> {
    const orders = await this.http.get<Array<Order>>('http://localhost:8080/orders/list').toPromise();
    if(orders == undefined){
      return [];
    }
    return orders;
  }
}
