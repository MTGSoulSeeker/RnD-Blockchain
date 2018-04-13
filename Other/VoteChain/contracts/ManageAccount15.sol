pragma solidity ^0.4.18;
 
contract ManageAccount15
{
    struct Account
    {
        bytes8 id;
        uint point;
    }
    mapping (address => Account) account;
    address[] public listAddressAccount;
    
    event LOGaccountInfo(bytes8 id, address addr, uint point);
    
   function ManageAccount15() public
   {

   }
   
    modifier validID(bytes8 _id)
    {
         for(uint i = 0; i < listAddressAccount.length; i++)
        {
            if(account[listAddressAccount[i]].id == _id)
            {
                revert();
            }
        }
        _;
    }
    modifier validAddr()
    {
        for(uint i = 0; i < listAddressAccount.length; i++)
        {
            if(msg.sender == listAddressAccount[i])
            {
                revert();
            }
        }
        _;
    }
    
    function createAcc(bytes8 _id) 
        validID(_id)
        validAddr
        public returns(bool)
    {
        Account memory temp;
        temp.id = _id;
        temp.point = 0;
        account[msg.sender] = temp;
        listAddressAccount.push(msg.sender);
        LOGaccountInfo(temp.id, msg.sender, temp.point);
        return true;
    }
    function getListAccounts() public view returns(address[])
    {
        return listAddressAccount;
    }
    function getAccountInfo() public view returns(bytes8)
    {
        return account[msg.sender].id;
    }
}
 