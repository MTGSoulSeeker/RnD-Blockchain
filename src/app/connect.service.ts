import { Component, OnInit} from '@angular/core';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

const Web3API = require('web3');
const contract = require('truffle-contract');
const VotingABI = require('../../build/contracts/voting12.json');

declare var window: any;

@Injectable()
export class ConnectService {

  web3: any;
  VotingContract = contract(VotingABI);

  constructor() {
     //Check if using Mist or Metamask
     if (typeof window.web3 !== 'undefined') {
      console.warn('Using web3 detected from Mist.Metamask.');
      this.web3 = new Web3API(window.web3.currentProvider);
    }
    else {
      //Using localhost
      console.warn('No web3 detected. Connect to http://127.0.0.1:8545.');
      this.web3 = new Web3API(new Web3API.providers.HttpProvider('http://127.0.0.1:8545'));
    }
    this.VotingContract.setProvider(this.web3.currentProvider);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
