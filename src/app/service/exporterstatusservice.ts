import {Component, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Exporterstatus} from "../entity/exporterstatus";

@Injectable({
  providedIn: 'root'
})
export class ExporterstatusService {

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Exporterstatus>> {

    const exporterstatus = await this.http.get<Array<Exporterstatus>>('http://localhost:8080/exporterstatuses/list').toPromise();
    if (exporterstatus == undefined) {
      return [];
    }
    return exporterstatus;

  }

}
