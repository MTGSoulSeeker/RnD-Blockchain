import { Component, OnInit, Self } from '@angular/core';
import { User } from './user.interface';
import { Md5 } from 'ts-md5/dist/md5';
import { ConnectService } from '../connect.service';
import { StatusComponent } from '../status/status.component';
import { MatDialog } from '@angular/material';

export class acc {
  id: string;
  addr: string;
}

@Component({
  moduleId: module.id,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  listAcc: acc[] = [];

  constructor(private _md5: Md5, private _connectService: ConnectService, public dialog: MatDialog) {

  }

  public user: User;

  ngOnInit() {
    this.user = {
      username: '',
      id: '',
      password: '',
      confirmPassword: ''
    }
  }

  ngAfterViewInit() {
    this.watchEvent();

  }

  save(model: User, isValid: boolean) {
    // call API to save customer
    console.log(model, isValid);
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

  createAccount(tempUser: User, isValid: boolean) {
    var addr: any;
    var self = this;
    
    var tempID = self.convertStringToByte(tempUser.id);
    for (let i = 0; i < self.listAcc.length; i++) {
      if (tempID == self.listAcc[i].id) {
        let dialogRef = self.dialog.open(StatusComponent, {
          width: '600px',
          data: { Dloading: false, Ddetail: "These ID has been registed." }
        });
        return;
      }
    }

    this._connectService.web3.personal.newAccount(tempUser.password, (err, res) => {
      addr = res

      this._connectService.web3.personal.unlockAccount(this._connectService.web3.eth.accounts[0], "123", 15000, () => {
        this._connectService.web3.eth.sendTransaction({ from: this._connectService.web3.eth.accounts[0], to: addr, value: this._connectService.web3.toWei(10, "ether") },
          (err, res) => {
            console.log(this._connectService.web3.eth.getTransaction(res));
            console.log(res);
            while (this._connectService.web3.eth.getBalance(addr) == 0) {
              console.log("no money, fam");
            }

            this._connectService.web3.personal.unlockAccount(addr, tempUser.password, 15000, () => {
              this._connectService.AccountContract.deployed()
                .then(da => {
                  return da.createAcc(tempUser.username, tempUser.id, { from: addr, gas: 3000000 })
                })
                .then(function (v) {
                  if (v.logs.length != 0) {
                    let dialogRef = self.dialog.open(StatusComponent, {
                      width: '600px',
                      data: { Dloading: false, Ddetail: "Successful, your account is: " + tempUser.id }
                    });
                  }
                  // else {
                  //   let dialogRef = self.dialog.open(StatusComponent, {
                  //     width: '600px',
                  //     data: { Dloading: false, Ddetail: "Unfortunately, your account cannot be created. Please try again." }
                  //   });
                  // }
                })
                .catch(e => {
                  let dialogRef = self.dialog.open(StatusComponent, {
                    width: '600px',
                    data: { Dloading: false, Ddetail: "Unfortunately, your account cannot be created. Please try again." }
                  });
                });
            });
          }
        );
      });
    })
  }

  watchEvent() {
    let self = this;
    this._connectService.AccountContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });

        events.watch(function (error, log) {

          self.listAcc.push({ id: log.args.id, addr: log.args.addr });

          console.log(self.listAcc);
        })
      })
  }

}

