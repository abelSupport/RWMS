import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginModel } from '../../../core/models/loginModel';
import { DbCallingService } from '../../../core/services/db-calling.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loginModel: LoginModel;
  result: any = [];

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
    this.loginForm;
    this.loginModel.userName = this.loginForm.value.username;
    this.loginModel.password = this.loginForm.value.password;
    this.userService.login(this.loginModel).subscribe((result) => {
      debugger;
      if (result.status === 200) {
        //console.log('Logged In', result);
        sessionStorage.setItem('UserId', result.data[0]._id.toString());
        sessionStorage.setItem('FullName', String(result.data[0].firstName));
        sessionStorage.setItem('Role', String(result.data[0].role));
        sessionStorage.setItem('UserRole', String(result.data[0].roleName));
        sessionStorage.setItem('UserName', String(result.data[0].userName));
        sessionStorage.setItem('jwttoken', String(result.token));
        sessionStorage.setItem(
          'UserWard',
          String(result.data[0].wards[0][0].wardName)
        );
        debugger;
        if (
          String(result.data[0].roleName) === 'Data Viewer' ||
          String(result.data[0].roleName) === 'Executive Engineer' ||
          String(result.data[0].roleName) === 'Assistant Engineer' ||
          String(result.data[0].roleName) === 'Twitter PRO User' ||
          String(result.data[0].roleName) === 'Data Owner' ||
          String(result.data[0].roleName) === 'Contractor' ||
          String(result.data[0].roleName) ===
            'Additional Municipal Commissioner' ||
          String(result.data[0].roleName) === 'Deputy Municipal Commissioner' ||
          String(result.data[0].roleName) === 'Deputy Chief' ||
          String(result.data[0].roleName) === 'Chief Engineer'
        ) {
          debugger;
          sessionStorage.setItem(
            'UserWard',
            String(result.data[0].wards.map((m) => m[0].wardName))
          );
        }
        sessionStorage.setItem(
          'isDataEntry',
          String(result.data[0].isDataEntry)
        );
        debugger;
        if (String(result.data[0].roleName) === String('Mastic Work')) {
          this.router.navigateByUrl('location/masticworklist');
        } else if (
          String(result.data[0].roleName) === String('Twitter PRO User')
        ) {
          this.router.navigateByUrl('potholework/gmap');
        } else if (String(result.data[0].roleName) === String('Contractor')) {
          sessionStorage.setItem('WorkCode', String(result.data[0].lastName));
          this.router.navigateByUrl('potholework/list');
        } else {
          this.router.navigateByUrl('dashboard');
        }
      }
      if (result.status === 201) {
        Swal.fire({
          text: 'Invalid UserName Or Password !',
          icon: 'warning',
        });
      }
    });

    // this.dbCallingService.loginClick(this.loginModel).subscribe((res) => {
    //   debugger;
    //   this.result = res;
    //   if (this.result.Data.length > 0) {
    //     this.loginModel = this.result.Data[0];
    //     this.loginModel.viewName = 'Login';
    //     sessionStorage.setItem('UserId', this.loginModel.UserId.toString());
    //     sessionStorage.setItem('Role', String(this.loginModel.Role));
    //     sessionStorage.setItem('UserName', String(this.loginModel.UserName));
    //     let obj = {
    //       UserId: this.loginModel.UserId.toString(),
    //     };
    //     this.dbCallingService.CheckUserZone(obj).subscribe(
    //       (resp) => {
    //         if (resp.Data.length > 0) {
    //           console.log(resp);
    //           let data = resp.Data[0];
    //           sessionStorage.setItem('Zone', String(data.Zone));
    //           console.log(data.Zone);
    //         }
    //       },
    //       (err) => console.log(err)
    //     );

    //     this.router.navigateByUrl('dashboard');
    //   } else {
    //     Swal.fire({
    //       text: 'Invalid UserName Or Password !',
    //       icon: 'warning',
    //     });
    //   }
    // });
  }
}
