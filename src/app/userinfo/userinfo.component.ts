import { Component, OnInit, Input, HostListener } from '@angular/core';
// import { ConnectService } from '../connect.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

const web3 = require('web3');
const contract = require('truffle-contract');
const VotingABI = require('../../../build/contracts/voting12.json');
// const AccountABI = require('../../../build/contracts/ManageAccount12.json');
declare var window: any;

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

  web3: any;
  VotingContract = contract(VotingABI);
  // AccountContract = contract(AccountABI);

  id: string;
  account: string = "";
  userHistory: history[] = [];
  listAcctemp: acc[] = [];

  constructor(private route: ActivatedRoute, private location: Location) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() { }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
    this.watchEvent();
    this.getInfo();
  }

  checkAndInstantiateWeb3 = () => {
    //Check if using Mist or Metamask
    if (typeof window.web3 !== 'undefined') {
      console.warn('Using web3 detected from Mist.Metamask.');
      this.web3 = new web3(window.web3.currentProvider);
    } else {
      //Using localhost
      console.warn('No web3 detected. Connect to http://127.0.0.1:8545.');
      this.web3 = new web3(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
    }
    console.log(web3);
  };

  onReady = () => {
    //Add Contract
    this.VotingContract.setProvider(this.web3.currentProvider);
    // this.AccountContract.setProvider(this.web3.currentProvider);
    //Get all accounts
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution      
      // this._ngZone.run;
    });
  }

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
    //console.log(result);
    return result
  }

  watchEvent() {
    let self = this;
    this.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          self.listAcctemp.push({ id: log.args.id, addr: log.args.addr });
        })
      })
  }

  async getInfo() {
    let self = this;

    await this.delay(5000);

    console.log(self.listAcctemp.length);
    let tempID = self.convertStringToByte(self.id);
    console.log(tempID);
    for (let i = 0; i < self.listAcctemp.length; i++) {
      if (tempID == self.listAcctemp[i].id) {
        self.account = self.listAcctemp[i].addr;
      }
    }
    console.log(self.account);


    this.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });

        events.watch(function (error, log) {
          if ((self.account == log.args.owner) && (log.event == "LOGroomOpened")) {
            console.log(log);
            self.userHistory.unshift({ trans: log.transactionHash, addr: log.address, action: log.event, time: self.web3.eth.getBlock(log.blockNumber).timestamp, roomID: log.args.roomID, options: ["", ""] })
          }
          if ((self.account == log.args.sender) && (log.event == "LOGvoteNotify")) {
            console.log(log);
            let tempstr: string[] = [];
            for (let i = 0; i < log.args.options.length; i++) {
              tempstr.push(self.toHex(log.args.options[i]));
            }
            self.userHistory.unshift({ trans: log.transactionHash, addr: log.address, action: log.event, time: self.web3.eth.getBlock(log.blockNumber).timestamp, roomID: log.args.roomID, options: tempstr })
          }
        })
      });
  }

}
