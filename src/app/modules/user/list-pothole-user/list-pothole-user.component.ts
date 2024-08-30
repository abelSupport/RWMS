import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/core/models/IUser';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BtnCellRendererPothole} from './button-cell-renderer.component';
import { RoleService } from 'src/app/core/services/role.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-list-pothole-user',
  templateUrl: './list-pothole-user.component.html',
  styleUrls: ['./list-pothole-user.component.scss']
})
export class ListPotholeUserComponent implements OnInit {

 userList: any[];

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  gridApi;
  gridColumnApi;
  sortingOrder;
  rowSelection;
  columnDefs;
  frameworkComponents;
  context;
  defaultColDef;
  selectedRows;
  selected;
  gridOption;
  rowData: any;
  isDataOwner:boolean=false;

  constructor(
    private router: Router,
    private userService: UserService,
    private roleService: RoleService,
    private potholeUserService:PotholeUserService,
    private commonService: CommonService
  ) {
    this.getRoles();
    if(sessionStorage.getItem('UserRole')==='Data Owner'){
      this.isDataOwner=true
    }
  }

  gridOptions = {
    // other grid options
    rowHeight: 40, // Set the desired row height (in pixels)
    getRowHeight: function (params) {
      // Optional: Customize row height per row, if needed
      return 40; // Return the desired row height (in pixels)
    },
  };

  ngOnInit(): void {
    this.columnDefs = [
      {
        headerName: 'Sr. No.',
        valueGetter: 'node.rowIndex + 1', // row index starts from 0, add 1 to start from 1
        cellRenderer: params => params.value, // simple renderer to show the value
        width: 100
      },
      {
        headerName: 'Action',
        field: '_id',
        cellRenderer: 'btnCellRenderer',
        minWidth: 250,
        hide: !this.isDataOwner 
      },
      {
        headerName: 'UserName',
        field: 'userName',
        hide: !this.isDataOwner 
      },
      {
        headerName: 'Full Name',
        field: 'firstName',
      },
      // {
      //   headerName: 'Last Name',
      //   field: 'lastName',
      // },
      {
        headerName: 'Mobile Number',
        field: 'mobileNo',
      },
      {
        headerName: 'Ward',
        field: 'ward',
      },
      { headerName: 'Email Id', 
        field: 'email' 
      },
      {
        headerName: 'Is DataEntry',
        field: 'isDataEntry',
        hide: !this.isDataOwner 
      },
      {
        headerName: 'Is Active',
        field: 'isActive',
        hide: !this.isDataOwner ,
        valueFormatter: function (params) {
          console.log(params);
          return params.value === true ? 'Yes' : 'No';
        },
      },
      {
        headerName: 'User Role',
        field: 'roleName',
      },
      {
        headerName: 'ecNo',
        field: 'ecNo',
        hide: !this.isDataOwner 
      },
      {
        headerName: 'Electoral Ward No',
        field: 'electrolWardNo',
      },
      {
        headerName: 'Personal MobileNo',
        field: 'personalMobileNo',
        hide: !this.isDataOwner 
      },
      {
        headerName: 'simAlloted',
        field: 'simAlloted',
        hide: !this.isDataOwner 
      },
      {
        headerName: 'imsiAlloted',
        field: 'imsiAlloted',
        hide: !this.isDataOwner 
      },
      {
        headerName: 'Created On',
        field: 'createdOn',
        valueGetter: this.commonService.createdOnDateFormatter,
        hide: !this.isDataOwner 
      },
      {
        headerName: 'Created By',
        field: 'createdBy',
        hide: !this.isDataOwner 
      },
    ];
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRendererPothole,
    };
    this.context = { componentParent: this };

    this.defaultColDef = {
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      sortingOrder: ['asc', 'desc'],
    };
  }
  roleList: any;

  download() {
    let fileName =
      'UserList' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
    debugger;
  }

  getRoles() {
    this.roleService.getRoles().subscribe((result) => {
      if (result.status === 200) {
        this.roleList = result.data;
        this.getUsers();
      }
    });
  }

  getUsers() {
    this.potholeUserService.getPotholeUsers().subscribe(
      (result) => {
        if (result != null) {
          if (result.status === 200) {
            this.userList = result.data;
            this.userList=this.userList.filter(f=>String(f?.mobileNo)!=='7020325511')

            this.userList.forEach((element) => {
              this.roleList.forEach((e) => {
                if (e._id == element.role) {
                  element.roleName = e.roleName;
                }
              });
            });
            this.userList.forEach((element) => {
              element.ward=element?.wards[0][0]?.wardName
              console.log(element?.wards[0][0]);
            });
            this.rowData = this.userList;
          }
        } else {
          Swal.fire({
            title: 'Seesion Expired',
            text: 'Login Again to Continue',
            icon: 'warning',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.value) {
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

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }

  OnGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }

  onQuickFilterChanged() {
    let val = (<HTMLInputElement>document.getElementById('quickFilter')).value;
    this.agGrid.api.setQuickFilter(val);
  }
  methodFromParent(cell) {
    alert('Parent Component Method from ' + cell.id + '!');
  }

  ngAfterViewInit() {
    this.selectAllAmerican();
  }

  selectAllAmerican() {
    this.agGrid.api.forEachNode(function (node) {
      if (
        node.data._id === '5f5fb46efe0da740ae7c0e49' ||
        node.data._id === '5f5f62c48d7da32bbc05dca2'
      ) {
        node.setSelected(true);
      }
    });
  }

  Add() {
    this.router.navigate(['user/potholecreate']);
  }
}
