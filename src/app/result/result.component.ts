import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConnectService } from '../connect.service';
import { Observable } from 'rxjs/Rx';
import { Room } from '../voterooms/rooms';
import { Result } from './result';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  @Input() roomtemp: Room;

  sender: Result[] = [];
  yes: any;
  no: any;
  addr: string;
  constructor(public thisDialogRef: MatDialogRef<ResultComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _connectService: ConnectService) {

  }

  ngOnInit() {
    this.roomtemp = {
      id: '',
      title: '',
      description: '',
      dateCreated: '',
      dateEnd: '',
      owner: '',
      type: '',
    };
    this.yes = '';
    this.no = '';
    this.getResult();
  }

  getResult(): void {
    let self = this;
    self.addr = self.data.Daddr;
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });

        events.watch(function (error, log) {
          if (log.event == "LOGvoteNotify" && log.args.roomID == self.data.Did) {
            self.sender.push({ user: log.args.sender, option: log.args.option, time: self._connectService.web3.eth.getBlock(log.blockNumber).timestamp })
            console.log(log);
          }
        });
      });

    // this._connectService.VotingContract
    //   .deployed()
    //   .then(function (temp) {
    //     temp.getCountOf(self.data.Did, "yes", { from: self._connectService.web3.eth.coinbase, gas: 300000 })
    //       .then(function (v) {
    //         self.yes = v;
    //       });

    //     temp.getCountOf(self.data.Did, "no", { from: self._connectService.web3.eth.coinbase, gas: 300000 })
    //       .then(function (u) {
    //         console.log(u);
    //         self.no = u;
    //       });
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   });
  }

}