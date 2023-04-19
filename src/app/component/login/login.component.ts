import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Subscription} from 'rxjs';
import {User} from '../../model/user';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HeaderType} from '../../enum/header-type.enum';
import {ToolbarComponent} from '../toolbar/toolbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];

  isLoading = false;
  hidePassword = true;
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router,
              private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/timeline');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLogin(): void {
    this.isLoading = true;
    const user = new User();
    user.username = this.username.value;
    user.password = this.password.value;
    this.subscriptions.push(this.authenticationService.login(user).subscribe(
      (response: HttpResponse<User>) => {
        const token = response.headers.get(HeaderType.JWT_TOKEN);
        this.authenticationService.saveToken(token);
        this.authenticationService.addUserToLocalCache(response.body);
        this.isLoading = false;
        this.router.navigateByUrl('/timeline');
      },
      (errorResponse: HttpErrorResponse) => {
        this.username.setValue('');
        this.password.setValue('');
        this.isLoading = false;
      }
    ));
  }

  get username(): AbstractControl { return this.loginForm.get('username'); }
  get password(): AbstractControl { return this.loginForm.get('password'); }
}
