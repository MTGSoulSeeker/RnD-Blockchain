import { Component, OnInit, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConnectService } from '../connect.service';
import { Observable } from 'rxjs/Rx';
import { Room } from '../voterooms/rooms';
import { Result, Question } from './result';
// import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

declare var window: any;

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  sender: Result[] = [];
  nQuestion: Question[] = [];
  n: number = 0;
  addr: string = "";
  isLoaded = false;
  resultInfo: Result[];
  constructor(public thisDialogRef: MatDialogRef<ResultComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _connectService: ConnectService) {
    this.addr = data.Daddr;
    this.n = data.Dnumber;
  }

  ngOnInit() {
    this.getResult();
  }


  toHex(hexx) {
    let str = '';
    let tempstr = '';
    for (let i = 0; i < hexx.length; i += 2)
      str += String.fromCharCode(parseInt(hexx.substr(i, 2), 16));
    tempstr = str.replace(/(?!\w|\s)./g, '');
    return tempstr;
  }

  getResult(): void {
    let self = this;
    for (let i = 0; i < self.n; i++) {
      let tempStr = "QUESTION #" + (i + 1);
      self.nQuestion.push({ questionNumber: tempStr, questionDetail: this.data.Dquestion[i].question });
    }
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGvoteNotify" && log.args.roomID == self.data.Did) {
            let tempstr: string[] = [];
            for (let i = 0; i < log.args.options.length; i++) {
              tempstr.push(self.toHex(log.args.options[i]));
            }
            self.sender.push({ user: log.args.sender, options: tempstr, time: self._connectService.web3.eth.getBlock(log.blockNumber).timestamp })
          }
        });
      });
  }

  // displayedColumns = ['addr', 'options'];
  // dataSource = new MatTableDataSource();

  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.getResulttemp();
  //   this.dataSource = new MatTableDataSource(this.data.Ddata);
  //   this.dataSource.sort = this.sort;
  //   this.dataSource.paginator = this.paginator;
  // }

  // getResulttemp(): void {
  //   let self = this;

  //   this._connectService.VotingContract
  //     .deployed()
  //     .then(function (temp) {
  //       var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
  //       events.watch(function (error, log) {
  //         if (log.event == "LOGvoteNotify" && log.args.roomID == 0) {
  //           let tempstr: string[] = [];
  //           for (let i = 0; i < log.args.options.length; i++) {
  //             tempstr.push(self.toHex(log.args.options[i]));
  //           }
  //           self.resultInfo.push({ addr: log.args.sender, options: log.args.options[0] })
  //         }
  //       });
  //     });
  //   self.dataSource = new MatTableDataSource(self.resultInfo);
  //   console.log(self.resultInfo);
  //   console.log(self.dataSource.data);
  // }

}

// export interface Resulttemp {
//   addr: string;
//   options: string;
// }

