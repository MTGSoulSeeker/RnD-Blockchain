import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Md5 } from 'ts-md5/dist/md5';
import { ScrollToModule } from 'ng2-scroll-to';
import { MatCardModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';
import { CountdownTimerModule } from 'ngx-countdown-timer';
import { filterPipe } from './pipes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { VoteroomsComponent } from './voterooms/voterooms.component';
import { AppRoutingModule } from './/app-routing.module';
import { IntroduceComponent } from './introduce/introduce.component';
import { DiscoverComponent } from './discover/discover.component';
import { ConnectService } from './connect.service';
import { RegisterComponent } from './register/register.component';
import { EqualValidator } from './register/equal-validator.directive';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { RoomComponent } from './room/room.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ResultComponent } from './result/result.component';
import { RoomcreateComponent } from './roomcreate/roomcreate.component';
import { TestComponent } from './test/test.component';
import { StatusComponent } from './status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    VoteroomsComponent,
    IntroduceComponent,
    DiscoverComponent,
    RegisterComponent,
    EqualValidator,
    ContactComponent,
    FaqComponent,
    RoomComponent,
    DialogConfirmComponent,
    ConfirmComponent,
    filterPipe,
    ResultComponent,
    RoomcreateComponent,
    TestComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ScrollToModule.forRoot(),
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    CountdownTimerModule.forRoot(),
    NgbModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  entryComponents: [
    ConfirmComponent,
    ResultComponent
  ],
  providers: [Md5, ConnectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
