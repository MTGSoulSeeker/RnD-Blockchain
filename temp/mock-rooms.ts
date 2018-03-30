import { Room } from './rooms';
import { ConnectService } from '../connect.service';
import { OnInit } from '@angular/core';
import { RoomInfo } from './roomInfo';

export class roomsInfo implements OnInit {

    roomsInfo: RoomInfo[];

    constructor(private _connectService: ConnectService) {

    }

    ngOnInit() {
        this.roomsInfo = [{
            dateEnd: '',
            id: '',
            owner: ''
        }];
    }

    getAllEvent() {
        var event_data;
        var event_data_2;
        let self = this;
        this._connectService.VotingContract
            .deployed()
            .then(function (temp) {
                var events = temp.allEvents({ fromBlock: 0, toBlock: 'lastest' });

                events.watch(function (error, log) {
                    if (log.event == "EVroomOpened") {
                        self.roomsInfo.push({ dateEnd: log.args.expiredTime, id: log.args.id, owner: log.args.owner });
                        console.log(log);
                    }
                });
            });
        for (var x of self.roomsInfo) {
            console.log("Room ID: " + x.id);
            console.log("Room date: " + x.dateEnd);
            console.log("Room owner: " + x.owner);
            console.log("Room: " + x);
        }
    };
}


export const Rooms: Room[] = [
    { id: 1, title: "Vote01", description: "This is a vote 01", dateCreated: new Date("2018-02-01"), dateEnd: new Date("2018-02-08"), owner: "Minh1", type: "Invited", time: 168, option01: "yes", option02: "no" },
    { id: 2, title: "Vote02", description: "This is a vote 02", dateCreated: new Date("2018-02-02"), dateEnd: new Date("2018-02-09"), owner: "Minh2", type: "Public", time: 168, option01: "yes", option02: "no" },
    { id: 3, title: "Vote03", description: "This is a vote 03", dateCreated: new Date("2018-02-03"), dateEnd: new Date("2018-02-10"), owner: "Minh3", type: "Invited", time: 168, option01: "yes", option02: "no" },
    { id: 4, title: "Vote04", description: "This is a vote 04", dateCreated: new Date("2018-02-04"), dateEnd: new Date("2018-02-11"), owner: "Minh4", type: "Public", time: 168, option01: "yes", option02: "no" },
    { id: 5, title: "Vote05", description: "This is a vote 05", dateCreated: new Date("2018-02-05"), dateEnd: new Date("2018-02-12"), owner: "Minh5", type: "Invited", time: 168, option01: "yes", option02: "no" },
    { id: 6, title: "Vote06", description: "This is a vote 06", dateCreated: new Date("2018-02-06"), dateEnd: new Date("2018-02-13"), owner: "Minh6", type: "Public", time: 168, option01: "yes", option02: "no" },
    { id: 7, title: "Vote07", description: "This is a vote 07", dateCreated: new Date("2018-02-07"), dateEnd: new Date("2018-02-14"), owner: "Minh7", type: "Invited", time: 168, option01: "yes", option02: "no" },
    { id: 8, title: "Vote08", description: "This is a vote 08", dateCreated: new Date("2018-02-08"), dateEnd: new Date("2018-02-15"), owner: "Minh8", type: "Public", time: 168, option01: "yes", option02: "no" },
    { id: 9, title: "Vote09", description: "This is a vote 09", dateCreated: new Date("2018-02-09"), dateEnd: new Date("2018-02-16"), owner: "Minh9", type: "Invited", time: 168, option01: "yes", option02: "no" }
];
