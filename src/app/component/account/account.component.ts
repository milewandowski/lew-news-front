import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../service/authentication.service';
import {Subscription} from 'rxjs';
import {User} from '../../model/user';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HeaderType} from '../../enum/header-type.enum';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  private subscriptions: Subscription[] = [];

  isLoading = false;
  hidePassword = true;
  loginForm = new FormGroup({
    password: new FormControl('', Validators.required)
  });

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onLogin(): void {
    this.isLoading = true;
    var username = this.authenticationService.getUserFromLocalCache().username;
    var password = this.password.value;
    this.subscriptions.push(this.userService.updatePassword(username, password).subscribe(
      (response) => {
        this.isLoading = false;
        this.authenticationService.logout();
        this.router.navigateByUrl('/timeline');
      },
      (errorResponse: HttpErrorResponse) => {
        this.password.setValue('');
        this.isLoading = false;
      }
    ));
  }

  get password(): AbstractControl { return this.loginForm.get('password'); }

}
