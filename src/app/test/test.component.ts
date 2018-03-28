import { Component, OnInit } from '@angular/core';
import { ConnectService } from '../connect.service';
import { Room } from '../voterooms/rooms';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  rooms: Room[] = [];

  constructor(private Connect: ConnectService) {
  }

  ngOnInit() {
  }

  //Delay function
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getRoomsTest() {
    let self = this;
    this.Connect.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGroomOpened" ) {
            var isPrivate: string;
            if (log.args.privateRoom ) {
              isPrivate = "Private";
            }
            else {
              isPrivate = "Public";
            }
            self.rooms.unshift({
              id: log.args.roomID, title: log.args.title, description: log.args.descript, dateCreated: self.Connect.web3.eth.getBlock(log.blockNumber).timestamp,
              dateEnd: log.args.expiredTime, owner: log.args.owner, type: isPrivate
            });
          }

        });
      });
  };

  async getPrivateList(){
    let self = this;
    let listPrivateRoom: test[]=[];
    this.Connect.VotingContract
      .deployed()
      .then(function (temp) {
        var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });
        events.watch(function (error, log) {
          if (log.event == "LOGPrivateListVoter" && log.args.addr == "0xad67627f8cd8cc34880031c57e6881e515be13f2") {
            console.log(log);  
            listPrivateRoom.push({id:log.args.roomID*1,addr:log.args.addr});    
          }
        });
      });
    var tempsort : test[] = [
      {id:4,addr:"a"},
      {id:9,addr:"b"},
      {id:21,addr:"c"},
      {id:13,addr:"d"}, 
      {id:22,addr:"e"},
      {id:11,addr:"f"},
      {id:44,addr:"g"},
      {id:41,addr:"h"}
    ];

    await this.delay(2000);

    let temptemp:test[]=[];

    console.log(listPrivateRoom);
    console.log(tempsort);

    temptemp= listPrivateRoom.concat(tempsort);
    console.log(temptemp.sort((a, b)=>{return a.id-b.id}));

    // console.log(tempsort);

    // Array.prototype.push.apply(listPrivateRoom,tempsort);
    // temptemp = listPrivateRoom;
    // console.log(temptemp);
    // temptemp.sort((a, b)=>{return a.id-b.id});
    // console.log(temptemp);


      // console.log(tempsort.sort((a, b)=>{return a.id-b.id}));
      // console.log(tempsort.sort((a, b)=>{return b.id-a.id}));
      // console.log(tempsort.reverse());
  }
}

export class test {
  id: number;
  addr: string;
}


