import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { CustomVFS } from 'src/app/core/services/pdfmakefonts';
import * as XLSX from 'xlsx';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
import { ChartType, ChartOptions, ChartDataset } from 'chart.js';
import { IconSetService } from '@coreui/icons-angular';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { LocationModel } from 'src/app/core/models/ILocation';
import {
  IModulesInLocationResponse,
  ModulesInLocationModel,
} from 'src/app/core/models/IModules-In-Location';
import {
  DataEntryGroupModel,
  DataEntryModel,
  IDataEntryModelResponce,
} from 'src/app/core/models/IDataEntry';
import { AssetInstanceListModel } from 'src/app/core/models/IAssetInstance';
import { LocationService } from 'src/app/core/services/location.service';
import { ReportService } from '../../../core/services/report.service';
import { CommonService } from 'src/app/core/services/common.service';
import { AgGridAngular } from 'ag-grid-angular';
import { BtnCellRenderer } from './button-cell-renderer.component';
import { WeightedCellRendererComponent } from './weighted-cell-renderer.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  locationList: LocationModel[];

  userRole: String;
  locationListProgress: any[] = [];
  moduleInLocationList: ModulesInLocationModel[] = [];
  dataEntryList: DataEntryModel[];
  dataEntryDataList: DataEntryModel[] = [];
  assetInstanceList: AssetInstanceListModel[] = [];
  dataEntryModel: DataEntryModel;
  dataentryGroup: DataEntryGroupModel;
  DatesBetweenDatesList: Date[];

  modulesInLocationResponse: IModulesInLocationResponse;
  dataEntryModelResponce: IDataEntryModelResponce;
  reportDataListFinancial: any = [];
  reportDataListPhysical: any = [];
  MonthsBetweenDatesList: any;
  lastMonth: Date;
  monthBforlastMonth: Date;

  totalRoads: any=0;
  completedRoads: any=0;
  notStartedRoads: any=0;
  delayedRoads: any=0;
  inProgressRoads: any=0;
  onHoldRoads: any=0;

  totalRoadsLength: any = 0;
  completedRoadsLength: any = 0;
  notStartedRoadsLength: any = 0;
  delayedRoadsLength: any = 0;
  inProgressRoadsLength: any = 0;
  onHoldRoadsLength: any = 0;

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

  Data = {};
  currentRoute: any = '';

  gridOptions = {
    headerHeight: 45,
    rowHeight: 40,
    onRowClicked: this.onRowClicked.bind(this),
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public iconSet: IconSetService,
    private locationService: LocationService,
    private reportService: ReportService,
    private commonService: CommonService
  ) {}

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

  mil: any[] = [];
  getLocationTable() {
    this.locationList.forEach((f) => {
      this.mil = this.moduleInLocationList.filter((lm) => {
        if (lm.location != null) {
          return String(lm?.location?._id) === String(f._id);
        } else return false;
      });

      let pqc = this.mil.filter((mil) => {
        return mil.module.moduleName === 'Completion of Crust (PQC)';
      });
      let exc = this.mil.filter((mil) => {
        return mil.module.moduleName === 'Excavation';
      });
      let duct = this.mil.filter((mil) => {
        return mil.module.moduleName === 'Laying of Duct';
      });
      let swd = this.mil.filter((mil) => {
        return mil.module.moduleName === 'SWD Work';
      });

      let weightedProgress = Number(
        (pqc[0].cumulativeQuantity /
          (pqc[0].quantity == 0 ? 1 : pqc[0].quantity)) *
          100 *
          0.3 +
          (exc[0].cumulativeQuantity /
            (exc[0].quantity == 0 ? 1 : exc[0].quantity)) *
            100 *
            0.2 +
          (duct[0].cumulativeQuantity /
            (duct[0].quantity == 0 ? 1 : duct[0].quantity)) *
            100 *
            0.2 +
          (swd[0].cumulativeQuantity /
            (swd[0].quantity == 0 ? 1 : swd[0].quantity)) *
            100 *
            0.3
      ).toFixed(2);

      // debugger;

      let obj = {
        name: f.locationName,
        contractorName: f.contractorName,
        ward: f.wardName.wardName,
        zone: f.wardName.Zone,
        workCode: f.workCode,
        length: f.length,
        usage: Number((pqc[0].cumulativeQuantity / f.length) * 100).toFixed(2),
        weightedProgress: weightedProgress ? weightedProgress : 0,
        period:
          '' +
          this.commonService.DateFormatter(f.startDate) +
          ' to ' +
          this.commonService.DateFormatter(f.endDate) +
          '',
        // payment: 'Mastercard',
        // activity: '10 sec ago',
        // avatar: './assets/img/avatars/1.jpg',
        status: f.status,
        color: 'success',
        _id: f._id,
      };

      this.locationListProgress.push(obj);
    });
    debugger;
    this.rowData = this.locationListProgress;

    if (this.currentRoute != '' && this.object != '') {
      if (this.rowData.length > 0) {
        let filteredList = this.rowData.filter(
          (item) =>
            (this.object.zone === '' || this.object.zone.includes(item.zone)) &&
            (this.object.ward === '' || this.object.ward.includes(item.ward)) &&
            (this.object.contractor === '' ||
              this.object.contractor.includes(item.contractorName)) &&
            (this.object.status === '' ||
              this.object.status.includes(item.status)) &&
            (this.object.roadName === '' ||
              this.object.roadName.includes(item.name))
        );
        this.rowData = filteredList;
        // this.gridApi.refreshClientSideRowModel('everything'); // You can specify the refresh type ('aggregate', 'everything', 'pagination', etc.)
      }
    }
    debugger;

    // console.log(this.rowData);
  }

  onRowClicked(params: any) {
    // Access the data for the clicked row
    const rowData = params.data;
    // console.log('Row Clicked - Road Name:', rowData.name);

    this.router.navigate(['location/addmoduledetails/' + params.data._id]);
    window.scrollTo(0, 0);
  }

  download() {
    let fileName =
      'Location Wise Task Details Report ' +
      moment(new Date()).format('DDMMYYYY') +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  object: any;

  async ngOnInit() {
    this.currentRoute = '';
    this.object = {};

    this.userRole = sessionStorage.getItem('UserRole');
    if (this.userRole === 'Data Owner') {
      this.locationService.getLocations().subscribe(
        (result) => {
          if (result != null) {
            if (result.status === 200) {
              this.totalRoadsLength = 0;
              this.locationList = result.data;
              this.locationList=this.locationList.filter(f=>String(f.roadType)===String("Mega CC Road"))

              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );
              this.totalRoads = this.locationList.length;
              this.totalRoadsLength = this.locationList.reduce(
                (acc, obj) => acc + obj.length,
                0
              );
              this.inProgressRoads = this.locationList.filter(
                (f) => f.status === 'In Progress'
              ).length;

              const startedRoads = this.locationList.filter(
                (f) => f.status === 'In Progress'
              );

              const labels = startedRoads.map(
                (location) => location.locationName
              );
              const dataSets = startedRoads.map((location) => location.length);

              this.Data = {
                labels: labels,
                options: {
                  title: {
                    display: true,
                    text: 'Roads Details Chart',
                  },
                },

                datasets: [
                  {
                    label: 'Total Roads - ' + this.inProgressRoads,
                    backgroundColor: '#f87979',
                    data: dataSets,
                  },
                ],
              };

              this.inProgressRoadsLength = this.locationList
                .filter((f) => f.status === 'In Progress')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.completedRoads = this.locationList.filter(
                (f) => f.status === 'Completed'
              ).length;
              this.completedRoadsLength = this.locationList
                .filter((f) => f.status === 'Completed')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.notStartedRoads = this.locationList.filter(
                (f) => f.status === 'Not Started'
              ).length;
              this.notStartedRoadsLength = this.locationList
                .filter((f) => f.status === 'Not Started')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.delayedRoads = this.locationList.filter(
                (f) => f.status === 'Delayed'
              ).length;
              this.delayedRoadsLength = this.locationList
                .filter((f) => f.status === 'Delayed')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.onHoldRoads = this.locationList.filter(
                (f) => f.status === 'On Hold'
              ).length;
              this.onHoldRoadsLength = this.locationList
                .filter((f) => f.status === 'On Hold')
                .reduce((acc, obj) => acc + obj.length, 0);
              if (this.locationList.length > 0) {
                this.locationService
                  .getAllModulInLocationForDashboard()
                  .subscribe((result) => {
                    if (result != null) {
                      if (result) {
                        debugger;
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
    } else if (this.userRole === 'Data Viewer' || this.userRole === 'Executive Engineer') {
      this.locationService.getLocations().subscribe(
        (result) => {
          if (result != null) {
            if (result.status === 200) {
              this.totalRoadsLength = 0;
              this.locationList = result.data;
              this.locationList=this.locationList.filter(f=>String(f.roadType)===String("Mega CC Road"))

              const userWardString = sessionStorage.getItem('UserWard');

              // Split the UserWard string into an array of ward names
              const userWards = userWardString.split(',');

              // Filter the locationList based on the ward names
              const filteredLocations = this.locationList.filter((location) =>
                userWards.includes(String(location.wardName.wardName))
              );
              debugger

              this.locationList = filteredLocations.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );
              this.totalRoads = this.locationList.length;
              this.totalRoadsLength = this.locationList.reduce(
                (acc, obj) => acc + obj.length,
                0
              );
              this.inProgressRoads = this.locationList.filter(
                (f) => f.status === 'In Progress'
              ).length;

              const startedRoads = this.locationList.filter(
                (f) => f.status === 'In Progress'
              );

              const labels = startedRoads.map(
                (location) => location.locationName
              );
              const dataSets = startedRoads.map((location) => location.length);

              this.Data = {
                labels: labels,
                options: {
                  title: {
                    display: true,
                    text: 'Roads Details Chart',
                  },
                },

                datasets: [
                  {
                    label: 'Total Roads - ' + this.inProgressRoads,
                    backgroundColor: '#f87979',
                    data: dataSets,
                  },
                ],
              };

              this.inProgressRoadsLength = this.locationList
                .filter((f) => f.status === 'In Progress')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.completedRoads = this.locationList.filter(
                (f) => f.status === 'Completed'
              ).length;
              this.completedRoadsLength = this.locationList
                .filter((f) => f.status === 'Completed')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.notStartedRoads = this.locationList.filter(
                (f) => f.status === 'Not Started'
              ).length;
              this.notStartedRoadsLength = this.locationList
                .filter((f) => f.status === 'Not Started')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.delayedRoads = this.locationList.filter(
                (f) => f.status === 'Delayed'
              ).length;
              this.delayedRoadsLength = this.locationList
                .filter((f) => f.status === 'Delayed')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.onHoldRoads = this.locationList.filter(
                (f) => f.status === 'On Hold'
              ).length;
              this.onHoldRoadsLength = this.locationList
                .filter((f) => f.status === 'On Hold')
                .reduce((acc, obj) => acc + obj.length, 0);
              if (this.locationList.length > 0) {
                this.locationService
                  .getAllModulInLocationForDashboard()
                  .subscribe((result) => {
                    if (result != null) {
                      if (result) {
                        debugger;
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
          this.totalRoadsLength = 0;
          if (result != null) {
            if (result.status === 200) {
              this.locationList = result.data;
              this.locationList=this.locationList.filter(f=>String(f.roadType)===String("Mega CC Road"))

              this.locationList = this.locationList.sort((a, b) =>
                String(a.locationName).localeCompare(String(b.locationName))
              );
              this.totalRoads = this.locationList.length;

              this.totalRoadsLength = this.locationList.reduce(
                (acc, obj) => acc + obj.length,
                0
              );

              this.inProgressRoads = this.locationList.filter(
                (f) => f.status === 'In Progress'
              ).length;

              this.inProgressRoadsLength = this.locationList
                .filter((f) => f.status === 'In Progress')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.completedRoads = this.locationList.filter(
                (f) => f.status === 'Completed'
              ).length;
              this.completedRoadsLength = this.locationList
                .filter((f) => f.status === 'Completed')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.notStartedRoads = this.locationList.filter(
                (f) => f.status === 'Not Started'
              ).length;
              this.notStartedRoadsLength = this.locationList
                .filter((f) => f.status === 'Not Started')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.delayedRoads = this.locationList.filter(
                (f) => f.status === 'Delayed'
              ).length;
              this.delayedRoadsLength = this.locationList
                .filter((f) => f.status === 'Delayed')
                .reduce((acc, obj) => acc + obj.length, 0);

              this.onHoldRoads = this.locationList.filter(
                (f) => f.status === 'On Hold'
              ).length;
              this.onHoldRoadsLength = this.locationList
                .filter((f) => f.status === 'On Hold')
                .reduce((acc, obj) => acc + obj.length, 0);

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
    this.iconSet.icons = { ...freeSet, ...brandSet, ...flagSet };

    this.route.queryParams.subscribe((params) => {
      this.currentRoute = params['param1'];
      this.object = JSON.parse(params['param2']);
    });

    this.columnDefs = [
      {
        headerName: '#',
        minWidth: 10,
        valueGetter: 'node.rowIndex + 1',
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Work Code',
        field: 'workCode',
        minWidth: 100,
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Roads',
        field: 'name',
        minWidth: 200,
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Ward',
        field: 'ward',
        minWidth: 60,
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Zone',
        field: 'zone',
        minWidth: 110,
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Status',
        field: 'status',
        minWidth: 100,
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Length(m)',
        field: 'length',
        minWidth: 80,
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Progress',
        field: 'usage',
        minWidth: 190,
        cellRenderer: 'btnCellRenderer',
        headerClass: 'custom-ag-header',
      },
      {
        headerName: 'Weighted Progress',
        field: 'weightedProgress',
        minWidth: 190,
        cellRenderer: 'weightedCellRenderer',
        headerClass: 'custom-ag-header',
      },
    ];

    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: BtnCellRenderer,
      weightedCellRenderer: WeightedCellRendererComponent,
    };
    this.context = { componentParent: this };

    this.defaultColDef = {
      sortable: true,
      flex: 1,
      minwidth: 15,
      cellStyle: {
        fontSize: '14px',
      },

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
    // this.onSubmit1();
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  getDays(startDate: Date, endDate: Date): number {
    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  sampl: any = [];
  sampl1: any = [];
  onSubmit() {
    this.reportDataListFinancial = [];
    const chartLabl = [];
    this.dataEntryDataList = [];
    this.reportDataListPhysical = [];

    this.reportService.getDataEntriesModulesInLocation().subscribe(
      (result) => {
        if (result != null) {
          if (result) {
            this.moduleInLocationList = result.data;
            this.dataEntryDataList = this.dataEntryModelResponce.data;

            // 1-March-2024 My code
            this.sampl = this.moduleInLocationList;
            this.sampl = this.sampl.features;

            this.sampl.forEach((s) => {
              this.sampl1.push(s.properties);
            });

            this.locationList.forEach((loc) => {
              const moduleInLoc = this.sampl1.filter(
                (f) => f.location._id === loc._id
              );

              const tc = [];
              const cc = [];
              const moduleObjArr = [];

              if (moduleInLoc) {
                moduleInLoc.forEach((modInLoc) => {
                  const moduletotalCost = modInLoc.totalCost;
                  const rate = modInLoc.rateofwork;
                  const consumedQntyFinancial = [];
                  const dataFinancial = this.dataEntryDataList.filter(
                    (f) => f.module._id === modInLoc._id
                  );
                  if (dataFinancial) {
                    dataFinancial.forEach((r) => {
                      consumedQntyFinancial.push(
                        Number(r.attributeValues['consumedquantity'])
                      );
                    });

                    const cost = consumedQntyFinancial.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const modulecurrentCost = cost * rate;
                    tc.push(moduletotalCost);
                    cc.push(modulecurrentCost);
                  }

                  //Financial Progres-----------------------------------------------------------------------------------------

                  const moduleQuantity = [];
                  const moduleDays = [];
                  const consumedQuantity = [];
                  const consumedDays = [];

                  const mQnty = modInLoc.quantity;
                  const mDays = modInLoc.totaldays;
                  const consumedQntyPhysical = [];
                  const dataPhysical = this.dataEntryDataList.filter(
                    (f) => f.module._id === modInLoc._id
                  );
                  if (dataPhysical) {
                    dataPhysical.forEach((r) => {
                      consumedQntyPhysical.push(
                        Number(r.attributeValues['consumedquantity'])
                      );
                    });
                    const cQnty = consumedQntyPhysical.reduce(
                      (a, b) => a + b,
                      0
                    );
                    const cDays = this.getDays(
                      new Date(modInLoc.startDate),
                      new Date()
                    );

                    moduleQuantity.push(mQnty);
                    moduleDays.push(mDays);
                    consumedDays.push(cDays);
                    consumedQuantity.push(cQnty);
                  }

                  const ccost = consumedQuantity.reduce((a, b) => a + b, 0);
                  const tcost = moduleQuantity.reduce((a, b) => a + b, 0);
                  const ActualWorkCompleted =
                    (ccost / tcost) * 100 ? (ccost / tcost) * 100 : 0;

                  const cdays = consumedDays.reduce((a, b) => a + b, 0);
                  const tdays = moduleDays.reduce((a, b) => a + b, 0);

                  const pwc =
                    (((tcost / tdays) * cdays) / tcost) * 100
                      ? (((tcost / tdays) * cdays) / tcost) * 100
                      : 0;
                  const PlannedWorkCompleted = pwc < 100 ? pwc : 100;
                  const Status =
                    ActualWorkCompleted == 100
                      ? 'Completed'
                      : ActualWorkCompleted != 0 &&
                        ActualWorkCompleted == PlannedWorkCompleted
                      ? 'On Track'
                      : ActualWorkCompleted == 0 && PlannedWorkCompleted == 0
                      ? 'Not Started'
                      : 'Delayed';

                  let objArrFinancial = {
                    locationName: loc.locationName,
                    moduleName: modInLoc.module.moduleName,
                    priority: modInLoc.priority,
                    PlannedWorkCompleted: parseFloat(
                      String(PlannedWorkCompleted)
                    ).toFixed(2),
                    ActualWorkCompleted: parseFloat(
                      String(ActualWorkCompleted)
                    ).toFixed(2),
                    Status: Status,
                  };
                  moduleObjArr.push(objArrFinancial);
                });
              }

              //Physical Progress---------------------
              moduleObjArr.sort(compare_qty);
              this.reportDataListPhysical.push(moduleObjArr[0]);

              //Financial Progress---------------------
              const ccost = cc.reduce((a, b) => a + b, 0);
              const tcost = tc.reduce((a, b) => a + b, 0);
              const percent = (ccost / tcost) * 100 ? (ccost / tcost) * 100 : 0;

              //Both reports in one obj-----------------------------
              let objArrFinancial = {
                workCode: loc.workCode,

                locationName: loc.locationName,
                moduleName: moduleObjArr[0].moduleName,
                priority: moduleObjArr[0].priority,
                PlannedWorkCompleted: moduleObjArr[0].PlannedWorkCompleted,
                ActualWorkCompleted: moduleObjArr[0].ActualWorkCompleted,
                Status: moduleObjArr[0].Status,
                totalCost: (tcost / 10000000).toFixed(2),
                currentCost: (ccost / 10000000).toFixed(2),
                percentage: parseFloat(String(percent)).toFixed(2),
              };
              this.reportDataListFinancial.push(objArrFinancial);
            });
          } else {
            alert('No Data Found');
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
        alert(err);
      }
    );

    this.reportService.getDataEntriesModulesInLocation().subscribe(
      (result) => {
        if (result != null) {
          if (result) {
            this.modulesInLocationResponse = result[0];
            this.dataEntryModelResponce = result[1];
            this.moduleInLocationList = this.modulesInLocationResponse.data;
            this.dataEntryDataList = this.dataEntryModelResponce.data;
            this.locationList.forEach((loc) => {
              const moduleInLoc = this.moduleInLocationList.filter(
                (f) => f.location._id === loc._id
              );
              const moduleObjArr = [];
              const isPipeofLaying = moduleInLoc.find(
                (f) => f.module.moduleName === 'Excavation'
              );
              moduleInLoc.forEach((modInLoc) => {
                const moduleQuantity = [];
                const moduleDays = [];
                const consumedQuantity = [];
                const consumedDays = [];
                const mQnty = modInLoc.quantity;
                const mDays = modInLoc.totaldays;
                const consumedQnty = [];
                const data = this.dataEntryDataList.filter(
                  (f) => f.module._id === modInLoc._id
                );
                if (data) {
                  data.forEach((r) => {
                    consumedQnty.push(
                      Number(r.attributeValues['consumedquantity'])
                    );
                  });
                  const cQnty = consumedQnty.reduce((a, b) => a + b, 0);
                  const cDays = this.getDays(
                    new Date(modInLoc.startDate),
                    new Date()
                  );

                  moduleQuantity.push(mQnty);
                  moduleDays.push(mDays);
                  consumedDays.push(cDays);
                  consumedQuantity.push(cQnty);
                }
                const ccost = consumedQuantity.reduce((a, b) => a + b, 0);
                const tcost = moduleQuantity.reduce((a, b) => a + b, 0);
                const ActualWorkCompleted =
                  (ccost / tcost) * 100 ? (ccost / tcost) * 100 : 0;

                const cdays = consumedDays.reduce((a, b) => a + b, 0);
                const tdays = moduleDays.reduce((a, b) => a + b, 0);

                const pwc =
                  (((tcost / tdays) * cdays) / tcost) * 100
                    ? (((tcost / tdays) * cdays) / tcost) * 100
                    : 0;
                const PlannedWorkCompleted = pwc < 100 ? pwc : 100;
                const Status =
                  ActualWorkCompleted == 100
                    ? 'Completed'
                    : ActualWorkCompleted != 0 &&
                      ActualWorkCompleted == PlannedWorkCompleted
                    ? 'On Track'
                    : ActualWorkCompleted == 0 && PlannedWorkCompleted == 0
                    ? 'Not Started'
                    : 'Delayed';

                let objArr = {
                  locationName: loc.locationName,
                  moduleName: modInLoc.module.moduleName,
                  priority: modInLoc.priority,
                  PlannedWorkCompleted: parseFloat(
                    String(PlannedWorkCompleted)
                  ).toFixed(2),
                  ActualWorkCompleted: parseFloat(
                    String(ActualWorkCompleted)
                  ).toFixed(2),
                  Status: Status,
                };
                moduleObjArr.push(objArr);
              });

              moduleObjArr.sort(compare_qty);

              this.reportDataListPhysical.push(moduleObjArr[0]);
            });
          } else {
            alert('No Data Found');
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
        alert(err);
      }
    );
  }

  roadClick(id: string) {
    // console.log('road clicked', id);
    this.router.navigate(['/location/addmoduledetails/' + id]);
  }

  logOut() {
    this.router.navigate(['/login/']);
    sessionStorage.clear();
    window.location.reload();
  }
}

function compare_qty(a, b) {
  if (a.priority > b.priority) {
    return -1;
  } else if (a.priority < b.priority) {
    return 1;
  } else {
    return 0;
  }
}
