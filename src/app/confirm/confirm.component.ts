import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConnectService } from '../connect.service';
import { Observable } from 'rxjs/Rx';
import { StatusComponent } from '../status/status.component';

export class acc {
  id: string;
  addr: string;
}

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  listAcc: acc[] = [];
  temp = false;
  account = { user: "", pass: "", status: "" };

  constructor(public thisDialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private _ConnectService: ConnectService) {

  }

  ngOnInit() {
    this.watchEvent();
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  watchEvent() {
    let self = this;
    this._ConnectService.AccountContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });

        events.watch(function (error, log) {

          self.listAcc.push({ id: log.args.id, addr: log.args.addr });

          console.log(self.listAcc);
        })
      })
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

  async onCloseConfirm(value, isValid: boolean) {
    let tempID = this.convertStringToByte(value.username);
    for (let i = 0; i < this.listAcc.length; i++) {
      if (tempID == this.listAcc[i].id) {
        this._ConnectService.web3.personal.unlockAccount(this.listAcc[i].addr, value.password, 15000, (err, res) => {
          this.temp = res;
          this.account.user = this.listAcc[i].addr;
          console.log(this.temp);
        });
      }
    }

    // if (this._ConnectService.web3.isAddress(value.username)) {
    //   this._ConnectService.web3.personal.unlockAccount(value.username, value.password, 15000, (err, res) => {
    //     this.temp = res;
    //     console.log(this.temp);
    //   });
    // }
    // else {
    //   this.account.user = value.username;
    //   this.account.pass = value.password;
    //   this.account.status = "Wrong";
    //   this.thisDialogRef.close(this.account);
    //   return;
    // }

    await this.delay(2000);
    if (this.temp) {
      this.account.pass = value.password;
      this.account.status = "Success";
      this.thisDialogRef.close(this.account);
    }
    else {
      this.account.pass = "";
      this.account.status = "Fail";
      this.thisDialogRef.close(this.account);
    }
  }

  onCloseCancel() {
    this.account.status = "Cancel";
    this.thisDialogRef.close(this.account);
  }

}
