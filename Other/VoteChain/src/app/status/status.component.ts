import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConnectService } from '../connect.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(public thisDialogRef: MatDialogRef<StatusComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _ConnectService: ConnectService) {

  }

  ngOnInit() {
  }

}
