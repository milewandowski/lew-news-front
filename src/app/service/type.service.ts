import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Type } from '../model/type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  private apiTypeUrl = `${environment.apiUrl}/type`;

  constructor(private httpClient: HttpClient) {
  }

  public getTypes(): Observable<Type[]> {
    return this.httpClient.get<Type[]>(this.apiTypeUrl);
  }
}
