import { Component, OnInit } from '@angular/core';
import { RoomCreation } from './room-creation';
import { ConnectService } from '../connect.service';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../confirm/confirm.component';
import { multiChoice } from '../test/multipleChoice';
import { StatusComponent } from '../status/status.component';

@Component({
  selector: 'app-roomcreate',
  templateUrl: './roomcreate.component.html',
  styleUrls: ['./roomcreate.component.css']
})

export class RoomcreateComponent implements OnInit {

  multipleChoice: multiChoice[] = [];
  room: RoomCreation;
  temp: RoomCreation;
  flag: string;
  tempListVoter: string = "";
  listVoter: string[] = [];

  constructor(private _connectService: ConnectService, public dialog: MatDialog) {
    this.multipleChoice = [];
  }

  generateListVoter() {
    this.listVoter = this.tempListVoter.replace(/\s/g, '').split(";");
    console.log(this.tempListVoter);
    console.log(this.listVoter);
  }

  ngOnInit() {
    this.temp = {
      title: '',
      description: '',
      dateEnd: '',
      type: 'Public'
    }

    this.room = {
      title: '',
      description: '',
      dateEnd: '',
      type: ''
    }

    this.flag = null;
  }

  onSelect(select) {
    this.temp.type = select;
  }

  openDialog(ROOM: RoomCreation, isValid: boolean) {
    let self = this;
    let epoch = new Date(ROOM.dateEnd).getTime();
    self.room.title = ROOM.title;
    self.room.description = ROOM.description;
    self.room.dateEnd = epoch;
    if (ROOM.type == "Private") {
      self.room.type = 1;
    }
    if (ROOM.type == "Public") {
      self.room.type = 0;
    }

    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: 'Please Login to confirm your decision'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result.status);
      if (result.status == "Success") {
        this.createRoom(self.room, result.user);
      }
    });

    self.temp.title = ' ';
    self.temp.description = ' ';
    self.temp.dateEnd = ' ';
    self.temp.type = 'Public';
  }

  createRoom(ROOM: RoomCreation, user) {
    let id: string;
    let self = this;
    let loading: boolean = true; //Check if it is running or not
    let x: multiChoice[] = self.multipleChoice;
    console.log(x)
    console.log(ROOM);

    let submitTrans = this.dialog.open(StatusComponent, {
      width: '600px',
      data: { Dloading: loading },
      disableClose: true
    });

    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        temp.openRoom(ROOM.title, ROOM.type, ROOM.description, ROOM.dateEnd, { from: user, gas: 1000000 })
          .then(function (v) {
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
                if (ROOM.type == 1) {
                  self.generateListVoter();
                  temp02.setListVotersByID(v.logs[0].args.roomID.toString(), self.listVoter, { from: user, gas: 1000000 })
                    .then(function (v02) {
                      console.log(v02);
                    })
                }
              })
            loading = false;
            submitTrans.close();
            let dialogRef = self.dialog.open(StatusComponent, {
              width: '600px',
              data: { Ddetail: "Congratualation, your room has been successfully created!" }
            });
          })
          .catch(err => {
            console.log(err);
          });
      });

    self.multipleChoice = [];

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

  showValue(a, b) {
    console.log(a);
    console.log(this.multipleChoice)
  }


}
