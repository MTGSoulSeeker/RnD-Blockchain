import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConnectService } from '../connect.service';
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
  account = { addr: "", pass: "", status: "" };

  constructor(public DialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private Connect: ConnectService) {

  }

  ngOnInit() {
    this.watchEvent();
  }

  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Get all Registed Address with ID
  watchEvent() {
    let self = this;
    self.listAcc=[];
    this.Connect.VotingContract
      .deployed()
      .then(function (evt) {
        var events = evt.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event === "LOGaccountInfo") {
            self.listAcc.push({ id: log.args.id, addr: log.args.addr });
          }
        });
        console.log(self.listAcc);

      })

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
    result = "0x" + result;
    return result
  }

  //Login and pass data
  async onCloseConfirm(value) {
    let isValid = false;
    let tempID = this.convertStringToByte(value.username);
    console.log(this.listAcc.length);
    for (let i = 0; i < this.listAcc.length; i++) {
      if (tempID == this.listAcc[i].id) {
        this.Connect.web3.personal.unlockAccount(this.listAcc[i].addr, value.password, 15000, (err, res) => {
          isValid = res;
          this.account.addr = this.listAcc[i].addr;
        });
      }
    }

    await this.delay(2000);

    if (isValid) {
      this.account.pass = value.password;
      this.account.status = "Success";
      this.DialogRef.close(this.account);
    }
    else {
      this.account.status = "Fail";
      this.DialogRef.close(this.account);
    }
  }

  //Cancel the progress
  onCloseCancel() {
    this.account.status = "Cancel";
    this.DialogRef.close(this.account);
  }

}
