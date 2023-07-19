import {Component, Injectable} from '@angular/core';
import {Employee} from "../entity/employee";
import {HttpClient} from "@angular/common/http";
import {Product} from "../entity/product";

@Injectable({
  providedIn: 'root'
})
export class Productservice{

  constructor(private http: HttpClient) {
  }
  async getAll(query:string): Promise<Array<Product>> {
    const products = await this.http.get<Array<Product>>('http://localhost:8080/products'+query).toPromise();
    if(products == undefined){
      return [];
    }
    return products;
  }

  async add(product: Product): Promise<[]|undefined>{
    console.log(JSON.stringify(product));
    return this.http.post<[]>('http://localhost:8080/products/',product).toPromise();
  }

  async update(product: Product): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/products', product).toPromise();
  }
  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/products/' + id).toPromise(); }

  async getAllListNameId(): Promise<Array<Product>> {

    const products = await this.http.get<Array<Product>>('http://localhost:8080/products/list').toPromise();
    if(products == undefined){
      return [];
    }
    return products;
  }
}
