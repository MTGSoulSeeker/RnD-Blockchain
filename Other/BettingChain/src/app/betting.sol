pragma solidity ^0.4.16;
interface betInterface {
    function checkValidID(string _id) public constant returns (bool);
     
    function checkValidAddr(address _addr) public constant returns (bool);
   
    function getAddrByID(string _id) public constant returns (address);
    
    function setBettor(string _id) public;
    function getBettors() public constant returns (address[]);
    
    function getBettorByNum(uint i) public view returns (address, string, uint);
    function getBettorByID(string _id) public view returns (address, string, uint);
    
    
    function setSenderOption(uint _opt) public;
    function getSenderOption() public constant returns(uint);
    function getOptionByID(string _id) public constant returns(uint);
    
    function generateResult() public returns (uint);
   
   function checkValidWinner() public constant returns(bool);
   

   
    
}
contract bet is betInterface{
    struct bettor{
        uint option;
        string id;
    }
    address winner;
    mapping (address => bettor) bettors;
    address[] bettorsAddr;
    uint res;
    
    function bet() public {
        winner = 0x000;
        res = 0;
    }
    
    
    function checkValidID(string _id) public constant returns (bool){
         for (uint i = 0; i < bettorsAddr.length; i++){
            var b = bettors[bettorsAddr[i]];
            if(keccak256(b.id) == keccak256(_id)){
                return true;
            }
        }
        return false;
    }
    
    function checkValidAddr(address _addr) public constant returns (bool){
        for (uint i = 0; i < bettorsAddr.length; i++){
            var b = bettorsAddr[i];
            if(keccak256(b) == keccak256(_addr)){
                return true;
            }
        }
        return false;
    }
    
    function setBettor(string _id) public {
        require(!checkValidAddr(msg.sender));
        require(!checkValidID(_id));
        var b = bettors[msg.sender];
        b.option = 0;
        b.id = _id;
        bettorsAddr.push(msg.sender) -1;
    }
    
    /*function length() public constant returns(uint){
        return bettorsAddr.length;
    }*/
    
     function getAddrByID(string _id) public constant returns (address){
         for (uint i = 0; i < bettorsAddr.length; i++){
            var b = bettors[bettorsAddr[i]];
            if(keccak256(b.id) == keccak256(_id)){
                return (bettorsAddr[i]);
            }
        }
        return (0x000);
     }
    
    function getBettorByNum(uint i) public view returns (address, string, uint) {
        var b = bettors[bettorsAddr[i]];
        return (bettorsAddr[i], b.id, b.option);
    }
    
    function getBettorByID(string _id) public view returns (address, string, uint) {
        for (uint i = 0; i < bettorsAddr.length; i++){
            var b = bettors[bettorsAddr[i]];
            if(keccak256(b.id) == keccak256(_id)){
                return (bettorsAddr[i], bettors[bettorsAddr[i]].id, bettors[bettorsAddr[i]].option);
            }
        }
        return (0x000, "None", 0);
    }
    
    function getBettors() public constant returns (address[]) {
        return bettorsAddr;
    }
    
    function setSenderOption(uint _opt) public {
        var b = bettors[msg.sender];
        b.option = _opt;
    }
    
    function getSenderOption() public constant returns(uint){
        var b = bettors[msg.sender];
        return b.option;
    }
    
    function getOptionByID(string _id) public constant returns(uint){
        return bettors[getAddrByID(_id)].option;
    }
    
    
    function generateResult() public returns (uint){
        res = uint(block.blockhash(block.number-1))%100 + 1;
        return res;
    }
    
    function checkValidWinner() public constant returns(bool){
        for (uint i = 0; i < bettorsAddr.length; i++){
            var b = bettors[bettorsAddr[i]];
            if(b.option == res){
                winner = bettorsAddr[i];
                return true;
            }
        }
        return false;
    }

}