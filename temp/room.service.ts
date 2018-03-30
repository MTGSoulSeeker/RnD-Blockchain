import { Injectable } from '@angular/core';
import { Room } from './voterooms/rooms';
import { Rooms } from './voterooms/mock-rooms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RoomInfo } from './voterooms/roomInfo';

@Injectable()
export class RoomService {

  constructor() { }
  getRooms(): Observable<Room[]> {
    // Todo: send the message _after_ fetching the heroes
    //this.messageService.add('HeroService: fetched heroes');
    return of(Rooms);
  }

  getRoom(id: number): Observable<Room> {
    // Todo: send the message _after_ fetching the hero
    //this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(Rooms.find(room => room.id === id));
  }

  // getRoomsInfo(): Observable<RoomInfo> {
  //   // Todo: send the message _after_ fetching the hero
  //   //this.messageService.add(`HeroService: fetched hero id=${id}`);
  //   return of(Rooms);
  // } 
}
