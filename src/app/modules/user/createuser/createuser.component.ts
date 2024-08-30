import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/core/models/IUser';
import { UserService } from 'src/app/core/services/user.service';
import { RoleService } from 'src/app/core/services/role.service';
import { roleModel } from 'src/app/core/models/IRole';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
type AOA = any[][];

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss'],
})
export class CreateuserComponent implements OnInit {
  pageTitle: string = 'Create User';
  customStylesValidated = false;
  userModel: User;
  form: FormGroup;
  idforEdit: string;
  roleList: roleModel[];
  userRole: String;
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

  modelWard: any = {};

  ngOnInit(): void {
    this.form = this._fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      password: ['', Validators.required],
      role: [''],
      isActive: [''],
      mobileNo: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      ward: ['', Validators.required],
      isDataEntry: [''],
    });
    this.userRole = sessionStorage.getItem('UserRole');
    this.route.paramMap.subscribe((params) => {
      let id = params.get('id');
      if (id) {
        this.pageTitle = 'Edit User';

        debugger;
        this.userService.getUserById(id).subscribe(
          (result) => {
            if (result != null) {
              if (result.status === 200) {
                this.userModel = result.data[0];
                console.log(this.userModel);
                this.idforEdit = id;

                var selectedWardNames: any = [];
                this.userModel.wards.forEach((w) => {
                  selectedWardNames.push(w[0].wardName);
                });

                this.form.patchValue({
                  firstName: this.userModel.firstName,
                  lastName: this.userModel.lastName,
                  userName: this.userModel.userName,
                  email: this.userModel.email,
                  mobileNo: this.userModel.mobileNo,
                  password: this.userModel.password,
                  role: this.userModel.role._id,
                  // ward: this.userModel.wards.map((ward) => ward.wardName),
                  ward: selectedWardNames,
                  roleName: this.userModel.roleName,
                  isActive: this.userModel.isActive === true ? '1' : '0',
                  isDataEntry: this.userModel.isDataEntry,
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

  onWardChange(e) {
    var wardid = e.target.value;
    const ward = this.modelWard.filter((m) => m.wardName === wardid);
    debugger;
    this.form.patchValue({
      zone: ward?.[0]?.Zone,
      area: ward?.[0]?.zoneName,
    });
  }

  onSubmit() {
    debugger;
    let selectedWardNames = this.form.value.ward;
    let wdata = this.modelWard.filter((w) =>
      selectedWardNames.includes(w.wardName)
    );
    let resultDatta = wdata.map(({ wardName, zoneName, Zone }) => ({
      wardName,
      zoneName,
      Zone,
    }));
    console.log(resultDatta);

    if (this.form.valid) {
      if (this.idforEdit) {
        console.log('update call');
        this.userModel = {
          _id: '0',
          userID: 0,
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          userName: this.form.value.userName,
          email: this.form.value.email,
          mobileNo: this.form.value.mobileNo,
          password: this.form.value.password,
          role: this.form.value.role,
          isActive: Boolean(this.form.value.isActive),
          locations: [],
          wards: resultDatta,
          roleName: (document.getElementById('role') as HTMLSelectElement)
            .selectedOptions[0].innerText,
          isDataEntry: this.form.value.isDataEntry,
          createdBy: sessionStorage.getItem('FullName'),
          createdOn: new Date(),
          modifiedBy: sessionStorage.getItem('FullName'),
          modifiedOn: new Date(),
        };
        this.userService.updateUser(this.idforEdit, this.userModel).subscribe(
          (result) => {
            if (result != null) {
              if (result.status === 201) {
                // this.notificationService.success(':: ' + result.message);
                Swal.fire({
                  text: 'User Updated',
                  icon: 'success',
                });
                this.router.navigate(['user/list']);
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
      } else {
        debugger;
        let userModel1 = {
          _id: '0',
          userID: 0,
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          userName: this.form.value.userName,
          email: this.form.value.email,
          mobileNo: this.form.value.mobileNo,
          password: this.form.value.password,
          role: this.form.value.role,
          isActive: this.form.value.isActive,
          locations: [],
          wards: resultDatta,
          roleName: (document.getElementById('role') as HTMLSelectElement)
            .selectedOptions[0].innerText,
          isDataEntry: this.form.value.isDataEntry,
          createdBy: sessionStorage.getItem('FullName'),
          createdOn: new Date(),
          modifiedBy: null,
          modifiedOn: null,
        };
        console.log(userModel1);
        debugger;
        this.addUser(userModel1);
      }
    }
  }

  Back() {
    this.router.navigate(['user/list']);
  }
  onReset() {
    this.customStylesValidated = false;
  }

  data: any;
  userModelUpload: any;
  uploadListener(event: any): void {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

      console.log('Excel Data' + this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  UploadClick() {
    this.getDataRecordsArray();
  }

  async getDataRecordsArray() {
    for (let i = 1; i < this.data.length; i = i + 1) {
      let j = i + 1;

      if (this.data[i].length) {
        debugger;
        if (this.data[i][0] != '') {
          debugger;

          let wdata = this.modelWard.filter(
            (w) => w.wardName === String(this.data[i][7])
          );
          let resultDatta = wdata.map(({ wardName, zoneName, Zone }) => ({
            wardName,
            zoneName,
            Zone,
          }));
          var role: any = this.roleList.filter(
            (u) => u.roleName === String(this.data[i][6])
          );

          let attr1 = {
            _id: '0',
            userID: 0,
            firstName: this.data[i][0],
            lastName: this.data[i][1],
            userName: this.data[i][2],
            email: this.data[i][3],
            mobileNo: this.data[i][4],
            password: this.data[i][5],
            role: role[0]._id,
            isActive: this.data[i][8],
            isDataEntry: this.data[i][9],
            locations: [],
            wards: resultDatta,
            roleName: this.data[i][6],
            createdBy: sessionStorage.getItem('FullName'),
            createdOn: new Date(),
            modifiedBy: null,
            modifiedOn: null,
          };

          console.log('attr1', attr1);
          debugger;

          this.addUser(attr1);

          debugger;
        }
      }
    }
  }

  addUser(userModel1) {
    debugger;
    this.userService.AddUser(userModel1).subscribe((result) => {
      debugger;
        if (result != null) {
          if (result.status === 201) {
            this.router.navigate(['user/list']);
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
      (err) => {}
    );
  }
  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }
}
