import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LocationModel } from 'src/app/core/models/ILocation';
import { ModulesInLocationModel } from 'src/app/core/models/IModules-In-Location';
import { CommonService } from 'src/app/core/services/common.service';
import { LocationService } from 'src/app/core/services/location.service';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { AgGridAngular } from 'ag-grid-angular';


@Component({
  selector: 'app-zone-wise-report',
  templateUrl: './zone-wise-report.component.html',
  styleUrls: ['./zone-wise-report.component.scss']
})
export class ZoneWiseReportComponent implements OnInit{
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  locationList: LocationModel[];
  moduleInLocationList: ModulesInLocationModel[] = [];

  userRole: String;

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
  rowData: any = [];
  gridOption;

  constructor(
    private router: Router,
    private locationService: LocationService,
    private commonService: CommonService
  ) {
    this.userRole = sessionStorage.getItem('UserRole');
    if (this.userRole === 'Data Owner') {
      this.locationService.getLocations().subscribe(
        (result) => {
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );

              if (this.locationList.length > 0) {
                this.locationService
                  .getAllModulInLocationForDashboard()
                  .subscribe((result) => {
                    if (result != null) {
                      if (result) {
                        this.moduleInLocationList = result.data;
                        if (this.moduleInLocationList.length > 0) {
                          this.getLocationTable();
                        }
                      } else {
                        alert('No Data Found');
                      }
                    } else {
                    }
                  });
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
    } else if (this.userRole === 'Data Viewer') {
      this.locationService.getLocations().subscribe(
        (result) => {
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              const userWardString = sessionStorage.getItem('UserWard');

              // Split the UserWard string into an array of ward names
              const userWards = userWardString.split(',');

              // Filter the locationList based on the ward names
              const filteredLocations = this.locationList.filter((location) =>
                userWards.includes(String(location.wardName.wardName))
              );
              this.locationList=filteredLocations
              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );

              if (this.locationList.length > 0) {
                this.locationService
                  .getAllModulInLocationForDashboard()
                  .subscribe((result) => {
                    if (result != null) {
                      if (result) {
                        this.moduleInLocationList = result.data;
                        if (this.moduleInLocationList.length > 0) {
                          this.getLocationTable();
                        }
                      } else {
                        alert('No Data Found');
                      }
                    } else {
                    }
                  });
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
    } else {
      this.locationService.getLocationByUser().subscribe(
        (result) => {
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );

              if (this.locationList.length > 0) {
                this.locationService
                  .getAllModulInLocationForDashboard()
                  .subscribe((result) => {
                    if (result != null) {
                      if (result) {
                        this.moduleInLocationList = result.data;
                        if (this.moduleInLocationList.length > 0) {
                          this.getLocationTable();
                        }
                      } else {
                        alert('No Data Found');
                      }
                    } else {
                    }
                  });
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
  }

  mil: any[] = [];
  filteredList: any = [];
  // getLocationTable() {
  //   this.rowData = [];
  //   this.filteredList = this.moduleInLocationList.map((item2) => {
  //     // 
  //     let correspondingItem = this.locationList.find(
  //       (item1) => item1._id === item2.location._id
  //     );
  //     return {
  //       ...correspondingItem,
  //       taskName: item2.module.moduleName,
  //       Quantity: item2.quantity,
  //       cumulativeQuantity: item2.cumulativeQuantity,
  //       zone: correspondingItem.zoneName,
  //     };
  //   });
  //   debugger;
  //   this.rowData = this.locationService.getReport( this.filteredList, 'ZoneWise');
   
  // }

  getLocationTable() {
    this.rowData = [];
    this.filteredList = this.moduleInLocationList.map((item2) => {
      // 
      let correspondingItem = this.locationList.find(
        (item1) => item1._id === item2.location._id
      );
      if (correspondingItem != undefined) {
        return {
          ...correspondingItem,
          taskName: item2.module.moduleName,
          Quantity: item2.quantity,
          cumulativeQuantity: item2.cumulativeQuantity,
          zone: correspondingItem.zoneName,
        };
      }
    });
    this.filteredList = this.filteredList.filter((item) => item !== undefined);
    debugger;
    this.rowData = this.locationService.getReport( this.filteredList, 'ZoneWise');
   
  }

  gridOptions = {
    rowHeight: 40,
    getRowHeight: function (params) {
      return 40;
    },
  };

  ngOnInit() {
    this.rowData = [];
    this.columnDefs = [
      {
        headerName: 'Zone',
        field: 'zoneName',
        cellStyle: { 'font-weight': 'bold' },
        minWidth: 100,
      },
      {
        headerName: 'Task',
        field: 'taskName',
        minWidth: 200,
      },
      
      {
        headerName: 'Total Quantity',
        field: 'totalQuantity',
        minWidth: 100,
      },
      {
        headerName: 'Total Cumulative Quantity',
        field: 'totalCumulativeQuantity',
        minWidth: 100,
      },
      {
        headerName: '% Progress',
        field: 'percentageProgress',
        minWidth: 100,
      },
    ];

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

  download() {
    let fileName =
      'Zone Wise Report' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }

}
