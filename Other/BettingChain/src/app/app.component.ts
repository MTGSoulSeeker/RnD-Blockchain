import { Component, HostListener, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Rx';
import { open } from 'fs';

const web3 = require('web3');
const contract = require('truffle-contract');

declare var window:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  web3:any;
  betContract:any;
  betFunction:any;
  listID:any[];
  listBettor:any;
  data: any;
  public list = new Subject<string[]>();

  constructor(private _ngZone: NgZone) {
    this.listID = [];
  }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new web3(new web3.providers.HttpProvider('http://127.0.0.1:8545')
      );
    }
    console.log(web3);
  };

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.
    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
        
      }
      this.betContract = this.web3.eth.contract([ { "constant": true, "inputs": [], "name": "getListAccAddr", "outputs": [ { "name": "", "type": "address[]", "value": [ "0xeae87aa84e8dc6dbe75411ab11679f96f6a21b75" ] } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "getAge", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "add2list", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "getFullAcc", "outputs": [ { "name": "", "type": "string", "value": "" }, { "name": "", "type": "bytes8", "value": "0x0000000000000000" }, { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "getName", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "string" }, { "name": "_id", "type": "bytes8" }, { "name": "_age", "type": "uint8" } ], "name": "createAcc_sender2", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "bytes8" }, { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_name", "type": "string" }, { "name": "_id", "type": "bytes8" }, { "name": "_age", "type": "uint8" } ], "name": "createAcc_sender", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_addr", "type": "address" } ], "name": "getID", "outputs": [ { "name": "", "type": "bytes8", "value": "0x0000000000000000" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_addr", "type": "address" }, { "name": "_name", "type": "string" }, { "name": "_id", "type": "bytes8" }, { "name": "_age", "type": "uint8" } ], "name": "createAcc", "outputs": [ { "name": "", "type": "string" }, { "name": "", "type": "bytes8" }, { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "", "type": "string" }, { "indexed": false, "name": "", "type": "bytes8" }, { "indexed": false, "name": "", "type": "uint8" } ], "name": "accEvent", "type": "event" } ]);
      this.betFunction = this.betContract.at('0x8440E45288F610022BB4A6e35B98621C09A681E4');
      
      console.log("What is "+ this.betContract);
      console.log(this.betFunction);

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution      
      this._ngZone.run;
    });  
    
  };


  setInstructor(){    
    this.web3.eth.defaultAccount = this.web3.eth.accounts[12];  
    this.betFunction.createAcc_sender("12asd1z2", "12934", 18, (err, res)=> {console.log(res);console.log(err);}); 
  }


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  /*web3:any;
  account: any;
  accounts: any;

  title = 'app';
  winner:string = "";
  prize:number=0;
  listBettors = [{
      id: '0x13gS4QH1YYpPFWX2az31xEyPtp2SLGbHvd',
      bet: 0,
      amount: 100,
      option: 0
    },
    {
      id: '0x19k97ujLGCK32QrESWTvvdwrsqPk9wpzoR',
      bet: 0,
      amount: 100,
      option: 0
    }
  ];
  randomNumber: number;
  flag: number;
    
  
  constructor(private _ngZone: NgZone) {
    
  }

  @HostListener('window:load')
  windowLoaded() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If you find that your accounts don\'t appear or you have 0 MetaCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
      this.web3 = new web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new web3(
        new web3.providers.HttpProvider('http://127.0.0.1:8545')
      );
    }
    console.log(web3);
  };

  onReady = () => {
    // Bootstrap the MetaCoin abstraction for Use.

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert(
          'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'
        );
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];
      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution      
      console.log(this.account);
      console.log(this.accounts);
      this._ngZone.run;
    });
  };

  getAccount(){
    console.log(this.account);
    return this.accounts;
  }
  randomInt(min, max) {
    this.randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  setOption(index: number, n: number) {
    this.listBettors[index].option = n;
  }

  checkBalance(index:number, n:number){
    if (this.listBettors[index].bet <= this.listBettors[index].amount){
      this.listBettors[index].bet = n;
      this.listBettors[index].amount = this.listBettors[index].amount - n;
      this.prize= this.prize + n*1;
      console.log(this.listBettors[index], this.prize);
    }
    else{
      alert("Not enough money");
    }
  }

  findWinner() {
    if (this.randomNumber >= 50){
      this.flag = 2;
      console.log(this.flag);
    }else{
      this.flag = 1;
      console.log(this.flag);
    }
    for (var i=0 ; i<this.listBettors.length; i++) {
      if (this.listBettors[i].option==this.flag) {
        this.winner = this.listBettors[i].id
        this.listBettors[i].amount += this.prize;
        console.log(this.winner,this.listBettors[i]);
      }
    }
  }*/


}
