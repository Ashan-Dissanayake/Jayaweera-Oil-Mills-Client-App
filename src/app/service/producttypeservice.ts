import {Component, Injectable} from '@angular/core';
import {Designation} from "../entity/designation";
import {HttpClient} from "@angular/common/http";
import {Productstatus} from "../entity/productstatus";
import {Producttype} from "../entity/producttype";

@Injectable({
  providedIn: 'root'
})
export class Producttypeservice {

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Productstatus>> {

    const producttypes = await this.http.get<Array<Producttype>>('http://localhost:8080/producttypes/list').toPromise();
    if (producttypes == undefined) {
      return [];
    }
    return producttypes;

  }

}
