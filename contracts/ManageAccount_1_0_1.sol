/**
 * ver 1.0.3
 * 
 * add modifier to control
 *  1 name <> 1 address
 *  1 ID   <> 1 address
 * -----------------------------------------------------
 * ver1.0.2
 *  create account
 *  manage address by array listAddrAcc
 *  update account
 */

pragma solidity ^0.4.18;

contract ManageAccount_1_0_1
{
    struct acc
    {
        string  name;
        bytes8 id;
        uint point;
    }
    mapping (address => acc) private accAt;
    address[] private listAddrAcc;
    
   event LOGaccountCreated(address addr, bytes8 id);
    
   function ManageAccount_1_0_1() public
   {
       //listAddrAcc = [msg.sender];
   }
   function duplicatedID(bytes8 _id) private view returns(bool)
    {
        for(uint i = 0; i < listAddrAcc.length; i++)
        {
            if(accAt[listAddrAcc[i]].id == _id)
            {
                return true; //ID existed
            }
        }
        return false;//ID NOT existed
    }
   
    modifier validID(bytes8 _id)
    {
        require(!duplicatedID(_id));
        _;
    }
    modifier validAddr()
    {
        for(uint i = 0; i < listAddrAcc.length; i++)
        {
            if(msg.sender == listAddrAcc[i])
            {
                revert();
            }
        }
        _;
    }
    
    function createAcc(string _n, bytes8 _id) 
        validID(_id)
        validAddr()
        public returns(uint _idd)
    {
        _idd = listAddrAcc.length;
        listAddrAcc.length++;
        listAddrAcc[_idd] = msg.sender;
        acc memory temp;
        temp.name = _n;
        temp.id = _id;
        temp.point = 0;
        accAt[msg.sender] = temp;
        LOGaccountCreated(msg.sender, temp.id);
        return(_idd);
    }
}