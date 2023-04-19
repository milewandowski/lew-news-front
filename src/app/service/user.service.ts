import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpParams} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { CustomHttpResponse } from '../model/custom-http-response';
import { UserRequest } from '../model/user-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUserUrl = `${environment.apiUrl}/user`;

  constructor(private httpClient: HttpClient) { }

  public getUsers(sortDirection: string, pageIndex: number, pageSize: number): Observable<any> {
    return this.httpClient.get<any>(this.apiUserUrl, {
      params: new HttpParams()
        .set('sort', sortDirection)
        .set('page', pageIndex.toString())
        .set('size', pageSize.toString())
    });
  }

  public getUser(username: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUserUrl}/${username}`);
  }

  public updatePassword(username: string, password: string): Observable<CustomHttpResponse> {
    const userRequest = new UserRequest(username, password);
    return this.httpClient.put<CustomHttpResponse>(`${this.apiUserUrl}/password/${username}`, userRequest);
  }

  public addUsersToLocalCache(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] {
    var user = localStorage.getItem('users');
    if (user !== null) {
      return JSON.parse(user);
    }
    return [];
  }

}
