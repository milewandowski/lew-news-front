import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/model/event';
import { Type } from 'src/app/model/type';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  id: number = 0;
  event = new Event();
  types: Type[];
  isLoading = false;

  createForm = new FormGroup({
    name: new FormControl('', Validators.required),
    shortDesc: new FormControl('', Validators.required),
    longDesc: new FormControl('', Validators.required),
    imageUrl: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    targetGroup: new FormControl('', Validators.required),
    image: new FormControl(),
  });

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
