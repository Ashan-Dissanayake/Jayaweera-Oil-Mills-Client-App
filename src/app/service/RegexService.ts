import {Component, Injectable} from '@angular/core';
import {Designation} from "../entity/designation";
import {HttpClient} from "@angular/common/http";
import {regExpEscape} from "@ng-bootstrap/ng-bootstrap/util/util";

@Injectable({
  providedIn: 'root'
})
export class RegexService{

  constructor(private http: HttpClient) {
  }
  async get(type:String):Promise<[]> {

    const regexes = await this.http.get<[]>('http://localhost:8080/regexes/'+type).toPromise();
    if (regexes == undefined) {
      return [];
    }
    return regexes;

  }

}
