import {Component, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Exportertype} from "../entity/exportertype";

@Injectable({
  providedIn: 'root'
})
export class ExportertypeService {

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Exportertype>> {

    const exportertype = await this.http.get<Array<Exportertype>>('http://localhost:8080/exportertypes/list').toPromise();
    if (exportertype == undefined) {
      return [];
    }
    return exportertype;

  }

}
