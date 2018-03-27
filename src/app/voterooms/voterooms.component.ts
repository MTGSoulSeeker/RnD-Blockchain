import { Component, OnInit, HostListener } from '@angular/core';
import { ConnectService } from '../connect.service';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { Room } from './rooms';

@Component({
  selector: 'app-voterooms',
  templateUrl: './voterooms.component.html',
  styleUrls: ['./voterooms.component.css']
})

export class VoteroomsComponent implements OnInit {

  active: any;
  rooms: Room[] = [];
  options: any;
  constructor(private _connectService: ConnectService) {
  }

  ngOnInit() {
    this.options = "All";
    this.getRooms();
  }

  onSelect(select) {
    this.active = select;
  }

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
            self.rooms.push({
              id: log.args.roomID, title: log.args.title, description: log.args.descript, dateCreated: self._connectService.web3.eth.getBlock(log.blockNumber).timestamp,
              dateEnd: log.args.expiredTime, owner: log.args.owner, type: isPrivate
            });
          }
        });
      });
  };
}
