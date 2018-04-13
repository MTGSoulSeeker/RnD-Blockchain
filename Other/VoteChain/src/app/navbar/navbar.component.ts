import { Component, OnInit, HostListener } from '@angular/core';
import { ConnectService } from '../connect.service';
import { Router } from '@angular/router';

export class acc {
  id: string;
  addr: string;
}

export class loginInfo {
  id: string;
  password: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  listAcc: acc[] = [];
  validID: string = "";
  tempUser: loginInfo;

  constructor(private _router: Router, private Connect: ConnectService) { }

  ngOnInit() {
    this.tempUser = {
      id: "",
      password: ""
    }
    this.watchEvent();
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
            self.listAcc.push({ id: log.args.id, addr: log.args.addr });
          }
        })
      })
  }

  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  //Login
  async login(value, valid) {
    this.tempUser = {
      id: "",
      password: ""
    };
    let temp = false;
    let tempID = this.convertStringToByte(value.id);
    for (let i = 0; i < this.listAcc.length; i++) {
      if (tempID == this.listAcc[i].id) {
        this.Connect.web3.personal.unlockAccount(this.listAcc[i].addr, value.password, 15000, (err, res) => {
          temp = res;
          this.validID = this.listAcc[i].addr;
          this.Connect.web3.personal.lockAccount(this.listAcc[i].addr);
        });
      }
    }

    await this.delay(2000);
    if (temp) {
      this._router.navigate(['userinfo/', value.id]);
    }
    else {
      this._router.navigate(['error']);
    }
  }
}
