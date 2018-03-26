import { Component, OnInit, HostListener } from '@angular/core';
// import { ConnectService } from '../connect.service';
import { Router } from '@angular/router';

const web3 = require('web3');
const contract = require('truffle-contract');
const VotingABI = require('../../../build/contracts/voting12.json');
// const AccountABI = require('../../../build/contracts/ManageAccount12.json');
declare var window: any;

export class acc {
  id: string;
  addr: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  web3: any;
  VotingContract = contract(VotingABI);
  // AccountContract = contract(AccountABI);

  listAcc: acc[] = [];
  validID: string = "";

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
    this.watchEvent();
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

  watchEvent() {
    let self = this;
    this.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });

        events.watch(function (error, log) {
          if (log.event === "LOGaccountInfo") {
            self.listAcc.push({ id: log.args.id, addr: log.args.addr });
          }
        })
      })

    console.log(self.listAcc);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    console.log(result);
    return result
  }

  async login(value, valid) {
    // console.log(value.id);
    // console.log(value.password);
    // console.log(valid);

    let temp = false;
    let tempID = this.convertStringToByte(value.id);
    for (let i = 0; i < this.listAcc.length; i++) {
      if (tempID == this.listAcc[i].id) {
        this.web3.personal.unlockAccount(this.listAcc[i].addr, value.password, 15000, (err, res) => {
          temp = res;
          this.validID = this.listAcc[i].addr;
          this.web3.personal.lockAccount(this.listAcc[i].addr, (err, res) => {
            console.log(res);
          });
        });        
      }
    }
    await this.delay(2000);
    console.log(temp);
    console.log(this.validID);
    console.log(value.id);
    if(temp){
      this._router.navigate(['userinfo/', value.id]);
    }
    else{
      this._router.navigate(['error']);
    }
  }


}
