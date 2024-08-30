import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginModel } from '../../../core/models/loginModel';
import { DbCallingService } from '../../../core/services/db-calling.service';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/IUser';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.scss'],
})
export class UserloginComponent {
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });
  token: String = '0';
  userModel: User;
  loginModel: LoginModel;
  result: any = [];
  UOTP: number = 0;
  resMsg: any = '';
  otpRes: number = 0;
  get f() {
    return this.loginForm.controls;
  }
  constructor(
    private router: Router,
    private dbCallingService: DbCallingService,
    private fb: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginModel = new LoginModel();
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginClick() {
    let obj = {
      MobileNo: this.loginForm.value.username,
      // "IMEINo": null
    };
    this.userService.loginOTP(obj).subscribe((result) => {
      debugger;
      if (result.status === 200) {
        this.userModel = result.data[0];
        this.token = result.token;
        this.dbCallingService.GenerateOTP(obj).subscribe(
          (res) => {
            if (res.servicesesponse === 1) {
              this.otpRes = res.servicesesponse;
              this.UOTP = res.otp;
            } else {
              console.log(res);
              Swal.fire({
                text: res.msg,
                icon: 'warning',
              });
            }
          },
          (err) => {
            Swal.fire({
              text: 'Something went wrong!!',
              icon: 'warning',
            });
          }
        );
        this.loginForm.patchValue({
          username: obj.MobileNo,
          password: '',
        });
      } else if (result.status === 201) {
        debugger;
        Swal.fire({
          text: result.message.toString(),
          icon: 'warning',
        });
      }
    });
  }

  ValidateUser() {
    debugger;
    if (this.UOTP === this.loginForm.value.password) {
      debugger;
      sessionStorage.setItem('UserId', this.userModel._id.toString());
      sessionStorage.setItem('FullName', String(this.userModel.firstName));
      sessionStorage.setItem('Role', String(this.userModel.role));
      sessionStorage.setItem('UserRole', String(this.userModel.roleName));
      sessionStorage.setItem('UserName', String(this.userModel.userName));
      sessionStorage.setItem('jwttoken', String(this.token));
      sessionStorage.setItem('isDataEntry', String(this.userModel.isDataEntry));
      sessionStorage.setItem(
        'UserWard',
        String(this.userModel.wards[0][0].wardName)
      );
      debugger;
      if (
        String(this.userModel.roleName) === 'Data Viewer' ||
        String(this.userModel.roleName) === 'Executive Engineer' ||
        String(this.userModel.roleName) === 'Assistant Engineer'||
        String(this.userModel.roleName) === 'Twitter PRO User' ||
        String(this.userModel.roleName) === 'Data Owner' ||
        String(this.userModel.roleName) === 'Contractor' ||
        String(this.userModel.roleName) === 'Additional Municipal Commissioner'  ||
        String(this.userModel.roleName) === 'Deputy Municipal Commissioner' ||
        String(this.userModel.roleName) === 'Deputy Chief' ||
        String(this.userModel.roleName) === 'Chief Engineer'
      ) {
        sessionStorage.setItem(
          'UserWard',
          String(this.userModel.wards.map((m) => m[0].wardName))
        );
      }
      sessionStorage.setItem('isDataEntry', String(this.userModel.isDataEntry));
      debugger;
      if (String(this.userModel.roleName) === String('Mastic Work')) {
        this.router.navigateByUrl('location/masticworklist');
      } else if (
        String(this.userModel.roleName) === String('Twitter PRO User')
      ) {
        this.router.navigateByUrl('potholework/gmap');
      } else if (
        String(this.userModel.roleName) === String('Contractor')
      ) {
        sessionStorage.setItem('WorkCode', String(this.userModel.lastName));
        this.router.navigateByUrl('potholework/list');
      } else {
        this.router.navigateByUrl('dashboard');
      }

      
    } else {
      Swal.fire({
        text: 'Invalid OTP',
        icon: 'warning',
      });
    }
  }
}
