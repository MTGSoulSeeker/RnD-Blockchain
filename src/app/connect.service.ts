import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const web3 = require('web3');
const contract = require('truffle-contract');
const VotingABI = require('../../build/contracts/votingVer1_3_2.json');
const AccountABI = require('../../build/contracts/ManageAccount_1_0_1.json');

declare var window: any;

@Injectable()
export class ConnectService {

  web3: any;
  VotingContract = contract(VotingABI);
  AccountContract = contract(AccountABI);
  account: any;


  constructor(private _ngZone: NgZone) {
    this.account = "";
  }

  checkAndInstantiateWeb3 = () => {
    //Check if using Mist or Metamask
    if (typeof window.web3 !== 'undefined') {
      console.warn('Using web3 detected from Mist.Metamask.');
      this.web3 = new web3(window.web3.currentProvider);
    } else {
      //Using localhost
      console.warn('No web3 detected. Connect to http://127.0.0.1:8545.');
      this.web3 = new web3(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
    }
    console.log(web3);
  };

  onReady = () => {
    //Add Contract
    this.VotingContract.setProvider(this.web3.currentProvider);
    this.AccountContract.setProvider(this.web3.currentProvider);
    //Get all accounts
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
      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution      
      this._ngZone.run;
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  addToList(account) {
    console.log("Ahihi: " + account);

    this.AccountContract
      .deployed()
      .then(function (instance) {
        instance.add2list({
          from: account
        })
          .then(function (v) {
            console.log(v)
          });
      })
      .catch(err => {
        console.log(err)
      });
  }

  newAccount(pass) {
    this.web3.personal.newAccount(pass, (err, res) => {
      console.log(res);
      console.log(err);
      this.account = res;
    });
  }

  unlockAccount(pass) {
    this.web3.personal.unlockAccount(this.account, pass, 15000, (err, res) => {
      console.log(res);
      console.log(err);
    });
  }

  lockAccount(acc) {
    this.web3.personal.lockAccount(acc, (err, res) => {
      console.log(res);
      console.log(err);
    });
  }

  sendMoney() {
    this.web3.eth.sendTransaction({
      from: this.web3.eth.coinbase,
      to: this.account,
      value: this.web3.toWei(10, "ether")
    }, (err, res) => {
      console.log(res);
      console.log(err);
    });
    while (this.web3.eth.getBalance(this.account) == 0) {
      console.log("Waiting for money");
    }
  }

  async createAccount(username: string, bid: string, age: number, password: string) {

    this.newAccount(password);
    await this.delay(2000);
    this.unlockAccount(password);
    await this.delay(2000);
    this.sendMoney();

    let acc = this.account;
    let self = this;

    this.AccountContract
      .deployed()
      .then(function (temp) {
        console.log(acc);
        temp.createAcc1(username, bid, age, { from: acc, gas: 300000 })
          .then(function (v) {
            console.log(v)
          })
      })
      .catch(err => {
        console.log(err)
      });

    // this.AccountContract
    //   .deployed()
    //   .then(function (temp) {
    //     self.web3.personal.newAccount(password, (err, res) => {
    //       console.log(res);
    //       console.log(err);
    //       self.account = res;
    //     })
    //       .then(function (temp02) {
    //         self.web3.personal.unlockAccount(self.account, password, (err, res) => {
    //           console.log(res);
    //           console.log(err);
    //         })
    //       })
    //       .then(function (temp03) {
    //         self.web3.eth.sendTransaction({
    //           from: this.web3.eth.coinbase,
    //           to: this.account,
    //           value: this.web3.toWei(10, "ether")
    //         }, (err, res) => {
    //           console.log(res);
    //           console.log(err);
    //         })
    //           .then(function (temp04) {
    //             temp04.createAcc1(username, bid, age, { from: self.account, gas: 300000 })
    //               .then(function (v) {
    //                 console.log(v)
    //               })
    //           })
    //       })
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   });

    //this.lockAccount(account);
    // await this.delay(2000);
    // this.addToList(account);
  }
  
}
