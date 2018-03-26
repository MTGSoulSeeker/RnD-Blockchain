import { Component, OnInit, HostListener } from '@angular/core';
import { ConnectService } from '../connect.service';
import { canBeNumber } from '../../util/validation';
import { UserInfo } from './userInfo.interface';
import { Observable } from 'rxjs/Observable';
import { FUNCTION_TYPE } from '@angular/compiler/src/output/output_ast';
import { Room } from './rooms';

declare var window: any;

@Component({
  selector: 'app-voterooms',
  templateUrl: './voterooms.component.html',
  styleUrls: ['./voterooms.component.css']
})

export class VoteroomsComponent implements OnInit {

  active: any;
  rooms: Room[] = [];
  options: any;
  addr: string;
  listAccount: string[];
  canBeNumber = canBeNumber;
  public userInfo: UserInfo;
  datenow: number = Date.now();
  tempstr: string;
  constructor(private _connectService: ConnectService) {
    this.listAccount = [];
  }

  @HostListener('window:load')
  windowLoaded() {
    this.getRooms();
  }

  ngOnInit() {
    this.userInfo = {
      username: '',
      id: '',
      age: ''
    };
    this.options = "All";
    this.getRooms();
  }

  onSelect(select) {
    this.active = select;
  }

  toHex(hexx) {
    var str = '';
    for (var i = 0; i < hexx.length; i += 2)
      str += String.fromCharCode(parseInt(hexx.substr(i, 2), 16));
    this.tempstr = str.replace(/(?!\w|\s)./g, '');
    console.log(this.tempstr);
    return this.tempstr;
  }

  addAddr() {
    this.listAccount.push(this.addr);
  }

  getAcc() {
    let self = this;
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        temp.getListAddrAcc()
          .then(function (res) {
            console.log(res);
            self.listAccount = res;
          })
      })
      .catch(err => {
        console.log(err)
      });
  }

  getInfo() {
    let minhminh = this;
    let strtemp;
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        temp.getFullAcc('0x02d7db067f0c2bbcd32242a56625611f1c0d7c8a')
          .then(function (res) {
            minhminh.userInfo.username = res[0];
            minhminh.userInfo.id = minhminh.toHex(res[1]);
            minhminh.userInfo.age = res[2];
            console.log(minhminh.userInfo);
          })
      })
  }

  addOption() {
    this._connectService.VotingContract
      .deployed()
      .then(function (temp) {
        temp.addOption("no", { from: "0xad717b16f3a89ad49421da314568c02f5a6f6038" })
          .then(function (v) {
            console.log(v);
          })
      });
  }

  getRooms() {
    var event_data;
    var event_data_2;
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
    // setTimeout
    // (
    //   ()=>
    //   {
    //     events.stopWatching();
    //   }, 60000
    // );
  };  
}
