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
  public user: User;

  constructor(private _md5: Md5, private Connect: ConnectService, public dialog: MatDialog) {

  }


  ngOnInit() {
    this.user = {
      id: '',
      password: '',
      confirmPassword: ''
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

  //Create account
  createAccount(tempUser: User, isValid: boolean) {
    var addr: any;
    var self = this;
    let loading: boolean = true; //Check if it is running or not

    //Check duplicate
    var tempID = self.convertStringToByte(tempUser.id);
    for (let i = 0; i < self.listAcc.length; i++) {
      if (tempID == self.listAcc[i].id) {
        loading = false;
        let dialogRef = self.dialog.open(StatusComponent, {
          width: '600px',
          data: { Dloading: loading, Ddetail: "These ID has been registed." }
        });
        return;
      }
    }

    //Submitting Transactions
    let submitTrans = this.dialog.open(StatusComponent, {
      width: '600px',
      data: { Dloading: loading },
    });

    //Check Balance
    this.Connect.web3.personal.newAccount(tempUser.password, (err, res) => {
      addr = res
      this.Connect.web3.personal.unlockAccount(this.Connect.web3.eth.accounts[0], "123", 15000, () => {
        this.Connect.web3.eth.sendTransaction({ from: this.Connect.web3.eth.accounts[0], to: addr, value: this.Connect.web3.toWei(10, "ether") },
          (err, res) => {
            while (this.Connect.web3.eth.getBalance(addr) == 0) {
              console.log("Waiting...");
            }

            this.Connect.web3.personal.unlockAccount(addr, tempUser.password, 15000, () => {
              this.Connect.VotingContract.deployed()
                .then(da => {
                  return da.createAcc(tempUser.id, { from: addr, gas: 1000000 })
                })
                .then(function (v) {
                  if (v.logs.length != 0) {
                    loading = false;
                    submitTrans.close();
                    let dialogRef = self.dialog.open(StatusComponent, {
                      width: '600px',
                      data: { Dloading: loading, Ddetail: "Successful, your account is: " + tempUser.id }
                    });
                  }
                })
                .catch(e => {
                  loading = false;
                  let dialogRef = self.dialog.open(StatusComponent, {
                    width: '600px',
                    data: { Dloading: loading, Ddetail: "Unfortunately, your account cannot be created. Please try again." }
                  });
                });
            });
          }
        );
      });
    })

    this.user = {
      id: '',
      password: '',
      confirmPassword: ''
    }
  }

}

