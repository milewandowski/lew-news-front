import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import { EventService } from 'src/app/service/event.service';
import {tap} from 'rxjs/operators';
import { EventsDataSource } from 'src/app/datasource/events-data-source';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-events-management',
  templateUrl: './events-management.component.html',
  styleUrls: ['./events-management.component.css']
})
export class EventsManagementComponent implements OnInit {


  nameFormGroup = new FormGroup({
    name: new FormControl('')
  });

  startDate: any;
  endDate: any;
  pageSize = 4;
  pageIndex = 0;
  sortDirection = 'name,asc';
  pageSizeOptions: number[] = [2, 4, 8, 16];
  dataSource: EventsDataSource;
  displayedColumns = ['name', 'startDate', 'endDate', 'category', 'type', 'icon'];

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.startDate = null;
    this.endDate = null;
    this.dataSource = new EventsDataSource(this.eventService);
    this.dataSource.loadProducts(this.startDate, this.endDate, this.sortDirection, this.pageIndex, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.paginator.page
      .pipe(
        tap(() => this.loadEventsPage())
      )
      .subscribe();
  }

  loadEventsPage(): void {
    this.dataSource.loadProducts(
      this.startDate,
      this.endDate,
      this.sortDirection,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  sortByStartDate(): void {
    this.sortDirection = 'startDate,asc';
    this.loadEventsPage();
  }

  sortByName(): void {
    this.sortDirection = 'name,asc';
    this.loadEventsPage();
  }

  sortByEndDate(): void {
    this.sortDirection = 'endDate,asc';
    this.loadEventsPage();
  }

  changeStartDate(event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      this.startDate = null;
    } else {
      const day = 60 * 60 * 24 * 1000;
      this.startDate = new Date(event.value.getTime() + day).toISOString().substring(0, 10);
    }
    this.loadEventsPage();
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      this.endDate = null;
    } else {
      const day = 60 * 60 * 24 * 1000;
      this.endDate = new Date(event.value.getTime() + day).toISOString().substring(0, 10);
    }
    this.loadEventsPage();
  }
}
