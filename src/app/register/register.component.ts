import { Component, OnInit } from '@angular/core';
import { User } from './user.interface';
import { Md5 } from 'ts-md5/dist/md5';
import { ConnectService } from '../connect.service';

@Component({
  moduleId: module.id,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  constructor(private _md5: Md5, private _connectService: ConnectService) {

  }

  public user: User;

  ngOnInit() {
    this.user = {
      username: '',
      id: '',
      age: 18,
      password: '',
      confirmPassword: ''
    }
  }

  save(model: User, isValid: boolean) {
    // call API to save customer
    console.log(model, isValid);
  }

  createAccount(tempUser: User, isValid: boolean){
    this._connectService.createAccount(tempUser.username,tempUser.id,tempUser.age,tempUser.password);
  }

}

