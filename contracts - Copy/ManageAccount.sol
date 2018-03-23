/**
 * ver1.1
 * checkValidAddr  -> checkVailabledAddr
 * checkValidAccAt -> checkVailabledAccAt
 * 
 * add modifier
 *  
 *---------------------------------------------------------------------------------------------------
 * ver1
 *  1 name <> 1 address
 *  1 ID   <> 1 address
 * 
 *  create account
 *  manage address by array listAddrAcc
 *  update account
 */

pragma solidity ^0.4.18;

contract ManageAccount {
  struct Acc {
    string name;
    bytes8 id;
    uint age;
  }
  mapping(address => Acc) private accAt;
  address[] private listAddrAcc;

  function ManageAccount() public {
    //listAddrAcc = [msg.sender];
  }




  function createAcc(address _addr, string _n, bytes8 _id, uint _age) public returns(uint _idd) {
    _idd = listAddrAcc.length;
    listAddrAcc.length++;
    listAddrAcc[_idd] = _addr;
    Acc memory temp;
    temp.name = _n;
    temp.id = _id;
    temp.age = _age;
    accAt[_addr] = temp;
    return (_idd);
  }

  function createAcc1(string _n, bytes8 _id, uint _age) public returns(uint _idd) {
    _idd = listAddrAcc.length;
    listAddrAcc.length++;
    listAddrAcc[_idd] = msg.sender;
    Acc memory temp;
    temp.name = _n;
    temp.id = _id;
    temp.age = _age;
    accAt[msg.sender] = temp;
    return (_idd);
  }


  function getMsgSender() public view returns(address) {
    return msg.sender;
  }

  /**
   * After create accout, must call add2List to add the address to listAddrAcc
   */




  function add2List(address _addr) public {
    listAddrAcc.push(_addr);
  }




  function getFullAcc(address _addr) public view returns(string, bytes8, uint) {
    //var temp = accAt[_addr];
    return (accAt[_addr].name, accAt[_addr].id, accAt[_addr].age);
  }


  function getListAddrAcc() public view returns(address[]) {
    return listAddrAcc;
  }
}
