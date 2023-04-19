import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Event} from '../model/event';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {EventService} from '../service/event.service';
import {catchError, finalize, map} from 'rxjs/operators';

export class EventsDataSource implements DataSource<Event> {

    private eventSubject = new BehaviorSubject<Event[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
  
    public loading$ = this.loadingSubject.asObservable();
    public totalElements = 0;
  
    constructor(private eventService: EventService) {}
  
    connect(collectionViewer: CollectionViewer): Observable<Event[]> {
      return this.eventSubject.asObservable();
    }
  
    disconnect(collectionViewer: CollectionViewer): void {
      this.eventSubject.complete();
      this.loadingSubject.complete();
    }
  
    loadProducts(fromStartDate: string, fromEndDate: string, sortDirection = 'startDate,desc', pageIndex = 0, pageSize = 4): void {
      this.loadingSubject.next(true);
  
      this.eventService.getEventsManagement(fromStartDate, fromEndDate, sortDirection, pageIndex, pageSize).pipe(
        map(res => {
          this.totalElements = res.totalElements;
          return res.content;
        }),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
        .subscribe(
          events => this.eventSubject.next(events),
        );
    }
}
