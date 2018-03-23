pragma solidity ^0.4.18;
 
 contract votingVer1_2_0
 {
    room[] rooms;
    
    struct room
    {
        uint id;
        address owner;
        bytes32[] options;
        string descript;
        mapping(bytes32 => address[]) listVotersOf;
        ListVoters listVoters;
        uint expiredTime;
        bool open;
    }
    
    struct Voter
    {
        mapping(address => bytes32) ballot;
        bool voted;
    }
    
    struct ListVoters
    {
        mapping (address => Voter) voter;
        address[] Addrs;
    }
    
    
    
    event EVroomOpened(uint indexed id, address indexed owner, uint expiredTime);
    event EVaddListVoter(uint indexed id, address[] list);
    event EVaddOptions(uint indexed id, bytes32[] options);
    event EVroomClosed(uint indexed id);
    //event roomInfo(uint indexed id, address indexed owner, bytes32[] options, bytes32 description, listVoter);
    event EVroomResult(uint indexed id, bytes32 option, uint counts, address[] voters);
    event EVvoteNotify(uint indexed id, address indexed sender, string option);
    
    modifier owned(uint id)
    {
        if(rooms[id].owner == msg.sender){
            _;    
        }
        
    }
    modifier roomOpening(uint _id) 
    {
        require(checkOpen(_id));
        _;
    }
    modifier optionEmpty(uint _id)
    {
        require(rooms[_id].options.length == 0);
        _;
    }
    modifier listVoterEmpty(uint _id)
    {
        require(rooms[_id].listVoters.Addrs.length == 0);
        _;
    }
    
    function votingVer1_2_0()
        public 
    {
        
    }
    
    function openRoom(string _des, uint _expiredTime) public returns (uint id)
    {
        id = rooms.length;
        rooms.length++;
        rooms[id].id = id;
        rooms[id].owner = msg.sender;
        rooms[id].descript = _des;
        rooms[id].expiredTime = _expiredTime;
        rooms[id].open = true;
        EVroomOpened(id, rooms[id].owner,rooms[id].expiredTime);
    }
    function closeRoom(uint _id) 
            owned(_id) 
            roomOpening(_id) public returns (bool)
    {
        rooms[_id].open = false;
        EVroomClosed(rooms[_id].id);
        return true;
    }
    
    function checkOpen(uint _id) private view returns(bool)
    {
        return rooms[_id].open;
    }
    
    
    
    function setOption(uint _id, bytes32[] _option) 
            owned(_id) 
            roomOpening(_id)
            optionEmpty(_id)
            public returns (bool)
    {
        rooms[_id].options = _option;
        EVaddOptions(rooms[_id].id, rooms[_id].options);
        return true;
    }
    function setListVoters(uint _id, address[] _voters) 
            owned(_id)
            roomOpening(_id)
            public returns (bool)
    {
        rooms[_id].listVoters.Addrs = _voters;
        EVaddListVoter(rooms[_id].id, rooms[_id].listVoters.Addrs);
        return true;
    }
    function addOption(uint _id, bytes32 _option) 
            owned(_id) 
            roomOpening(_id)
            public returns(bool)
    {
        rooms[_id].options.push(_option);
        return true;
    }
    
    
    
    function VoteFor(uint _id, bytes32 _option) 
                roomOpening(_id)
                // validOption(_option) 
                // notVoted(msg.sender)  
                // hasVoter(msg.sender)
                public
    {
        rooms[_id].listVoters.voter[msg.sender].ballot[msg.sender] = _option;
        rooms[_id].listVoters.voter[msg.sender].voted = true;
        rooms[_id].listVotersOf[_option].push(msg.sender);
        EVvoteNotify(rooms[_id].id,msg.sender, bytes32ToString(rooms[_id].listVoters.voter[msg.sender].ballot[msg.sender]));
    }
    function getRoomResult(uint _id) public view returns(bytes32)
    {
        bytes32 res;
        uint temp;
        res = rooms[_id].options[0];
        temp = getCountOf(_id, rooms[_id].options[0]);
        for(uint i = 1; i < rooms[_id].options.length; i++)
        { 
            if(temp < getCountOf(_id, rooms[_id].options[i]))
            {
                temp = getCountOf(_id, rooms[_id].options[i]);     
                res = rooms[_id].options[i];
            }
        }
        return res;
    }
    function getCountOf(uint _id, bytes32 _option) public constant returns(uint){
        //require(vailableCandidate(_addr));
        return rooms[_id].listVotersOf[_option].length;
    }
    
    function getListVoterOf(uint _id, bytes32 _option) public view returns(address[])
    {
        return rooms[_id].listVotersOf[_option];
    }
    function getOptions(uint _id) public view returns(bytes32[])
    {
        return rooms[_id].options;
    }
    
    function getVoteOf(uint _id, address _addr) public view returns(bytes32)
    {
        if(rooms[_id].listVoters.voter[_addr].voted == true)
        {
            return (rooms[_id].listVoters.voter[_addr].ballot[_addr]);
        }
        return 0x00;
    }
    
    
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
//     modifier hasVoter(address _addr){
//         if(voters.length != 0)
//         {
//             require(checkVailableVoter(_addr) == true);    
//         }
//         _;
       
//     }
    
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