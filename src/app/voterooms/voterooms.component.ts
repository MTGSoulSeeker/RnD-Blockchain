import { Component, OnInit, HostListener } from '@angular/core';
import { ConnectService } from '../connect.service';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { Room } from './rooms';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'app-voterooms',
  templateUrl: './voterooms.component.html',
  styleUrls: ['./voterooms.component.css']
})

export class VoteroomsComponent implements OnInit {

  active: any;
  rooms: Room[] = [];
  options: any;
  isLogged: boolean = false;

  constructor(private _connectService: ConnectService, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.options = "All";
    this.getRooms();
  }

  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Change color radio
  onSelect(select) {
    this.active = select;
  }

  //Get all Rooms
  getRooms() {
    let self = this;
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGroomOpened") {
            var isPrivate: string;
            if (log.args.privateRoom) {
              isPrivate = "Private";
            }
            else {
              isPrivate = "Public";
            }
            self.rooms.unshift({
              id: log.args.roomID * 1, title: log.args.title, description: log.args.descript, dateCreated: self._connectService.web3.eth.getBlock(log.blockNumber).timestamp,
              dateEnd: log.args.expiredTime, owner: log.args.owner, type: isPrivate
            });
          }
        });

        setTimeout(() => {events.stopWatching();}, 10000);
      });
  };


  openDialog() {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: 'Please Login to confirm your decision'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result.status);
      if (result.status == "Success") {
        this.getEligibleRoom(result.addr);
        this.isLogged = true;
      }
    });
  }

  //Get Eligible Room
  async getEligibleRoom(address) {
    let self = this;
    self.rooms = [];
    let listPrivateRoom: number[] = [];
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGPrivateListVoter" && log.args.addr == address) {
            listPrivateRoom.push(log.args.roomID * 1);
          }
        });
      });

    await this.delay(2000);

    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGroomOpened") {
            var isPrivate: string;
            if (log.args.privateRoom) {
              for (let i = 0; i <= listPrivateRoom.length; i++) {
                if (log.args.roomID == listPrivateRoom[i]) {
                  // isPrivate = "Private";
                  self.rooms.unshift({
                    id: log.args.roomID * 1, title: log.args.title, description: log.args.descript, dateCreated: self._connectService.web3.eth.getBlock(log.blockNumber).timestamp,
                    dateEnd: log.args.expiredTime, owner: log.args.owner, type: "Private"
                  });
                }
              }
            }
            else {
              // isPrivate = "Public";
              self.rooms.unshift({
                id: log.args.roomID * 1, title: log.args.title, description: log.args.descript, dateCreated: self._connectService.web3.eth.getBlock(log.blockNumber).timestamp,
                dateEnd: log.args.expiredTime, owner: log.args.owner, type: "Public"
              });
            }
          }
        });
      });


  }
}
