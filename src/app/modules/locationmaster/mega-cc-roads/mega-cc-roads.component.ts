import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ILocationResponse,
  LocationModel,
} from 'src/app/core/models/ILocation';
import { CommonService } from 'src/app/core/services/common.service';
import { LocationService } from 'src/app/core/services/location.service';
import { MegaCCBtnCellRenderer } from './button-cell-renderer.component';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-mega-cc-roads',
  templateUrl: './mega-cc-roads.component.html',
  styleUrls: ['./mega-cc-roads.component.scss']
})
export class MegaCcRoadsComponent  implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  locationForm: FormGroup;
  locationResponce: ILocationResponse;
  locationList: LocationModel[];
  objLocation: LocationModel;
  pageTitle: 'Create';
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
  rowData: any;
  gridOption;

  gridOptions = {
    rowHeight: 40,
    getRowHeight: function (params) {
      return 40;
    },
  };

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.columnDefs = [
      {
        headerName: 'Action',
        field: '_id',
        cellRenderer: 'btnCellRenderer',
        minWidth: 180,
      },
      {
        headerName: 'Status',
        field: 'status',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: ['In Progress', 'Not Started', 'Completed', 'On Hold'],
        },
        editable: true,
        cellStyle: this.getCellStyle.bind(this),
       
      },
      {
        headerName: 'Remarks',
        field: 'remarks',
        minWidth: 200,
        editable: true,
        cellStyle: { border: '1px dashed black' },
        cellEditor: 'agTextCellEditor',
      },
      { headerName: '_id', field: '_id', hide: true },
      { headerName: 'Ward Name', field: 'wardName' },
      { headerName: 'Zone Name', field: 'zoneName' },
      { headerName: 'Work Code', field: 'workCode' },
      {
        headerName: 'Road Name',
        field: 'locationName',
        minWidth: 150,
        // headerCheckboxSelection: true,
        // headerCheckboxSelectionFilteredOnly: true,
        // checkboxSelection: true,
      },
      { headerName: 'Length (m)', field: 'length' },
      { headerName: 'Width (m)', field: 'width' },
      { headerName: 'Contractor Name', field: 'contractorName', minWidth: 180 },
      {
        headerName: 'Start Date',
        field: 'startDate',
        valueGetter: (params) => {
          return this.commonService.DateFormatter(params.data.startDate);
        },
      },
      {
        headerName: 'End Date',
        field: 'endDate',
        valueGetter: (params) => {
          return this.commonService.DateFormatter(params.data.endDate);
        },
      },
      // {
      //   headerName: 'Q1 End Date',
      //   field: 'quater1EndDate',
      //   valueGetter: (params) => {
      //     return this.commonService.DateFormatter(params.data.quater1EndDate);
      //   },
      // },
      // {
      //   headerName: 'Q2 End Date',
      //   field: 'quater2EndDate',
      //   valueGetter: (params) => {
      //     return this.commonService.DateFormatter(params.data.quater2EndDate);
      //   },
      // },
      // {
      //   headerName: 'Q3 End Date',
      //   field: 'quater3EndDate',
      //   valueGetter: (params) => {
      //     return this.commonService.DateFormatter(params.data.quater3EndDate);
      //   },
      // },
      // {
      //   headerName: 'Q4 End Date',
      //   field: 'quater4EndDate',
      //   valueGetter: (params) => {
      //     return this.commonService.DateFormatter(params.data.quater4EndDate);
      //   },
      // },
      // {
      //   headerName: 'Q5 End Date',
      //   field: 'quater5EndDate',
      //   valueGetter: (params) => {
      //     return this.commonService.DateFormatter(params.data.quater5EndDate);
      //   },
      // },

      // { headerName: 'Is Automated', field: 'isAutomated', valueGetter: this.commonService.isAutomatedValueGetter },
      // { headerName: 'Is Active', field: 'isActive',valueGetter:  this.commonService.isActiveValueGetter },
      {
        headerName: 'Created On',
        field: 'createdOn',
        valueGetter: (params) => {
          return this.commonService.DateFormatter(params.data.createdOn);
        },
      },
      { headerName: 'Created By', field: 'createdBy' },
      {
        headerName: 'Modified On',
        field: 'modifiedOn',
        valueGetter: (params) => {
          return this.commonService.DateFormatter(params.data.modifiedOn);
        },
      },
      { headerName: 'Modified By', field: 'modifiedBy' },
    ];
    debugger;
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: MegaCCBtnCellRenderer,
    };
    this.context = { componentParent: this };

    this.defaultColDef = {
      sortable: true,
      flex: 1,
      minWidth: 120,
      filter: true,
      resizable: true,
      wrapText: true,
      autoHeight: true,
      sortingOrder: ['asc', 'desc'],
      enableRowSelection: true,
      enableFullRowSelection: true,
      enableHighlighting: true,
      enableCellTextSelection: true,
    };
  }
  ngAfterViewInit() {
    this.selectAllAmerican();
  }
  userRole = sessionStorage.getItem('UserRole');

  getLocation() {
    if (this.userRole === 'Data Owner') {
      this.locationService.getLocations().subscribe(
        (result) => {
          debugger;
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              this.locationList=this.locationList.filter(f=>String(f.roadType)===String("Mega CC Road"))
              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );
              this.rowData = this.locationList;
              this.rowData.map(m=>m['wardName']=m.wardName.wardName)
              debugger;
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
          Swal.fire({
            text: err,
            icon: 'error',
          });
        }
      );
    }else if (this.userRole === 'Data Viewer' || this.userRole === 'Executive Engineer' || this.userRole === 'Assistant Engineer'){
      this.locationService.getLocations().subscribe(
        (result) => {
          debugger;
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              this.locationList=this.locationList.filter(f=>String(f.roadType)===String("Mega CC Road"))
              const userWardString = sessionStorage.getItem('UserWard');
              const userWards = userWardString.split(',');
              const filteredLocations = this.locationList.filter((location) =>
                userWards.includes(String(location.wardName.wardName))
              );
              this.locationList=filteredLocations
              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );
              debugger;
              this.rowData = this.locationList;
              this.rowData.map(m=>m['wardName']=m.wardName.wardName)
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
          Swal.fire({
            text: err,
            icon: 'error',
          });
        }
      );
    }  else {
      this.locationService.getLocationByUser().subscribe(
        (result) => {
          debugger;
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              this.locationList=this.locationList.filter(f=>String(f.roadType)===String("Mega CC Road"))

              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );

              debugger;
              this.rowData = this.locationList;
              this.rowData = this.locationList;
              this.rowData.map(m=>m['wardName']=m.wardName.wardName)
              
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
          Swal.fire({
            text: err,
            icon: 'error',
          });
        }
      );
    }
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
  methodFromParent(cell) {
    alert('Parent Component Method from ' + cell.id + '!');
  }
  getCellStyle(params: any) {
    // Check if a row should have a specific color based on some condition
    if (params.data.status == 'In Progress') {
      return { background: '#D6EAF8', color: 'black', border: '1px dashed black'};
    } else if (params.data.status == 'Not Started') {
      return { background: '#FADBD8', color: 'black',border: '1px dashed black' };
    } else if (params.data.status == 'On Hold') {
      return { background: '#F8D6B3', color: 'black',border: '1px dashed black' };
    } else if (params.data.status == 'Delayed') {
      return { background: '#FCF3CF', color: 'black',border: '1px dashed black' };
    } else if (params.data.status == 'Completed') {
      return { background: '#D5F5E3', color: 'black',border: '1px dashed black' };
    } else {
    }
    return null;
  }
  setRowData(params) {
    params.api.forEachNode(function (node) {
      if (
        node.data._id === '5f5fb46efe0da740ae7c0e49' ||
        node.data._id === '5f5f62c48d7da32bbc05dca2'
      ) {
        node.setSelected(true);
      }
    });
  }
  Add() {
    this.router.navigate(['location/create']);
  }
  statusOptions = ['In Progress', 'Completed', 'On Hold'];

  download() {
    let fileName =
    'Mega CC Road List ' +
    moment(new Date()).format('DDMMYYYY') +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
    debugger;
  }
}
