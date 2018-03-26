pragma solidity ^0.4.18;

import "./ManageAccount12.sol";

contract voting12 is ManageAccount12
 {
    room[] rooms;

    
    struct room
    {
        address owner;
        uint id;
        string title;
        string descript;
        bool privateRoom;
        Poll[] poll;
        ListVoters listVoters;
        uint expiredTime;
        bool open;
        mapping(bytes32 => address[]) listVotersOf;
    }

    struct Voter
    {

        bytes32[] ballot;//roomID => ballot
        bool voted;//roomID => ballot
    }
    
    // struct Ballot
    // {
    //     bool voted;
    //     bytes32[] voteFor;
    // }
    
    struct ListVoters
    {
        mapping (address => Voter) voter;
        address[] addrs;
    }
    
    struct Poll
    {
        string questions;
        bytes32[] options;
        //bytes32[] res;
    }
    
    event LOGroomOpened(uint indexed roomID, address indexed owner,string title, string descript, bool privateRoom, uint expiredTime);
    event LOGaddListVoter(uint indexed roomID, address[] list);
    event LOGpollingAdded(uint indexed roomID,uint indexed pollID, string question, bytes32[] options);
    //event LOGpollingOptionAdded(uint indexed roomID,uint indexed pollID, string question, bytes32[] option);
    event LOGroomClosed(uint indexed roomID);
    event LOGoptions(uint indexed roomID, bytes[] options);
    event LOGlistVotersOf(uint indexed roomID, bytes option, address[] voters);
    //event roomInfo(uint indexed id, address indexed owner, bytes32[] options, bytes32 description, listVoter);
    event LOGroomResult(uint indexed roomID, bytes option, uint counts, address[] voters);
    
    event LOGvoteNotify(uint indexed roomID, address indexed sender, bytes32[] options);
    event LOGcountOf(uint roomID, uint pollNo, bytes32 option, uint count);
    event LOGvoterOf(uint roomID, uint pollNo, bytes32 option, address[] voter);
    
    
    modifier owned(uint _RoomID)
    {
       require(rooms[_RoomID].owner == msg.sender);
       _;
    }
    
    modifier roomOpening(uint _RoomID) 
    {
        require(rooms[_RoomID].open);
        _;
    }
    
    modifier roomClosed(uint _RoomID) 
    {
        require(!rooms[_RoomID].open);
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
    
    modifier validBallot(uint _roomID, bytes32[] _option)
    {
        if(_option.length != getNumberOfPolls(_roomID))
        {
            revert();
        }
        uint a = 0;
        for(uint i = 0; i < getNumberOfPolls(_roomID); i++)
        {
            for(uint j = 0; j < rooms[_roomID].poll[i].options.length; j++)
            {
                if(_option[i] == rooms[_roomID].poll[i].options[j])
                {
                    a++;
                }
            }
        }
        if(a != getNumberOfPolls(_roomID))
        {
            revert();
        }
        _;
    }
    
    modifier duplicateOption(bytes32[] _options)
    {
        for(uint i = 0; i < _options.length-1; i++)
        {
            if(_options[i] == _options[i++])
            {
                revert();
            }
        }
        _;
    }
    
    modifier notVoted(uint _roomID)
    {
        require(!rooms[_roomID].listVoters.voter[msg.sender].voted);
        _;
    }
    
    function checkVailableVoter(uint _roomID, address _voter) public view returns(bool)
    {
        for(uint i= 0; i < rooms[_roomID].listVoters.addrs.length ; i++)
            {
                if(_voter == rooms[_roomID].listVoters.addrs[i])
                {
                   return true;
                }
            }
        return false;
    }
    
    modifier vailableVoter(uint _roomID, address _voter)
    {
         require(checkVailableVoter(_roomID, _voter));
        _;
    }
    
    function voting()
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
            duplicateOption(_opt)
            roomOpening(_roomID)
            public returns(uint pollNo)
    {
        pollNo = rooms[_roomID].poll.length;
        rooms[_roomID].poll.length++;
        rooms[_roomID].poll[pollNo].questions = _quest;
        rooms[_roomID].poll[pollNo].options = _opt;
         LOGpollingAdded(_roomID, pollNo, rooms[_roomID].poll[pollNo].questions, rooms[_roomID].poll[pollNo].options);
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
        for(uint i = 0; i < rooms[_id].poll.length; i++)
        {
            for(uint j = 0; j < rooms[_id].poll[i].options.length; j++)
            {
               LOGcountOf(_id, j, rooms[_id].poll[i].options[j], rooms[_id].listVotersOf[rooms[_id].poll[i].options[j]].length);  
               LOGvoterOf(_id, j, rooms[_id].poll[i].options[j], rooms[_id].listVotersOf[rooms[_id].poll[i].options[j]]);
            }
        }
        //calculateRoomResult(_id);
       // LOGroomClosed(rooms[_id].id, rooms[_id].result);
        return true;
    }
    
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

    function voteForPrivateRoom(uint _roomID, bytes32[] _options)
        vailableVoter(_roomID, msg.sender)
        private 
    {
        rooms[_roomID].listVoters.voter[msg.sender].ballot = _options;
        rooms[_roomID].listVoters.voter[msg.sender].voted = true;
        //rooms[_roomID].listVoters.addrs.push(msg.sender);
        account[msg.sender].point++;
        //rooms[_roomID].listVoters.voter[msg.sender].account.acount[msg.sender].point ++;
        addToListVoteOf(_roomID, _options);
         LOGvoteNotify(rooms[_roomID].id, msg.sender, rooms[_roomID].listVoters.voter[msg.sender].ballot);
         LOGaccountInfo(account[msg.sender].id, msg.sender, account[msg.sender].point);
    }

    function voteFor(uint _roomID, bytes32[] _options)
        roomOpening(_roomID)
        notVoted(_roomID)
        validBallot(_roomID, _options)
        public
    {
        if(rooms[_roomID].privateRoom)
        {
            voteForPrivateRoom(_roomID, _options);
            return;
        }
        rooms[_roomID].listVoters.voter[msg.sender].ballot = _options;
        rooms[_roomID].listVoters.voter[msg.sender].voted = true;
        rooms[_roomID].listVoters.addrs.push(msg.sender);
        account[msg.sender].point++;
       // rooms[_roomID].listVoters.voter[msg.sender].account.point ++;
        addToListVoteOf(_roomID, _options);
         LOGvoteNotify(rooms[_roomID].id, msg.sender, rooms[_roomID].listVoters.voter[msg.sender].ballot);
         LOGaccountInfo(account[msg.sender].id, msg.sender, account[msg.sender].point);
    }
    
    function addToListVoteOf(uint _roomID, bytes32[] _option) private 
    {
        for(uint i=0; i <  _option.length; i++)
        {
            rooms[_roomID].listVotersOf[_option[i]].push(msg.sender);
            //emit LOGcountOf(_roomID, i, _option[i], rooms[_roomID].listVotersOf[_option[i]].length);
        }
    }
    
    function setListVotersByID(uint _roomID, bytes8[] _ids) 
            owned(_roomID)
            roomOpening(_roomID)
            privateRoom(_roomID)
            public returns (bool)
    {
        for(uint i = 0; i < listAddressAccount.length; i++)
        {
            for(uint j = 0; j < _ids.length; j++)
            {
                if(account[listAddressAccount[i]].id == _ids[j])
                {
                    rooms[_roomID].listVoters.addrs.push(listAddressAccount[i]);
                }
            }
        }
         LOGaddListVoter(rooms[_roomID].id, rooms[_roomID].listVoters.addrs);
        return true;
    }
    function getListVoterOf(uint _roomID) public view returns(address[])
    {
        return  rooms[_roomID].listVoters.addrs;
    }
    
    function getVoterPoint() public view returns(uint)
    {
        return account[msg.sender].point;
    }
    
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
 }