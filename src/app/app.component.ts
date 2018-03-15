import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { ConnectService } from './connect.service';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(private Connect: ConnectService){

  }

  @HostListener('window:load')
  windowLoaded() {
    this.Connect.checkAndInstantiateWeb3();
    this.Connect.onReady();
  }
}
