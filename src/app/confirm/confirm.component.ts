import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConnectService } from '../connect.service';
import { Observable } from 'rxjs/Rx';
import { StatusComponent } from '../status/status.component';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  temp = false;
  account = { user: "", pass: "", status: "" };

  constructor(public thisDialogRef: MatDialogRef<ConfirmComponent>, @Inject(MAT_DIALOG_DATA) public data: string, private _ConnectService: ConnectService) {

  }

  ngOnInit() {
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  unlockAccount(user, pass) {
    this._ConnectService.web3.personal.getAccounts(this.account, (err, res) => {
      console.log(res);
      console.log(err);
    });
  }

  async onCloseConfirm(value, isValid: boolean) {
    if (this._ConnectService.web3.isAddress(value.username)) {
      this._ConnectService.web3.personal.unlockAccount(value.username, value.password, 15000, (err, res) => {
        if (!err) {
          this.temp = res;
        }
      });
    }
    else {
      this.account.user = value.username;
      this.account.pass = value.password;
      this.account.status = "Wrong";
      this.thisDialogRef.close(this.account);
      return;
    }

    await this.delay(2000);
    if (this.temp) {
      this.account.user = value.username;
      this.account.pass = value.password;
      this.account.status = "Success";
      this.thisDialogRef.close(this.account);
    }
    else {
      this.account.user = value.username;
      this.account.pass = value.password;
      this.account.status = "Fail";
      this.thisDialogRef.close(this.account);
    }
  }

  onCloseCancel() {
    this.account.status = "Cancel";
    this.thisDialogRef.close(this.account);
  }

}
