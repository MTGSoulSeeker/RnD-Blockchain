import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ConfirmComponent } from '../confirm/confirm.component';
@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.css']
})
export class DialogConfirmComponent implements OnInit {

  dialogResult = "";
  account = {user:"",pass:"",status:""};

  constructor(public dialog: MatDialog) {
    
   }

  ngOnInit() {
  }

  openDialog() {
    let dialogRef = this.dialog.open(ConfirmComponent, {
      width: '600px',
      data: 'This text is passed into the dialog!'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog closed:` + result.status);
      this.account.user = result.user; 
      this.account.pass = result.pass;    
      this.account.status = result.status;       
    });
  }


}
