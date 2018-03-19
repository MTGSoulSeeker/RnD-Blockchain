import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConnectService } from '../connect.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { Room } from '../voterooms/rooms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ResultComponent } from '../result/result.component';
import { multiChoice } from '../test/multipleChoice';
import { Choices } from './choices';
import { StatusComponent } from '../status/status.component';

declare var window: any;

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  //ID and Info of a Room
  id = +this.route.snapshot.paramMap.get('id');
  @Input() room: Room;
  //Multi Questions and Options
  multipleChoice: multiChoice[] = [];
  tempMultiChoice: Choices[] = [];
  flag: boolean = false;

  //Initialize a service to connect to blockchain, a dialog to open Popup, route to get ID and location to go back
  constructor(private _connectService: ConnectService, public dialog: MatDialog, private route: ActivatedRoute, private location: Location) {
  }

  //Create temp date for a Room
  ngOnInit() {
    this.room = {
      id: '',
      title: '',
      description: '',
      dateCreated: '',
      dateEnd: '',
      owner: '',
      type: '',
    };

    this.getRoom();
    this.getOption();
  }

  //Get Info and Multi Questions and Options by ID, create temp data for Multi Questions and Options by ID
  @HostListener('window:load')
  windowLoaded() {
    this.getRoom();
    this.getOption();
  }

  //Function to go back the previous page
  goBack(): void {
    this.location.back();
  }

  //Make an End transaction to close the room
  sendEnd() {
    this.flag = true;
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

  //Open login popup to confirm the action then cast the vote
  openDialog() {
    let informResult: any;

    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: 'Make sure that you choose the right options!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result.status);
      if (result.status == "Success") {
        this.vote(result.user, result.pass);
      }
      else {
        informResult = this.dialog.open(StatusComponent, {
          width: '600px',
          data: { Dloading: false, Ddetail: "Please check again your username and password" }
        });
      }
    });
  }

  //Open the popup result
  openResult(id: number) {
    let dialogRef01 = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: 'Please Login to check the result '
    });

    dialogRef01.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result.status);
      if (result.status == "Success") {
        this.checkResult(id, result.user);
      }
    });
  }

  //Get room by ID
  getRoom() {
    let self = this;
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.args.roomID == self.id && log.event == "LOGroomOpened") {
            var isPrivate: string;
            if (log.args.privateRoom) {
              isPrivate = "Private";
            }
            else {
              isPrivate = "Public";
            }
            self.room.id = log.args.roomID;
            self.room.title = log.args.title;
            self.room.description = log.args.descript;
            self.room.dateCreated = self._connectService.web3.eth.getBlock(log.blockNumber).timestamp;
            self.room.dateEnd = log.args.expiredTime;
            self.room.owner = log.args.owner;
            self.room.type = isPrivate;
          }
        });
      });
    return self.room;
  };

  //Get only Options for each Question
  getOption() {
    let self = this;
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.args.roomID == self.id && log.event == "LOGpollingAdded") {
            let tempstr: string[] = [];
            for (let i = 0; i < log.args.options.length; i++) {
              tempstr.push(self.toHex(log.args.options[i]));
            }
            self.multipleChoice.push({ id: log.args.roomID, question: log.args.question, options: tempstr })
            self.tempMultiChoice.push({ questionID: log.args.pollID * 1, optionID: 0, option: "" });
          }
        });
      });
  }

  //Make temp data when user select an option
  onSelect(i, x, tempChoice: string) {
    for (let z = 0; z < this.tempMultiChoice.length; z++) {
      if (this.tempMultiChoice[z].questionID == i) {
        this.tempMultiChoice[z].optionID = x;
        this.tempMultiChoice[z].option = tempChoice;
      }
    }
    console.log(this.tempMultiChoice)
  }

  //Cast the vote after Confirm
  vote(user: string, pass: string) {
    let self = this;
    let loading: boolean = true; //Check if it is running or not
    let options: string[] = [];
    let informResult: any;

    //Get option and check if there is any missing question
    for (let i = 0; i < this.tempMultiChoice.length; i++) {
      if (this.tempMultiChoice[i].option == "") {
        console.log("have empty option");
        loading = false;
        informResult = self.dialog.open(StatusComponent, {
          width: '600px',
          data: { Dloading: loading, Ddetail: "You didn't answer the question #" + (i + 1) }
        });
        return;
      }
      options.push(this.tempMultiChoice[i].option);
    }

    //Check whether you have enough money or not
    if (self._connectService.web3.eth.getBalance(user) * 1 < 1) {
      console.log(self._connectService.web3.eth.getBalance(user));
      informResult = self.dialog.open(StatusComponent, {
        width: '600px',
        data: { Dloading: loading, Ddetail: "You don't have enough money to do this transaction" }
      });
      return;
    }

    //Submitting Transactions
    let submitTrans = this.dialog.open(StatusComponent, {
      width: '600px',
      data: { Dloading: loading },
      disableClose: true
    });

    //Cast the ballot
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        temp.voteFor(self.room.id, options, { from: user, gas: 1000000 })
          .then(function (v) {
            console.log(v);
            if (v.logs.length == 0) {
              loading = false;
              submitTrans.close();
              let dialogRef = self.dialog.open(StatusComponent, {
                width: '600px',
                data: { Ddetail: "Error, There is something wrong, please check your balance and answer all questions." }
              });
            }
            else {
              loading = false;
              submitTrans.close();
              let dialogRef = self.dialog.open(StatusComponent, {
                width: '600px',
                data: { Ddetail: "Congratualation, your ballot has been successfully casted!" }
              });
            }
          })
      })
      .catch(err => {
        console.log(err);
      });
  }


  //Show the Result after Confirm
  checkResult(id, addr) {
    let n: number = this.tempMultiChoice.length;
    console.log(n);
    let dialogRef02 = this.dialog.open(ResultComponent, {
      width: '1500px',
      // panelClass: 'disable-mat-dialog-container',
      data: { Did: id, Daddr: addr, Dnumber: n, Dquestion: this.multipleChoice }
      // data: { Did: id, Ddata: self.resultInfo }
    });
  }

}