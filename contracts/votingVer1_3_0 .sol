/**
 * ver 1.2.1
 * 
 * add private/public property of a vote
 * 
 * -----------------------------------------------------
 * ver 1.2.0
 * 
 * create room(s) to vote
 * only add/set option/list voters/cast ballot for opening rooms
 * voted voter cannot cast another vote
 * 
 * -----------------------------------------------------
 * ver1.1.4
 * 
 * add contract event
 * 
 * -----------------------------------------------------
 * ver1.1.3
 * 
 * add modifier to control vote, ballot, 1 address - 1 vote
 * check duplicate option when initiate the contract
 * 
 * -----------------------------------------------------
 * ver1.1.2
 * 
 * update
 *      add expired time: close the vote when time is up-to-date
 *      add list voters who can vote
 *          if the list is left empty, everyone can join the vote
 *          otherwise, only the ones in the list can cast vote
 *      get ballot of an address
 * 
 * -----------------------------------------------------
 * ver1.1.1
 * 
 * update
 *      add algorithm check 1 address - 1 vote
 * add new:
 *  property: 
 *      voted
 *  method:
 *      (none)
 * remove:
 *      (none)
 * 
 * -----------------------------------------------------
 * ver1.1.0
 * 
 * update
 *      VotFor
 *      change the way managing the ballot
 *          voteOf => listVotersOf
 *      getCountOf => getCountOf
 * add new:
 *  property: 
 *      owner
 *      listVotersOf
 *  method:
 *      getListVoterOf
 * remove:
 *      voteOf
 *      getCountOf
 * 
 * -----------------------------------------------------
 * ver1
 * 
 * add option when call the contract
 * vote for an option
 * convert option(bytes32) to string
 * get option vote
 * only available option can be voted
 * 
 */
 
 
 pragma solidity ^0.4.18;
 
 
 contract votingVer1_3_0 
 {
    room[] rooms;
    
    struct room
    {
        address owner;
        uint id;
        string title;
        bool privateRoom;
        Poll[] poll;
        string descript;
        ListVoters listVoters;
        uint expiredTime;
        bool open;
    }
    
    struct Voter
    {
        uint point;
        mapping(uint => Ballot) ballot;//roomID => ballot
    }
    
    struct Ballot
    {
        bool voted;
        bytes32[] voteFor;
    }
    
    struct ListVoters
    {
        mapping (address => Voter) voter;
        address[] addrs;
    }
    
    struct Poll
    {
        string questions;
        bytes32[] options;
        //mapping(bytes32 => address[]) listVotersOf;
        //bytes32[] res;
    }

    
    event LOGroomOpened(uint indexed roomID, address indexed owner,string title, string descript, bool privateRoom, uint expiredTime);
    event LOGaddListVoter(uint indexed roomID, address[] list);
    event LOGpollingAdded(uint indexed roomID,uint indexed pollID, string question, bytes32[] options);
    event LOGpollingOptionAdded(uint indexed roomID,uint indexed pollID, string question, bytes32[] option);
    event LOGroomClosed(uint indexed roomID, bytes result);
    event LOGoptions(uint indexed roomID, bytes[] options);
    event LOGlistVotersOf(uint indexed roomID, bytes option, address[] voters);
    //event roomInfo(uint indexed id, address indexed owner, bytes32[] options, bytes32 description, listVoter);
    event LOGroomResult(uint indexed roomID, bytes option, uint counts, address[] voters);
    
    event LOGvoteNotify(uint indexed roomID, address indexed sender, bytes32[] options);
    
    modifier owned(uint _RoomID)
    {
       require(rooms[_RoomID].owner == msg.sender);
       _;
    }
    
    modifier roomOpening(uint _RoomID) 
    {
        require(checkOpen(_RoomID));
        _;
    }
    
    modifier roomClosed(uint _RoomID) 
    {
        require(!checkOpen(_RoomID));
        _;
    }
    

    modifier listVoterEmpty(uint _RoomID)
    {
        require(rooms[_RoomID].listVoters.addrs.length == 0);
        _;
    }
    
    modifier privateRoom(uint _RoomID)
    {
        require(rooms[_RoomID].privateRoom);
        _;
    }
    
    function votingVer1_3_0()
        public 
    {
        
    }
    
     function openRoom(string _til, bool _privateR, string _des, uint _expiredTime) public returns (uint id)
    {
        id = rooms.length;
        rooms.length++;
        rooms[id].id = id;
        rooms[id].owner = msg.sender;
        rooms[id].descript = _des;
        rooms[id].title = _til;
        rooms[id].privateRoom = _privateR;
        rooms[id].expiredTime = _expiredTime;
        rooms[id].open = true;
        LOGroomOpened(id, rooms[id].owner,rooms[id].title, rooms[id].descript, rooms[id].privateRoom, rooms[id].expiredTime);
    }
    
    function addPoll(uint _roomID, string _quest, bytes32[] _opt) 
            owned(_roomID)
            roomOpening(_roomID)
            public returns(uint pollNo)
    {
        pollNo = rooms[_roomID].poll.length;
        rooms[_roomID].poll.length++;
        rooms[_roomID].poll[pollNo].questions = _quest;
        addPollOption(_roomID, pollNo, _opt);
        LOGpollingAdded(_roomID, pollNo, rooms[_roomID].poll[pollNo].questions, rooms[_roomID].poll[pollNo].options);
    }

    function addPollOption(uint _id, uint _pollNo, bytes32[] _opt) 
            // owned(_id)
            // roomOpening(_id)
            private
    {
        rooms[_id].poll[_pollNo].options = _opt;
        //LOGpollingOptionAdded(_id, _pollNo, rooms[_id].poll[_pollNo].questions[_pollNo], rooms[_id].poll[_pollNo].options[rooms[_id].poll[_pollNo].questions[_pollNo]]);
    }
    
    function getNumberOfPolls(uint _roomID) public view returns(uint)
    {
        return rooms[_roomID].poll.length;
    }
    
    function closeRoom(uint _id) 
            owned(_id) 
            roomOpening(_id) public returns (bool)
    {
        rooms[_id].open = false;
        //calculateRoomResult(_id);
       // LOGroomClosed(rooms[_id].id, rooms[_id].result);
        return true;
    }
    
    function checkOpen(uint _id) private view returns(bool)
    {
        return rooms[_id].open;
    }
    
    
    // function setOption(uint _id, bytes _option) 
    //       // owned(_id) 
    //         //roomOpening(_id)
    //         //optionEmpty(_id)
    //         public returns (bool)
    // {
        
    //     //rooms[_id].options = _option;
    //     //LOGaddOptions(rooms[_id].id, rooms[_id].options);
    //     return true;
    // }
    
    function setListVoters(uint _id, address[] _voters) 
            owned(_id)
            roomOpening(_id)
            privateRoom(_id)
            public returns (bool)
    {
        rooms[_id].listVoters.addrs = _voters;
        LOGaddListVoter(rooms[_id].id, rooms[_id].listVoters.addrs);
        return true;
    }
    
    // function addOption(uint _id, bytes _option) 
    //         owned(_id) 
    //         roomOpening(_id)
    //         public returns(bool)
    // {
    //     rooms[_id].options.push(_option);
    //     return true;
    // }
    
    function voteFor(uint _roomID, bytes32[] _option) public
    {
        assert(!rooms[_roomID].listVoters.voter[msg.sender].ballot[_roomID].voted);
        if(rooms[_roomID].privateRoom)
        {
            for(uint i= 0; i < rooms[_roomID].listVoters.addrs.length ; i++)
            {
                if(msg.sender == rooms[_roomID].listVoters.addrs[i])
                {
                    rooms[_roomID].listVoters.voter[msg.sender].ballot[_roomID].voteFor = _option;
                   rooms[_roomID].listVoters.voter[msg.sender].ballot[_roomID].voted = true;
                    rooms[_roomID].listVoters.voter[msg.sender].point ++;
                    return;
                }
            }
            revert();
        }
        rooms[_roomID].listVoters.voter[msg.sender].ballot[i].voteFor = _option;
        
          
        // for(j = 0; j < getNumberOfPolls(_roomID); j++)
        // {
        //     rooms[_roomID].listVoters.voter[msg.sender].ballot[j].voteFor[j] = _option[j];
        //     //rooms[_roomID].listVoters.voter[msg.sender].ballot[j].
        //     rooms[_roomID].poll[j].listVotersOf[_option[j]].push(msg.sender);
            
        // }
        // rooms[_roomID].listVoters.voter[msg.sender].ballot[_roomID].voted[_roomID] = true;
        // rooms[_roomID].listVoters.voter[msg.sender].point ++;
        // rooms[_roomID].listVoters.addrs.push(msg.sender);
        
        //rooms[_roomID].listVoters.voter[msg.sender].ballot[msg.sender].voteFor[_pollNo] = _option;
    }
    // function getCountOf(uint _roomID, uint _pollNo, bytes32 _option) public view returns(uint)
    // {
    //     return rooms[_roomID].poll[_pollNo].listVotersOf[_option].length;
    // }
    // function VoteFor(uint _id, bytes _option) 
    //             roomOpening(_id)
    //             // validOption(_option) 
    //             // notVoted(msg.sender)  
    //             //hasVoter(msg.sender)
    //             public returns (bool)
    // {   
    //     if(rooms[_id].privateRoom)
    //     {
    //         for(uint i= 0; i < rooms[_id].listVoters.Addrs.length ; i++)
    //         {
    //             if(msg.sender == rooms[_id].listVoters.Addrs[i])
    //             {
    //                 rooms[_id].listVoters.voter[msg.sender].ballot[msg.sender] = _option;
    //                 rooms[_id].listVotersOf[_option].push(msg.sender);
    //                 rooms[_id].listVoters.voter[msg.sender].voted = true;
    //                 rooms[_id].listVoters.voter[msg.sender].point[msg.sender]++;
    //                 LOGvoteNotify(rooms[_id].id,msg.sender, rooms[_id].listVoters.voter[msg.sender].ballot[msg.sender]);
    //             }
    //         }
    //         revert();
    //         return false;
    //     }
    //     rooms[_id].listVoters.voter[msg.sender].ballot[msg.sender] = _option;
    //     rooms[_id].listVoters.voter[msg.sender].voted = true;
    //     rooms[_id].listVotersOf[_option].push(msg.sender);
    //     rooms[_id].listVoters.voter[msg.sender].point[msg.sender]++;
    //     LOGvoteNotify(rooms[_id].id,msg.sender, rooms[_id].listVoters.voter[msg.sender].ballot[msg.sender]);
    //     return true;
    // }
    // function calculateRoomResult(uint _id) private returns(bytes)
    // {
    //     bytes memory res;
    //     uint temp;
    //     res = rooms[_id].options[0];
    //     temp = getCountOf(_id, rooms[_id].options[0]);
    //     for(uint i = 1; i < rooms[_id].options.length; i++)
    //     { 
    //         if(temp < getCountOf(_id, rooms[_id].options[i]))
    //         {
    //             temp = getCountOf(_id, rooms[_id].options[i]);     
    //             res = rooms[_id].options[i];
    //         }
    //     }
    //     rooms[_id].result = res;
    //     return rooms[_id].result;
    // }
    
    // function getRoomResult(uint _id) roomClosed(_id) public view returns(bytes)
    // {
    //     return rooms[_id].result;
    // }
    
    // function getCountOf(uint _id, bytes _option) public constant returns(uint){
    //     //require(vailableCandidate(_addr));
    //     return rooms[_id].listVotersOf[_option].length;
    // }
    
    // function getListVoterOf(uint _id, bytes _option) public view returns(address[])
    // {
    //     return rooms[_id].listVotersOf[_option];
    // }
    // function getOptions(uint _id) public view returns(bytes[])
    // {
    //     return rooms[_id].options;
    // }
    
    // function getVoteOf(uint _id, address _addr) public view returns(bytes)
    // {
    //     if(rooms[_id].listVoters.voter[_addr].voted == true)
    //     {
    //         return (rooms[_id].listVoters.voter[_addr].ballot[_addr]);
    //     }
    // }
    
    
//     function checkInitiateOption(bytes32[] _option) private pure returns(bool)
//     {
//         for(uint i = 0; i <= _option.length - 1; i++){
//             var temp = _option[i];
//             for(uint j = i+1; j <= _option.length-1; j++){
//                 if (temp == _option[j] )
//                 {
//                     return false;
//                 }
//             }
//         }
//         return true;
//     }
    
    
    
    
//   function checkVailableOption(bytes32 _n) private view returns(bool)
//     {
//         for(uint i = 0; i < opt.length; i++)
//         {
//             if(opt[i] == _n)
//             {
//                 return true;
//             }    
//         }
//         return false;
//     }
    
//     function checkVailableVoter(address _addr) private view returns(bool)
//     {
//         for(uint i = 0; i < voters.length; i++)
//         {
//             if(voters[i] == _addr)
//             {
//                 return true;
//             }
//         }
//         return false;
//     }

//     modifier validInitiate(bytes32[] _option) 
//     {
//         if(_option.length != 0)
//         {
//             require(checkInitiateOption(_option));    
//         }
        
//         _;    
//     }
//     modifier validOption(bytes32 _option)
//     {
//         require(!checkVailableOption(_option));
//         _;
       
//     }
//     modifier notVoted(address _addr)
//     {
       
//         require(voted[_addr] == false);
//         _;
       
//     }
//     // modifier validVoter(address _addr)
//     // {
//     //     require(checkVailableVoter(_addr));
//     //     _;
        
//     // }
    // modifier hasVoter(address _addr){
    //     if(voters.length != 0)
    //     {
    //         require(checkVailableVoter(_addr) == true);    
    //     }
    //     _;
       
    // }
    
//     function addOption(bytes32 _n) 
//             validOption(_n)
//             public
//     {
//         notify(msg.sender, bytes32ToString(_n), "option added");
//         opt.push(_n);
//     }
//     function addVoter(address _addr) public
//     {
//         voters.push(_addr);
//     }
    
//     function getOptions() public view returns(bytes32[])
//     {
//         return opt;
//     }
     
//     function getListVoters() public view returns(address[])
//     {
//         return voters;
//     }
    
//     function getOptionByIndex(uint _i) private view returns(string)
//     {
//         return bytes32ToString(opt[_i]);
//     }
    
    
    function bytes32ToString(bytes32 x) public pure returns (string) 
    {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) 
        {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) 
            {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) 
        {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }
//   /* 
//     modifier validopt(bytes32 _n){
//         for(uint i=0; i < opt.length; i++){
//             if(opt[i] == _n){
//                 return true;
//             }   
//         }
//         return false;
//         _;
        
//     }
//     */

//     function VoteFor(bytes32 _option) 
//                 validOption(_option) 
//                 notVoted(msg.sender)  
//                 hasVoter(msg.sender)
//                 public
//     {
//         ballotOf[msg.sender] = _option;
//         listVotersOf[_option].push(msg.sender);
//         voted[msg.sender] = true;
//         notify(msg.sender, bytes32ToString(_option), "voted");
//     }
 }