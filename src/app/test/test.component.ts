import { Component, OnInit } from '@angular/core';
import { multiChoice } from './multipleChoice';
import { ConnectService } from '../connect.service';
import { RoomCreation } from '../roomcreate/room-creation';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../confirm/confirm.component';
import { StatusComponent } from '../status/status.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  multipleChoice: multiChoice[] = [];
  n: string[] = [" ", " ", " "];
  questions: string[] = [];
  options: string[] = [];
  room: RoomCreation;

  constructor(private _connectService: ConnectService, public dialog: MatDialog, private modalService: NgbModal) {
    this.multipleChoice = [
      // {
      //   id:"1",
      //   options: ["yes","no", "none"]
      // },
      // {
      //   id:"2",
      //   options: ["no","yes", "none"]
      // },
      // {
      //   id:"3",
      //   options: ["yes","none", "no"]
      // },
      // {
      //   id:"4",
      //   options: ["no","none", "yes"]
      // }
    ];
  }

  ngOnInit() {
  }

  inputQuantity(n: number) {
    this.multipleChoice = [];
    for (let i = 0; i < n; i++) {
      this.multipleChoice.push({ id: i, question: null, options: [] });
    }

    console.log(this.multipleChoice);
  }

  inputQuantity02(i: number, n: number) {
    this.multipleChoice[i].options = [];
    console.log(i);
    for (let x = 0; x < n; x++) {
      this.multipleChoice[i].options[x] = null;
    }
    console.log(this.multipleChoice[i].options);
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  showValue(x) {
    console.log(x);
  }

  openDialog(x: multiChoice[], isValid: boolean) {
    let self = this;
    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result.status);
      if (result.status == "Success") {
        this.createRoom(x, result.user);
      }
    });
  }

  open(isValid: boolean) {
    let dialogRef = this.dialog.open(StatusComponent, {
      data: {DisValid:isValid, Dstring:"Vay luon do Truy"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result);
      if (result)
      console.log("Success");
      else
      console.log("Fail");
    });
  }

  regis(){
    this._connectService.web3.eth.sendTransaction({
      from: this._connectService.web3.eth.coinbase,
      to: "0xf877c87a218e964b4712b4ff23bdf22c22ba5945",
      value: this._connectService.web3.toWei(10, "ether")
    }, (err, res) => {
      console.log(res);
      console.log(err);
    });
  }

  createRoom(x: multiChoice[], user) {
    let id: string;
    let self = this;
    console.log(x);
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        temp.openRoom("Pellentesque habitant morbi tristique",
          1, "senectus et netus et malesuada fames a"
          , 1520517252, { from: user, gas: 300000 })
          .then(function (v) {
            console.log(v);
            self._connectService.VotingContract
              .deployed()
              .then(function (temp02) {
                console.log(v.logs[0].args.roomID.toString());
                for (let z = 0; z < x.length; z++) {
                  temp02.addPoll(v.logs[0].args.roomID.toString(), x[z].question, x[z].options, { from: user, gas: 1000000 })
                    .then(function (v02) {
                      console.log(v02);
                    })
                }
              })
          })
      })
      .catch(err => {
        console.log(err);
      });
  }

}
