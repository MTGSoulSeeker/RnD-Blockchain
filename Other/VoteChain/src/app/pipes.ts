import { Pipe, PipeTransform } from '@angular/core';
import { Room } from './voterooms/rooms';
import { Component } from '@angular/core';

@Pipe({ name: 'filterPipe' })
export class filterPipe {
    transform(value: Room[], input: string) {
        if (input != 'All') {
            return value.filter(room => {
                return room.type == input;
            });
        }
        else {
            return value;
        }     
    }
}