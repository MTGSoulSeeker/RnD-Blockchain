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

  temp: RoomCreation;
  room: RoomCreation;
  multipleChoice: multiChoice[] = [];
  flag: string;
  tempListVoter: string = "";
  listVoter: string[] = [];

  constructor(private Connect: ConnectService, public dialog: MatDialog) {
  }

  // Split and Remove space => input an array
  generateListVoter() {
    this.listVoter = this.tempListVoter.replace(/\s/g, '').split(";");
    this.tempListVoter = "";
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

  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Change Color Button
  onSelect(select) {
    this.temp.type = select;
  }

  //Confirm before create a room
  openDialog(ROOM: RoomCreation) {
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
        this.createRoom(self.room, result.addr);
      }
    });
  }

  //Create a room
  async createRoom(ROOM: RoomCreation, user) {
    let id: string;
    let self = this;
    let loading: boolean = true; //Check if it is running or not
    let x: multiChoice[] = self.multipleChoice;

    let submitTrans = this.dialog.open(StatusComponent, {
      width: '600px',
      data: { Dloading: loading },
      disableClose: true
    });


    this.Connect.VotingContract
      .deployed()
      .then(function (temp) {
        temp.openRoom(ROOM.title, ROOM.type, ROOM.description, ROOM.dateEnd, { from: user, gas: 1000000 })
          .then(function (v) {
            self.Connect.VotingContract
              .deployed()
              .then(function (temp02) {
                if (ROOM.type == 1) {
                  self.generateListVoter();
                  temp02.setListVotersByID(v.logs[0].args.roomID.toString(), self.listVoter, { from: user, gas: 1000000 })
                }
                for (let z = 0; z < x.length; z++) {
                  temp02.addPoll(v.logs[0].args.roomID.toString(), x[z].question, x[z].options, { from: user, gas: 1000000 })
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

    self.temp.title = ' ';
    self.temp.description = ' ';
    self.temp.dateEnd = ' ';
    self.temp.type = 'Public';
    self.multipleChoice = [];  

  }

  //Create Question with Zero Option
  inputQuantity(n: number) {
    this.multipleChoice = [];
    for (let i = 0; i < n; i++) {
      this.multipleChoice.push({ id: i, question: null, options: [] });
    }
  }

  //Create N Options for Question[i]
  inputQuantity02(i: number, n: number) {
    this.multipleChoice[i].options = [];
    for (let x = 0; x < n; x++) {
      this.multipleChoice[i].options[x] = null;
    }
  }

  //Get information in ngFor
  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
