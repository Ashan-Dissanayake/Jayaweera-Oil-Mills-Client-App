import {Component, Injectable} from '@angular/core';
import {Designation} from "../entity/designation";
import {HttpClient} from "@angular/common/http";
import {Productstatus} from "../entity/productstatus";
import {Unit} from "../entity/unit";
import {Category} from "../entity/category";
import {Subcategory} from "../entity/subcategory";

@Injectable({
  providedIn: 'root'
})
export class Subcategoryservice {

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Subcategory>> {

    const subcategory = await this.http.get<Array<Subcategory>>('http://localhost:8080/subcategories/list').toPromise();
    if (subcategory == undefined) {
      return [];
    }
    return subcategory;

  }

}
