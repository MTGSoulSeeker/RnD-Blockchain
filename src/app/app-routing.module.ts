import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntroduceComponent } from './introduce/introduce.component';
import { DiscoverComponent } from './discover/discover.component';
import { VoteroomsComponent } from './voterooms/voterooms.component';
import { RegisterComponent } from './register/register.component';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { RoomComponent } from './room/room.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { ResultComponent } from './result/result.component';
import { RoomcreateComponent } from './roomcreate/roomcreate.component';
import { TestComponent } from './test/test.component';
import { StatusComponent } from './status/status.component';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IntroduceComponent },
  { path: 'discover', component: DiscoverComponent },
  { path: 'vote-rooms', component: VoteroomsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'room/:id', component: RoomComponent },
  { path: 'create', component: RoomcreateComponent },
  { path: 'test', component: TestComponent },
  { path: 'status', component: StatusComponent },
  { path: 'userinfo/:id', component: UserinfoComponent },
  { path: 'error', component: ErrorComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}