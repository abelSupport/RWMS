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
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { PotholeWorkService } from 'src/app/core/services/pothole-work.service';
import { MasticWorkModel } from 'src/app/core/models/IMasticWork';
import { BtnCellRenderer } from './button-cell-renderer.component';
import { AfterImageCellRenderer } from './after-image-cell-renderer.component';
import { BtnUpdateBeforeImageCellRenderer } from './update-images-cell-renderer.component';
import { BeforeImageCellRenderer } from './before-image-cell-renderer.component';
import { ListTwitterImageCellRenderer } from './twitter-image-cell-renderer.component';

import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';

@Component({
  selector: 'app-list-pothole-work',
  templateUrl: './list-pothole-work.component.html',
  styleUrls: ['./list-pothole-work.component.scss'],
})
export class ListPotholeWorkComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  locationForm: FormGroup;
  locationResponce: ILocationResponse;
  locationList: LocationModel[];
  masticWorkList: MasticWorkModel[];
  above9WorkCode: String[] = [
    'AC-202',
    'AC-203',
    'AW-276',
    'AW-277',
    'AE-154',
    'AE-156',
    'AW-278',
  ];
  below9WorkCode: String[] = [
    'AC-200',
    'AC-201',
    'AW-279',
    'AW-277',
    'AE-155',
    'AE-157',
    'AW-281',
  ];

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
  potholeUsers: any;
  rowData1: any;

  constructor(
    private _fb: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
    private masticWorService: MasticworkService,
    private locationService: LocationService,
    private potholeWorkService: PotholeWorkService,
    private potholeUserService: PotholeUserService
  ) {}

  download() {
    debugger;
    let downloadData = this.rowData.map((m) => {
      debugger;
      let lat=null
      let long=null
      if(m?.coordinates!==null)
      {
         lat = m?.coordinates[0]?.lat;
         long = m?.coordinates[0]?.lng;
      }
      debugger;
      return {
        complainID: m.masticWorkID,
        zoneName: m.zoneName,
        wardName: m.wardName,
        workCode: m.workCode,
        locationName: m.locationName,
        description: m.description,
        length: m.length,
        width: m.width,
        masticQuantity: m.masticQuantity,
        reportedDate: m.dataDate,
        attendedDate: m.modifiedOn,
        attendedBy: m.modifiedBy,
        remarks: m.remarks,

        lat: lat,
        long: long,

        createdOn: m.createdOn,
        createdBy: m.createdBy,

        beforeImagePath: m.beforeImagePath,
        afterImagePath: m.afterImagePath,
        RecordSource: m.source,
        AssignedTo: m.subEngineerFirstName,
        ElectoralWardNo: m.electrolWardNo,
      };
    });

    let fileName =
      'Pothole Work List ' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  ngOnInit(): void {
    this.getLocation();
    this.columnDefs = [
      {
        headerName: 'SR No',
        valueGetter: 'node.rowIndex + 1', // row index starts from 0, add 1 to start from 1
        cellRenderer: (params) => params.value, // simple renderer to show the value
        width: 50,
      },
      {
        headerName: 'Complaint ID',
        field: 'masticWorkID',
        minWidth: 120,
      },
      {
        headerName: 'Zone Name',
        field: 'zoneName',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [
            'Zone - I City',
            'Zone - II City',
            'Zone - III WS',
            'Zone - IV WS',
            'Zone - V ES',
            'Zone - VI ES',
            'Zone - VII ES',
          ],
        },
        editable: true,
      },
      {
        headerName: 'Ward Name',
        field: 'wardName',
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F/S',
            'F/N',
            'G/S',
            'G/N',
            'H/E',
            'H/W',
            'K/E',
            'K/W',
            'L',
            'M/E',
            'M/W',
            'N',
            'P/S',
            'P/N',
            'R/C',
            'R/S',
            'R/N',
            'S',
            'T',
            'EEH',
            'WEH',
          ],
        },
        editable: true,
      },
      {
        headerName: 'Road Name',
        field: 'locationName',
        minWidth: 150,
        editable: true,
      },
      { headerName: 'Length (m)', field: 'length', editable: true },
      { headerName: 'Width (m)', field: 'width', editable: true },
      { headerName: 'Mastic Area Attended (sq. m.)', field: 'masticQuantity' },
      {
        headerName: 'Reported Date',
        field: 'dataDate',
        valueGetter: (params) => {
          return this.commonService.formatDateForInput(params.data.dataDate);
        },
      },
      {
        headerName: 'Attended Date',
        field: 'modifiedOn',
        valueGetter: (params) => {
          return this.commonService.formatDateForInput(params.data.modifiedOn);
        },
      },
      { headerName: 'Attended By', field: 'modifiedBy' },

      {
        headerName: 'Remarks',
        field: 'remarks',
        minWidth: 200,
        editable: true,
      },
      {
        headerName: 'Created On',
        field: 'createdOn',
        valueGetter: (params) => {
          return this.commonService.formatDateForInput(params.data.createdOn);
        },
      },
      { headerName: 'Created By', field: 'createdBy' },
      {
        headerName: 'Tweet Link',
        field: 'link',
        cellRenderer: this.linkCellRenderer,
      },

      {
        headerName: 'Tweet Image',
        field: '_id',
        cellRenderer: 'listTwitterImageCellRenderer',
        afterImage: '',
        minWidth: 200,
      },
      {
        headerName: 'Before Image',
        field: '_id',
        cellRenderer: 'beforeImageCellRenderer',
        afterImage: '',
        minWidth: 200,
      },
      {
        headerName: 'After Image',
        field: '_id',
        cellRenderer: 'afterImageCellRenderer',
        afterImage: '',
        minWidth: 200,
      },
      // {
      //   headerName: 'Work Code',
      //   field: 'workCode',
      //   minWidth: 150,
      // },

      {
        headerName: 'Work Code',
        field: 'workCode',
        hide: !(this.userRole === 'Data Owner' || this.userRole === 'Assistant Engineer'),
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [
            'AC-200',
            'AC-201',
            'AC-202',
            'AC-203',
            'AE-154',
            'AE-155',
            'AE-156',
            'AE-157',
            'AW-276',
            'AW-277-Above',
            'AW-277-Below',
            'AW-278',
            'AW-279',
            'AW-281',
            'AW-289',
            'AW-291',
            'AW-292',

            // 'AW-280',
            // highways workcodes
            "AW-269",
            "AW-288",
            "AE-153",
            "AE-163"
          ],
        },
        editable: true,
      },

      {
        headerName: 'Contractor Name',
        field: 'contractorName',
        hide: !(this.userRole === 'Data Owner' || this.userRole === 'Assistant Engineer'),
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
          values: [
            "M/s. C. R. Shah",
            "M/s. DHP Infratech",
            "M/s. Eric Infrastructure",
            "M/s. Gyan Construction Co.",
            "M/s. Kamala Construction Co.",
            "M/s. PECC",
            "M/s. Priti Construction",
            "M/s. R & B Infraprojects",
            "M/s. Varun Construction",
            "M/s. VNC Infraprojects",

            // highways con. names
            "M/s Aic InfraStructures",
            "M/s Konark Structural Engineers Pvt. Ltd.",
            "M/s Shah and Parikh"
          ],
        },
        editable: true,
      },

      { headerName: 'Record Source', field: 'source' },
      { headerName: 'Assigned To', field: 'subEngineerFirstName' },
      { headerName: 'User Role', field: 'roleName' },
      { headerName: 'Electoral Ward No', field: 'electrolWardNo' },
      {
        headerName: 'Action',
        field: '_id',
        cellRenderer: 'btnCellRenderer',
        afterImage: '',
        minWidth: 180,
      },
      {
        headerName: 'Before Image Update',
        field: '_id',
        hide: this.userRole !== 'Data Owner',
        cellRenderer: 'btnUpdateBeforeImageCellRenderer',
        image: '',
        minWidth: 450,
      },

      // {
      //   headerName: 'After Image Update',
      //   field: '_id',
      //   cellRenderer: 'btnUpdateBeforeImageCellRenderer',
      //   image: '',
      //   minWidth: 350,
      // },

      { headerName: '_id', field: '_id', hide: true },
    ];
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
      btnUpdateBeforeImageCellRenderer: BtnUpdateBeforeImageCellRenderer,
      afterImageCellRenderer: AfterImageCellRenderer,
      beforeImageCellRenderer: BeforeImageCellRenderer,
      listTwitterImageCellRenderer: ListTwitterImageCellRenderer,
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
  editButtonCellRenderer(params) {
    var rowData = params.data;

    if (rowData.createdOn) {
      return BtnCellRenderer;
    } else {
      return '';
    }
  }
  userRole = sessionStorage.getItem('UserRole');
  userID = sessionStorage.getItem('UserId');

  getLocation() {
    // if (this.userRole === 'Data Owner') {
    this.masticWorService.getPotholeWork().subscribe(
      (result) => {
        if (result != null) {
          if (result.status === 200) {
            this.rowData1 = result.data;
            this.potholeUserService.getPotholeUsers().subscribe((result) => {
              if (result.status === 200) {
                this.potholeUsers = result.data;
                this.rowData1.forEach((row) => {
                  const matchedUser = this.potholeUsers.find(
                    (user) => user._id === row.subEngineerName
                  );
                  if (matchedUser) {
                    row.subEngineerFirstName = matchedUser.firstName;
                    row.electrolWardNo = matchedUser.electrolWardNo;
                    row.roleName = matchedUser.roleName;
                  }
                });
                this.rowData1 = this.rowData1.filter(
                  (f) => String(f.subEngineerFirstName) !== 'Sneha Kshatriya'
                );

                if (this.userRole === 'Data Owner') {
                  this.masticWorkList = this.rowData1;
                  this.rowData = this.rowData1;

                  this.rowData.map(m=>m['wardName']=m.wardName?.wardName)

                } 
                
                else if (
                  this.userRole === 'Data Viewer' ||
                  this.userRole === 'Executive Engineer' ||
                  this.userRole === 'Assistant Engineer' ||
                  this.userRole === 'Contractor'
                ) {
                  // const WorkCode = sessionStorage.getItem('WorkCode');
                  // if (WorkCode === null) {
                  //   console.log('WorkCode is not present in session storage.');
                  // } else {
                  //   if (this.above9WorkCode.includes(WorkCode)) {
                  //     debugger;
                  //     this.rowData1=this.rowData1.filter(f=>String(f?.roleName)==='Sub Engineer'  || String(f?.source)==="BulkUpload")
                  //   } else if(this.below9WorkCode.includes(WorkCode)){
                  //     debugger;
                  //     this.rowData1=this.rowData1.filter(f=>String(f?.roleName)==='Road Engineer' )
                  //   }else if(this.below9WorkCode.includes(WorkCode) && this.above9WorkCode.includes(WorkCode)){
                  //     debugger;
                  //     this.rowData1=this.rowData1
                  //   }
                  // }

                  
                  const userWardString = sessionStorage.getItem('UserWard');
                  const userWards = userWardString.split(',');
                  let masticWorkList = this.rowData1;

                  

                  const filteredLocations = masticWorkList.filter((location) =>
                    userWards.includes(String(location?.wardName?.wardName))
                  );
                  masticWorkList = filteredLocations;
                  this.rowData = masticWorkList;

                  this.rowData.map(m=>m['wardName']=m.wardName?.wardName)
                  debugger;
                  if(this.userRole == 'Contractor') {
                    let workcode = sessionStorage.getItem('WorkCode');
                    this.rowData = this.rowData.filter((row) => row. workCode !== "" &&  row. workCode === workcode)
                    // this.rowData.map((row) => row.workCode === workcode);
                    debugger;
                  }
                } 
                
                else {
                  let ward = sessionStorage.getItem('UserWard');
                  this.masticWorkList = result.data.filter(
                    (f) => f.wardName.wardName === ward
                  );

                  this.masticWorkList = this.masticWorkList.filter(
                    (f) => f.subEngineerName._id === this.userID
                  );
                  debugger;
                  this.rowData = this.masticWorkList;
                  this.rowData.map(m=>m['wardName']=m.wardName?.wardName)
                }
              }
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

  linkCellRenderer(params) {
    if(params?.data?.tweetlink){
      return `<a href="${params.data.tweetlink}" target="_blank">${params?.data?.tweetlink}</a>`;
    }else {
      return '';
    }
  }
  
  formatDateForInput(date: Date): string {
    if (date) {
      const isoString = date.toString();
      return isoString.slice(0, 16); // Truncate milliseconds and timezone
    } else {
      return null;
    }
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }

  onQuickFilterChanged() {
    let val = (<HTMLInputElement>document.getElementById('quickFilter')).value;
    this.agGrid.api.setQuickFilter(val);
  }

  OnGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }
  Add() {
    this.router.navigate(['potholework/create']);
  }
}
