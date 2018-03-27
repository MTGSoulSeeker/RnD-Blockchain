import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ConnectService } from '../connect.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  isLoaded = false;
  tempstr: string = "";
  listVoter: string[] = [];

  constructor(private Connect: ConnectService) {
  }

  ngOnInit() {
    this.getResult();
  }

  displayedColumns = ['addr', 'options'];
  dataSource = new MatTableDataSource();
  resultInfo: Result[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the sort after the view init since this component will
   * be able to query its view for the initialized sort.
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  toHex(hexx) {
    let str = '';
    let tempstr = '';
    for (let i = 0; i < hexx.length; i += 2)
      str += String.fromCharCode(parseInt(hexx.substr(i, 2), 16));
    tempstr = str.replace(/(?!\w|\s)./g, '');
    return tempstr;
  }

  getResult(): Observable<Result[]> {
    let self = this;
    this.delay(5000);

    this.Connect.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGvoteNotify" && log.args.roomID == 1) {
            let tempstr: string[] = [];
            for (let i = 0; i < log.args.options.length; i++) {
              tempstr.push(self.toHex(log.args.options[i]));
            }
            self.resultInfo.push({ addr: log.args.sender, options: log.args.options[0] })
          }
        });
        self.isLoaded = true;
      });
    console.log(self.isLoaded);
    self.dataSource = new MatTableDataSource(self.resultInfo);
    console.log(self.resultInfo);
    console.log(self.dataSource.data);
    return
  }

}

export interface Result {
  addr: string;
  options: string;
}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const Table_Data: Result[] = this.resultInfo;

const ELEMENT_DATA: Element[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];