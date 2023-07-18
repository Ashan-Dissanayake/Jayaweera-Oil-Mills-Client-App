import {Component, Injectable} from '@angular/core';
import {Designation} from "../entity/designation";
import {HttpClient} from "@angular/common/http";
import {Productstatus} from "../entity/productstatus";
import {Unit} from "../entity/unit";
import {Category} from "../entity/category";

@Injectable({
  providedIn: 'root'
})
export class Categoryservice {

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Category>> {

    const category = await this.http.get<Array<Category>>('http://localhost:8080/categories/list').toPromise();
    if (category == undefined) {
      return [];
    }
    return category;

  }

}
