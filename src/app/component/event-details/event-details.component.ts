import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  id: number = 0;
  event = new Event();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = +paramMap.get('id');
    });

    this.subscriptions.push(this.eventService.getEvent(this.id).subscribe(
      res => {
        this.event = res;
      },
      () => console.log("Error occured")
    ));
  }
}
