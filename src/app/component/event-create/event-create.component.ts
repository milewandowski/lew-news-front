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
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  private subscriptions: Subscription[] = [];
  event = new Event();
  types: Type[];
  createForm: FormGroup;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private typeService: TypeService) { }

  ngOnInit(): void {
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

    this.subscriptions.push(this.eventService.addEvent(eventRequest).subscribe(
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
}
