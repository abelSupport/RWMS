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
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { MasticWorkModel } from 'src/app/core/models/IMasticWork';
import { BtnCellRenderer } from './button-cell-renderer.component';
@Component({
  selector: 'app-mastic-work-list',
  templateUrl: './mastic-work-list.component.html',
  styleUrls: ['./mastic-work-list.component.scss'],
})
export class MasticWorkListComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  locationForm: FormGroup;
  locationResponce: ILocationResponse;
  locationList: LocationModel[];
  masticWorkList: MasticWorkModel[];

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
    private locationService: LocationService,
    private masticService: MasticworkService
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.columnDefs = [
      {
        headerName: 'Action',
        field: '_id',
        // cellRenderer: 'btnCellRenderer',
        cellRenderer: 'btnCellRenderer',

        minWidth: 180,
      },
      {
        headerName: 'Road Name',
        field: 'locationName',
        minWidth: 150,
      },
      { headerName: '_id', field: '_id', hide: true },
      { headerName: 'Ward Name', field: 'wardName.wardName' },
      { headerName: 'Zone Name', field: 'zoneName' },
      { headerName: 'Work Code', field: 'workCode' },

      { headerName: 'Length (m)', field: 'length' },
      { headerName: 'Width (m)', field: 'width' },
      { headerName: 'cookerRegistrationNo', field: 'cookerRegistrationNo' },
      { headerName: 'Mastic Area Attended (sq. m.)', field: 'masticQuantity' },
      { headerName: 'DBM Area Attended (sq. m.)', field: 'dbmQuantity' },
      { headerName: 'WMM Area Attended (sq. m.)', field: 'wmmQuantity' },
      { headerName: 'Cost(Rs.)', field: 'cost' },
      {
        headerName: 'Date',
        field: 'dataDate',
        valueGetter: (params) => {
          return this.commonService.formatDateForInput(params.data.dataDate);
        },
      },
      {
        headerName: 'Remarks',
        field: 'remarks',
        minWidth: 200,
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
        headerName: 'Modified On',
        field: 'modifiedOn',
        valueGetter: (params) => {
          return this.commonService.formatDateForInput(params.data.modifiedOn);
        },
      },
      { headerName: 'Modified By', field: 'modifiedBy' },
    ];
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
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
    this.masticService.getMasticWork().subscribe(
      (result) => {
        if (result != null) {
          if (result.status === 200) {
            if (this.userRole === 'Data Owner') {
              this.masticWorkList = result.data;
              console.log(this.masticWorkList);
              console.log(this.masticWorkList.map(m=>m.subEngineerName));

              this.rowData = this.masticWorkList;
            } else if (this.userRole === 'Data Viewer' || this.userRole === 'Executive Engineer' || this.userRole === 'Assistant Engineer') {
              this.masticWorkList = result.data;
              console.log(this.masticWorkList);
              const userWardString = sessionStorage.getItem('UserWard');
              const userWards = userWardString.split(',');
              const filteredLocations = this.masticWorkList.filter((location) =>
                userWards.includes(String(location.wardName.wardName))
              );
              this.masticWorkList=filteredLocations
              this.rowData = this.masticWorkList;
            }  else {
              let ward = sessionStorage.getItem('UserWard');
              this.masticWorkList = result.data.filter(
                (f) => f.wardName.wardName === ward
              );                        
              this.masticWorkList=this.masticWorkList.filter(f=>f.subEngineerName._id===this.userID)
              this.rowData = this.masticWorkList;
            }
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

  
  formatDateForInput(date: Date): string {
    if(date){
      const isoString = date.toString();
      return isoString.slice(0, 16); // Truncate milliseconds and timezone
    }else{
      return null
    }
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }

  download() {
    let downloadData = this.masticWorkList.map((m) => {
      return {
        workCode: m.workCode,
        locationName: m.locationName,
        zoneName: m.zoneName,
        description: m.description,
        contractorName: m.contractorName,
        length: m.length,
        width: m.width,
        wardName: m.wardName.wardName,
        coordinates: m.coordinates,
        remarks: m.remarks,
        dataDate:m.dataDate,
        cost: m.cost,
        cookerRegistrationNo: m.cookerRegistrationNo,
        masticQuantity: m.masticQuantity,
        dbmQuantity: m.dbmQuantity,
        wmmQuantity: m.wmmQuantity,
        beforeImagePath:m.beforeImagePath,
        afterImagePath:m.afterImagePath,
        createdOn: m.createdOn,
        createdBy: m.createdBy,
        modifiedOn: m.modifiedOn,
        modifiedBy: m.modifiedBy,
      };
    });

    let fileName =
      'Mastic Work List ' +
      moment(new Date()).format('DDMMYYYY') +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(downloadData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
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
    this.router.navigate(['masticwork/create']);
  }
}
