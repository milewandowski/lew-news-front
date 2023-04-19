import { Component, OnInit } from '@angular/core';
import {of, Subscription} from 'rxjs';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/service/event.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class TimelineComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  name = '';
  pageSize = 10;
  pageIndex = 0;
  sortDirection = 'startDate,desc';
  events: Event[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.eventService.getEventsManagement(null, null, this.sortDirection, this.pageIndex, this.pageSize).subscribe(
      response => {
        this.events = response.content;
      }
    ));
  }

}
