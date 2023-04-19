import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Event } from 'src/app/model/event';
import { EventRequest } from 'src/app/model/event-request';
import { Type } from 'src/app/model/type';
import { EventService } from 'src/app/service/event.service';
import { TypeService } from 'src/app/service/type.service';
@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  event = new Event();
  types: Type[];
  createForm: FormGroup;
  isLoading = false;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private typeService: TypeService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = +paramMap.get('id');
    });

    this.subscriptions.push(this.typeService.getTypes().subscribe(
      v => {
        this.types = v;
      }
    ));

    this.createForm = new FormGroup({
      name: new FormControl('', Validators.required),
      shortDesc: new FormControl('', Validators.required),
      longDesc: new FormControl('', Validators.required),
      imageUrl: new FormControl('', Validators.required),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl(''),
      typeId: new FormControl('', Validators.required)
    });

    this.subscriptions.push(this.eventService.getEvent(this.id).subscribe(
      res => {
        this.event = res;
        this.name.setValue(this.event.name);
        this.shortDesc.setValue(this.event.shortDesc);
        this.longDesc.setValue(this.event.longDesc);
        var fStartDate = new Date(this.event.startDate.replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"))
        this.startDate.setValue(fStartDate);

        var fEndDate = null;
        if (this.event.endDate !== null) {
          fEndDate = new Date(this.event.endDate.replace( /(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"))
        }
        this.endDate.setValue(fEndDate);
        this.imageUrl.setValue(this.event.imageUrl);
        this.typeId.setValue(this.event.type.id);
      },
      () => console.log("Error occured")
    ));
  }

  onSubmit(): void {
    const day = 60 * 60 * 24 * 1000;
    var startDate = new Date(this.createForm.get('startDate').value.getTime() + day).toISOString().substring(0, 10);

    var endDate = null;
    if (this.createForm.get('endDate').value !== '' && this.createForm.get('endDate').value !== null) {
      endDate = new Date(this.createForm.get('endDate').value.getTime() + day).toISOString().substring(0, 10);
    }

    const eventRequest = new EventRequest(
      this.name.value,
      this.shortDesc.value,
      this.longDesc.value,
      this.imageUrl.value,
      startDate,
      endDate,
      this.typeId.value
    );

    this.subscriptions.push(this.eventService.updateEvent(eventRequest, this.id).subscribe(
      res => {
        this.router.navigateByUrl(`/event-details/${res.id}`);
      },
      err => {
        console.log(err);
      }
    ));
  }

  get name(): AbstractControl {
    return this.createForm.get('name');
  }

  get shortDesc(): AbstractControl {
    return this.createForm.get('shortDesc');
  }

  get longDesc(): AbstractControl {
    return this.createForm.get('longDesc');
  }

  get imageUrl(): AbstractControl {
    return this.createForm.get('imageUrl');
  }

  get startDate(): AbstractControl {
    return this.createForm.get('startDate');
  }

  get endDate(): AbstractControl {
    return this.createForm.get('endDate');
  }

  get typeId(): AbstractControl {
    return this.createForm.get('typeId');
  }

  onDelete() {
    this.subscriptions.push(this.eventService.deleteEvent(this.id).subscribe(
      res => {
        this.router.navigateByUrl(`/all-events`);
      },
      err => {
        console.log(err);
      }
    ));
  }
}
