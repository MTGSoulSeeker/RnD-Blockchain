import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class ServicesService {

  constructor(public http:Http) {
    console.log("Data service Connected...");
  }

  getAccounts(){
    return this.http.get('http://localhost:8545')
    .map(res=>res.json());
  }
}
