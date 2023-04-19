import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isNotSecuredUrl(httpRequest)) {
      return httpHandler.handle(httpRequest);
    }
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    const request = httpRequest.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return httpHandler.handle(request);
  }

  private isNotSecuredUrl(httpRequest: HttpRequest<any>): boolean {
    return httpRequest.url.includes(`${this.authenticationService.apiUserUrl}/login`) ||
      httpRequest.url.includes(`${this.authenticationService.apiUserUrl}/register`) ||
      httpRequest.url.includes(`${this.authenticationService.apiUserUrl}/resetPassword`);
  }
}

