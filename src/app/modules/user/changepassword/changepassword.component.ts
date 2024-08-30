import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { roleModel } from 'src/app/core/models/IRole';
import { User } from 'src/app/core/models/IUser';
import { RoleService } from 'src/app/core/services/role.service';
import { UserService } from 'src/app/core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss'],
})
export class ChangepasswordComponent implements OnInit {
  form: FormGroup;
  pageTitle = 'Change Password';

  userModel: User;
  idForChangePassword: string;
  modelWard: any = {};
  roleList: roleModel[];

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private roleService: RoleService
  ) {
    this.roleService.getRoles().subscribe(
      (result) => {
        if (result.status === 200) {
          this.roleList = result.data;
        }
      },
      (err) => {
        // this.notificationService.warn(':: ' + err);
      }
    );
    this.userService.getWards().subscribe(
      (result) => {
        if (result.status === 200) {
          this.modelWard = result.data;
        }
      },
      (err) => {
        // this.notificationService.warn(':: ' + err);
      }
    );
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      if (id) {
        this.pageTitle = 'Edit User';

        this.userService.getUserById(id).subscribe(
          (result) => {
            if (result != null) {
              if (result.status === 200) {
                this.userModel = result.data[0];
                console.log(this.userModel);
                this.idForChangePassword = id;

                this.form.patchValue({
                  userName: this.userModel.userName,
                  // password: this.userModel.password,
                  createdBy: sessionStorage.getItem('FullName'),
                  createdOn: new Date(),
                  modifiedBy: sessionStorage.getItem('FullName'),
                  modifiedOn: new Date(),
                });
              }
            } else {
              Swal.fire({
                title: 'Seesion Expired',
                text: 'Login Again to Continue',
                icon: 'warning',
                confirmButtonText: 'Ok',
              }).then((result) => {
                if (result.value) {
                  debugger;
                  this.logOut();
                }
              });
            }
          },
          (err) => {
            // this.notificationService.warn(':: ' + err);
          }
        );
      }
    });
  }

  onSubmit() {
    let selectedWardNames: any = [];
    this.userModel.wards.forEach((w) => {
      selectedWardNames.push(w[0].wardName);
    });
    let wdata = this.modelWard.filter((w) =>
      selectedWardNames.includes(w.wardName)
    );
    let resultDatta = wdata.map(({ wardName, zoneName, Zone }) => ({
      wardName,
      zoneName,
      Zone,
    }));
    console.log(resultDatta);

    if (this.form.invalid) {
      return; // Exit the function if the form is invalid
    } else {
      if (this.newPwd == this.confirmPwd) {
        if (this.idForChangePassword) {
          console.log('update call');
          this.userModel = {
            _id: '0',
            userID: 0,
            firstName: this.userModel.firstName,
            lastName: this.userModel.lastName,
            userName: this.userModel.userName,
            email: this.userModel.email,
            mobileNo: this.userModel.mobileNo,
            password: this.newPwd,
            role: this.userModel.role,
            isActive: Boolean(this.userModel.isActive),
            locations: [],
            wards: resultDatta,
            roleName: this.userModel.roleName,
            isDataEntry: this.userModel.isDataEntry,
            createdBy: sessionStorage.getItem('FullName'),
            createdOn: new Date(),
            modifiedBy: sessionStorage.getItem('FullName'),
            modifiedOn: new Date(),
          };

          this.userService
            .updateUser(this.idForChangePassword, this.userModel)
            .subscribe(
              (result) => {
                if (result != null) {
                  if (result.status === 201) {
                    Swal.fire({
                      text: 'Password Changed, Login with new Password!',
                      icon: 'success',
                    }).then((result) => {
                      if (result.isConfirmed) {
                        this.logOut();
                      }
                    });
                    // this.logOut();
                  }
                } else {
                  Swal.fire({
                    title: 'Seesion Expired',
                    text: 'Login Again to Continue',
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.value) {
                      debugger;
                      this.logOut();
                    }
                  });
                }
              },
              (err) => {
                // this.notificationService.warn(':: ' + err);
              }
            );
        }
      } else {
        Swal.fire({
          text: 'Password & Confirm Password did not Match!',
          icon: 'error',
        });
      }
    }
  }

  newPwd: any;
  confirmPwd: any;
  onPasswordChange(e) {
    this.newPwd = e.target.value;
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }

  passwordMatch = false;
  onConfirmPasswordChange(e) {
    this.confirmPwd = e.target.value;
    if (this.newPwd == this.confirmPwd) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }

  Back() {
    this.router.navigate(['user/list']);
  }
}
