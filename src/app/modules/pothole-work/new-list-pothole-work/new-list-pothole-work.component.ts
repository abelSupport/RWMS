import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonService } from 'src/app/core/services/common.service';
import { BtnCellRenderer } from '../new-list-pothole-work/button-cell-renderer.component';
import { AfterImageCellRenderer } from '../new-list-pothole-work/after-image-cell-renderer.component';
import { BeforeImageCellRenderer } from '../new-list-pothole-work/before-image-cell-renderer.component';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import Swal from 'sweetalert2';
import { Icon } from 'ol/style';
import { MasticWorkModel } from 'src/app/core/models/IMasticWork';
import * as moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-new-list-pothole-work',
  templateUrl: './new-list-pothole-work.component.html',
  styleUrls: ['./new-list-pothole-work.component.scss']
})
export class NewListPotholeWorkComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  masticWorkList: MasticWorkModel[];

  XLSX:any;
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
    private commonService: CommonService,
  private _fb: FormBuilder,
 private route: ActivatedRoute,
 private router: Router,
 private masticService: MasticworkService


  ){}

  ngOnInit(): void {

   this.getLocation();
   debugger;

    this.columnDefs = [
      {
        headerName: 'Action',
        field: '_id',
        cellRenderer: 'btnCellRenderer',
        minWidth: 250,
      },
      { headerName: 'Zone Name', field: 'zoneName' },
      { headerName: 'Ward Name', field: 'wardName.wardName' },
      {
        headerName: 'Road Name',
        field: 'locationName',
        minWidth: 150,
      },
      { headerName: 'Length (m)', field: 'length' },
      { headerName: 'Width (m)', field: 'width' },
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
      { headerName: 'Modified By', field: 'modifiedBy' },
      { headerName: 'Record Source', field: 'source' },
      {
        headerName: 'Tweet Image',
        field: '_id',
        cellRenderer: 'listTwitterImageCellRenderer',
        afterImage:'',
        minWidth: 200,
      },
      {
        headerName: 'Before Image',
        field: '_id',
        cellRenderer: 'beforeImageCellRenderer',
        afterImage:'',
        minWidth: 200,
      },
      {
        headerName: 'After Image',
        field: '_id',
        cellRenderer: 'afterImageCellRenderer',
        afterImage:'',
        minWidth: 200,
      },
      

    ];

    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
      afterImageCellRenderer:AfterImageCellRenderer,
      beforeImageCellRenderer:BeforeImageCellRenderer,
      //listTwitterImageCellRenderer:ListTwitterImageCellRenderer
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
  
  getLocation(){
    this.masticService.getPotholeWork().subscribe((result)=>{

      if(result != null){
        debugger;
        if(result.status === 200){
          this.masticWorkList = result.data;
          this.rowData = this.masticWorkList;

        }
      }
      else {
        Swal.fire({
          title: 'Seesion Expired',
          text: 'Login Again to Continue',
          icon: 'warning',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.value) {
            this.logout();
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

    

  logout(){
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();

  }

  Add(){
    this.router.navigate(['potholework/add'])
  }

  onQuickFilterChanged(){
    let val = (<HTMLInputElement>document.getElementById('quickFilter')).value;
    this.agGrid.api.setQuickFilter(val);
  }

  OnGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }

  download() {
    
  
    let fileName = 'Pothole Work List ' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }
  
}