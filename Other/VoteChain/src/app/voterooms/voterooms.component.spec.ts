import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteroomsComponent } from './voterooms.component';

describe('VoteroomsComponent', () => {
  let component: VoteroomsComponent;
  let fixture: ComponentFixture<VoteroomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoteroomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoteroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
