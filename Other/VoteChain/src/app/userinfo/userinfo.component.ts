import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { ConnectService } from '../connect.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

export class history {
  trans: string;
  addr: string;
  action: string;
  time: any;
  roomID: string;
  options: string[];
}

export class acc {
  id: string;
  addr: string;
}

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})

export class UserinfoComponent implements OnInit {

  id: string;
  oldid: string = this.id;
  account: string = "";
  userHistory: history[];
  listAcctemp: acc[] = [];

  constructor(private route: ActivatedRoute, private location: Location, private Connect: ConnectService, private zone: NgZone) {

  }

  ngOnInit() {
    this.watchEvent();
  }

  ngDoCheck() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id !== this.oldid) {
      this.userHistory = [];
      this.getInfo();
      this.oldid = this.id;
    }
  }

  //Get all Registed Address with ID
  watchEvent() {
    let self = this;
    this.Connect.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event === "LOGaccountInfo") {
            self.listAcctemp.push({ id: log.args.id, addr: log.args.addr });
          }
        })
      })
    console.log(self.listAcctemp);
  }

  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Convert option from hex to string
  toHex(hexx) {
    let str = '';
    let tempstr = '';
    for (let i = 0; i < hexx.length; i += 2)
      str += String.fromCharCode(parseInt(hexx.substr(i, 2), 16));
    tempstr = str.replace(/(?!\w|\s)./g, '');
    return tempstr;
  }

  //Convert String to Byte in order to compare ID
  convertStringToByte(string) {
    var result = "";
    var hextemp;
    for (let i = 0; i < string.length; i++) {
      hextemp = string.charCodeAt(i).toString(16);
      result += (hextemp).slice(-4);
    }
    let a = 16 - result.length;
    for (let j = 0; j < a; j++) {
      result = result + "0";
    }
    result = "0x" + result
    return result
  }

  //Get info by ID
  async getInfo() {
    let self = this;
    await this.delay(1000);

    let tempID = self.convertStringToByte(self.id);
    console.log(tempID);
    for (let i = 0; i < self.listAcctemp.length; i++) {
      if (tempID == self.listAcctemp[i].id) {
        self.account = self.listAcctemp[i].addr;
      }
    }

    this.Connect.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if ((self.account == log.args.owner) && (log.event == "LOGroomOpened")) {
            self.userHistory.unshift({ trans: log.transactionHash, addr: log.address, action: log.event, time: self.Connect.web3.eth.getBlock(log.blockNumber).timestamp, roomID: log.args.roomID, options: ["", ""] })
          }
          if ((self.account == log.args.sender) && (log.event == "LOGvoteNotify")) {
            let tempstr: string[] = [];
            for (let i = 0; i < log.args.options.length; i++) {
              tempstr.push(self.toHex(log.args.options[i]));
            }
            self.userHistory.unshift({ trans: log.transactionHash, addr: log.address, action: log.event, time: self.Connect.web3.eth.getBlock(log.blockNumber).timestamp, roomID: log.args.roomID, options: tempstr })
          }
        })
      });
    return self.userHistory;
  }

}
