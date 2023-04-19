import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public apiUserUrl = `${environment.apiUrl}/user`;
  public isUserLogged = false;
  isAdminLoggedIn: Subject<boolean> = new BehaviorSubject<boolean>(false);
  private token: string = '';
  private loggedInUsername: string = '';
  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) { }

  public login(user: User): Observable<HttpResponse<User>> {
    return this.httpClient.post<User>(`${this.apiUserUrl}/login`, user, {observe: 'response'});
  }

  public logout(): void {
    this.token = '';
    this.loggedInUsername = '';
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
    this.isAdminLoggedIn.next(false);
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    this.isAdminLoggedIn.next(true);
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadToken(): void {
    this.token != localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public isUserLoggedIn(): boolean {
    this.loadToken();
    if ((this.token != null && this.token !== '') &&
        (this.jwtHelper.decodeToken(this.token).sub != null || '') &&
        (!this.jwtHelper.isTokenExpired(this.token))) {
      this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
      return true;
    } else {
      this.logout();
      return false;
    }
  }
}
