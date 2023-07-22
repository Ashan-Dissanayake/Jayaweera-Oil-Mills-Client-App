import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Exporter} from "../entity/exporter";

@Injectable({
  providedIn: 'root'
})
export class Exporterservice{

  constructor(private http: HttpClient) {
  }
  async getAllList(): Promise<Array<Exporter>> {

    const exporters = await this.http.get<Array<Exporter>>('http://localhost:8080/exporters/list').toPromise();
    if (exporters == undefined) {
      return [];
    }
    return exporters;

  }

}
