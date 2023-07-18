import {Component, Injectable} from '@angular/core';
import {Designation} from "../entity/designation";
import {HttpClient} from "@angular/common/http";
import {Productstatus} from "../entity/productstatus";
import {Unit} from "../entity/unit";

@Injectable({
  providedIn: 'root'
})
export class Unitservice {

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Unit>> {

    const unit = await this.http.get<Array<Unit>>('http://localhost:8080/units/list').toPromise();
    if (unit == undefined) {
      return [];
    }
    return unit;

  }

}
