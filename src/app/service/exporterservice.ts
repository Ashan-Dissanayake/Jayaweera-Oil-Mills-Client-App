import {Component, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Exporter} from "../entity/exporter";

@Injectable({
  providedIn: 'root'
})
export class ExporterService {

  constructor(private http: HttpClient) {
  }
  async getAll(query:string): Promise<Array<Exporter>> {
    const exporters = await this.http.get<Array<Exporter>>('http://localhost:8080/exporters'+query).toPromise();
    if(exporters == undefined){
      return [];
    }
    return exporters;
  }

  async add(exporter: Exporter): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/exporters/',exporter).toPromise();
  }

  async update(exporter: Exporter): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/exporters', exporter).toPromise();
  }
  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/exporters/' + id).toPromise(); }

  async getAllList(): Promise<Array<Exporter>> {

    const exporters = await this.http.get<Array<Exporter>>('http://localhost:8080/exporters/list').toPromise();
    if(exporters == undefined){
      return [];
    }
    return exporters;
  }
}
