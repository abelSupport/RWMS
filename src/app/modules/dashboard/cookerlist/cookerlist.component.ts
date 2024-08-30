import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonService } from 'src/app/core/services/common.service';
import{CookerdataService} from 'src/app/core/services/cookerdata.service';
import{CookerModel} from '../../../core/models/CookerModel'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cookerlist',
  templateUrl: './cookerlist.component.html',
  styleUrls: ['./cookerlist.component.scss']
})
export class CookerlistComponent implements OnInit {

  cookerList: CookerModel[];
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

  constructor(private cookerdataService: CookerdataService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private router: Router,
  ){}

  gridOptions = {
    rowHeight: 40,
    getRowHeight: function (params) {
      return 40;
    },
  };
  ngOnInit(): void {
    this.getCookerData();
    this.columnDefs = [
      // {
      //   headerName: 'Action',
      //   field: '_id',
      //   cellRenderer: 'btnCellRenderer',
      // },
      //{ headerName: '_id', field: '_id', hide: true },
      {
        headerName: 'Contractor Name',
        field: 'contractorName',
      },
      { headerName: 'Above9m', field: 'cookerMasterID.Above9m' },
      { headerName: 'CookerRegistrationNo', field: 'cookerMasterID.CookerRegistrationNo' },
      { headerName: 'VisibleOnMap', field: 'cookerMasterID.VisibleOnMap' },
      { headerName: 'Ward Name', field: 'cookerMasterID.Ward' },
      {headerName: 'zoneName',field:'zoneName'},
      {headerName: 'WorkCode',field:'cookerMasterID.WorkCode'},
      {
        headerName: 'Created On',
        field: 'createdOn',
        valueGetter: this.commonService.createdOnDateFormatter,
      },
      { headerName: 'Created By', field: 'createdBy' },
    ];

    this.defaultColDef = {
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
      sortingOrder: ['asc', 'desc'],
    };
  }

  getCookerData(){
    this.cookerdataService.getCookerData().subscribe((result)=>{
      console.log(result);
      if(result.status===200){
        this.cookerList = result.data;
        console.log(this.cookerList)
        this.rowData = result.data;
        console.log(this.rowData)
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

  OnGridReady(params){
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }
  onQuickFilterChanged(){
    let val = (<HTMLInputElement>document.getElementById('quickFilter')).value;
    this.agGrid.api.setQuickFilter(val);
  }

  // Add(){
  //   this.router.navigate(['dashboard/cooker']);
  // }

}
