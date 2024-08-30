import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { LocationService } from 'src/app/core/services/location.service';
import { UserService } from 'src/app/core/services/user.service';
import { User } from 'src/app/core/models/IUser';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import 'jspdf-autotable';
import { CustomVFS } from 'src/app/core/services/pdfmakefonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-pothole-dashboard',
  templateUrl: './pothole-dashboard.component.html',
  styleUrls: ['./pothole-dashboard.component.scss'],
})
export class PotholeDashboardComponent implements OnInit {
  totalRoads: any;
  completedRoads: any;
  totalRoadsLength: any;
  onHoldRoads: any;
  onHoldRoadsLength: any;
  inProgressRoads: any;
  notStartedRoads: any;

  now = new Date();
  createdOn24hrBefore = new Date(this.now.getTime() - 24 * 60 * 60 * 1000);

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

  wards: any = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F/N',
    'F/S',
    'G/S',
    'G/N',
    'H/E',
    'H/W',
    'K/E',
    'K/W',
    'P/S',
    'P/N',
    'R/S',
    'R/C',
    'R/N',
    'M/E',
    'M/W',
    'L',
    'N',
    'S',
    'T',
    'EEH',
    'WEH',
  ];
  // wards: any = ['EEH'];

  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  wardList: any;
  userList: User[];
  potholeUsers: any;

  constructor(
    private masticWorkService: MasticworkService,
    private locationService: LocationService,
    private userService: UserService,
    private potholeUserService: PotholeUserService
  ) {
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
    this.getWards();
    this.getUsers();
  }

  getWards() {
    this.locationService.getWards().subscribe(
      (result) => {
        if (result.status === 200) {
          this.wardList = result.data;
          console.log(this.wardList);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (result) => {
        this.getPotholeWork();
        if (result != null) {
          if (result.status === 200) {
            this.userList = result.data;
            this.userList = this.userList.filter(
              (f) => f.roleName === 'Assistant Engineer'
            );

            // console.log(this.userList);
          }
        } else {
        }
      },
      (err) => {}
    );
  }

  getPotholeWork() {
    this.masticWorkService.getPotholeWork().subscribe((result) => {
      if (result) {
        let data = result.data;
        this.potholeUserService.getPotholeUsers().subscribe((result) => {
          if (result.status === 200) {
            this.potholeUsers = result.data;
            data.forEach((row) => {
              const matchedUser = this.potholeUsers.find(
                (user) => user._id === row.subEngineerName
              );
              if (matchedUser) {
                row.userName = matchedUser.userName;
              }
            });
            let wardWiseList = [];

            data = data.filter((f) => String(f?.userName) !== '7020325511');
            let totalcount = 0;
            let totalcompleted = 0;
            let totalpending = 0;
            let totaltootkLessthan2hr = 0;
            let totalpending24hrcount = 0;
            let totaltookMoreThan24hrCount = 0;
            this.wards.forEach((element) => {
              let filteredWards = data.filter(
                (f) => f.wardName.wardName === element
              );
              let count = filteredWards.length;
              totalcount = totalcount + count;
              let tookMoreThan24hr = filteredWards.filter(
                (f) => f?.modifiedOn !== null
              );

              tookMoreThan24hr = tookMoreThan24hr.filter((f) => {
                let reportedDate = new Date(f.dataDate);
                let attendedDate = new Date(f.modifiedOn);
                let timeDifference =
                  Number(attendedDate) - Number(reportedDate);
                let hoursDifference = timeDifference / (1000 * 60 * 60);
                console.log(
                  reportedDate,
                  attendedDate,
                  timeDifference,
                  hoursDifference
                );
                return hoursDifference > 24;
              });
              tookMoreThan24hr = tookMoreThan24hr.filter(
                (f) => String(f.source) !== String('BulkUpload')
              );

              let tookMoreThan24hrCount = tookMoreThan24hr.length;
              totaltookMoreThan24hrCount =
                totaltookMoreThan24hrCount + tookMoreThan24hrCount;

              let lassThan2hr = filteredWards.filter(
                (f) => f?.modifiedOn !== null
              );
              lassThan2hr = lassThan2hr.filter((f) => {
                let reportedDate = new Date(f.dataDate);
                let attendedDate = new Date(f.modifiedOn);
                let timeDifference =
                  Number(attendedDate) - Number(reportedDate);
                let hoursDifference = timeDifference / (1000 * 60 * 60);
                //  console.log( reportedDate, attendedDate, timeDifference, hoursDifference );
                return hoursDifference < 2;
              });

              lassThan2hr = lassThan2hr.filter(
                (f) => String(f.source) !== String('BulkUpload')
              );

              let tookLessThan2hrCount = lassThan2hr.length;
              totaltootkLessthan2hr =
                totaltootkLessthan2hr + tookLessThan2hrCount;

              let completed = filteredWards.filter(
                (f) =>
                  (f.beforeImagePath != null && f.afterImagePath != null) ||
                  (f.dataDate !== null && f.modifiedOn !== null)
              ).length;
              totalcompleted = totalcompleted + completed;

              let pending = filteredWards.filter((f) => {
                if (f.source === 'MobileApp') {
                  return (
                    f.beforeImagePath !== null && f.afterImagePath === null
                  );
                } else if (f.source === 'BulkUpload') {
                  return f.dataDate !== null && f.modifiedOn === null;
                } else if (f.source === 'Twitter') {
                  return f.afterImagePath === null;
                }
                return false;
              });
              let pendingc = pending.length;
              totalpending = totalpending + pendingc;

              let pending24hr = filteredWards.map((f) => {
                let date = new Date(f.dataDate);
                date.setHours(date.getHours() - 5);
                date.setMinutes(date.getMinutes() - 30);
                f.dataDate = date;
                return f;
              });

              pending24hr = pending24hr.filter(
                (f) => String(f.source) !== String('BulkUpload')
              );

              let pending24hrcount = pending24hr.filter(
                (f) =>
                  (f.beforeImagePath != null &&
                    f.afterImagePath === null &&
                    f.dataDate < this.createdOn24hrBefore) ||
                  (f.beforeImagePath === null &&
                    f.afterImagePath === null &&
                    f.dataDate < this.createdOn24hrBefore &&
                    f.modifiedOn === null) ||
                  (f.beforeImagePath === null &&
                    f.afterImagePath === null &&
                    f.dataDate === null &&
                    f.modifiedOn === null)
              );

              pending24hrcount = pending24hrcount.length;
              totalpending24hrcount = totalpending24hrcount + pending24hrcount;
              let obj = {
                wardName: element,
                count: count,
                completed: completed,
                pending: pendingc,
                pending24hr: pending24hrcount,
                totaltookMoreThan24hrCount: tookMoreThan24hrCount,
                lessThan2hr: tookLessThan2hrCount,
                userName: this.getNameByWardName(element),
                mobileNo: this.getPhoneNoByWardName(element),
              };
              wardWiseList.push(obj);
            });

            let obj = {
              wardName: 'Total',
              count: totalcount,
              completed: totalcompleted,
              pending: totalpending,
              pending24hr: totalpending24hrcount,
              totaltookMoreThan24hrCount: totaltookMoreThan24hrCount,
              lessThan2hr: totaltootkLessthan2hr,
              userName: '',
              mobileNo: '',
            };
            this.rowData = wardWiseList;
            this.rowData.push(obj);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.defaultColDef = {
      sortable: true,
      flex: 1,
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
    this.columnDefs = [
      {
        headerName: 'Ward',
        field: 'wardName',
        minWidth: '100',
      },
      {
        headerName: 'No. of Potholes Reported',
        field: 'count',
        minWidth: '200',
      },
      {
        headerName: 'No. of Potholes Attended',
        field: 'completed',
        minWidth: '200',
      },
      {
        headerName: 'No. of Potholes Pending',
        field: 'pending',
        minWidth: '200',
      },
      {
        headerName: 'No. of Potholes Pending more than 24 Hr.',
        field: 'pending24hr',
        minWidth: '200',
      },
      {
        headerName:
          ' No. Of potholes Attended (More than 24hrs time taken to attend)',
        field: 'totaltookMoreThan24hrCount',
        minWidth: '300',
      },
      {
        headerName:
          ' No. Of potholes Attended (Less than 2 hr between before & after)',
        field: 'lessThan2hr',
        minWidth: '300',
      },

      {
        headerName: 'AE Name',
        field: 'userName',
        minWidth: '150',
      },
      {
        headerName: 'AE Mobile No',
        field: 'mobileNo',
        minWidth: '150',
      },
    ];
  }

  getNameByWardName(wardName: string): string | undefined {
    for (const person of this.userList) {
      for (const wardList of person.wards) {
        for (const ward of wardList) {
          if (ward.wardName === wardName) {
            return String(person.firstName);
          }
        }
      }
    }
    return undefined; // Return undefined if no matching wardName is found
  }

  getPhoneNoByWardName(wardName: string): string | undefined {
    for (const person of this.userList) {
      for (const wardList of person.wards) {
        for (const ward of wardList) {
          if (ward.wardName === wardName) {
            return String(person.mobileNo);
          }
        }
      }
    }
    return undefined; // Return undefined if no matching wardName is found
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

  gridOptions = {
    headerHeight: 45,
    rowHeight: 40,
    // onRowClicked: this.onRowClicked.bind(this),
  };

  download() {
    let fileName =
      'Pothole Status Excel' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  downloadPDFNew() {
    const fileName =
      'Roads Pothole Status Report' + moment(new Date()).format('DDMMYYYY');
    let data: any = [
      [
        { text: 'Ward', style: 'tableHeader', alignment: 'center' },
        {
          text: 'No of Potholes Reported',
          style: 'tableHeader',
          alignment: 'center',
        },
        {
          text: 'No of Potholes Attended',
          style: 'tableHeader',
          alignment: 'center',
        },
        {
          text: 'No of Potholes Pending',
          style: ['tableHeader', 'boldText'],
          bold: true,
          alignment: 'center',
        },
        {
          text: 'No of Potholes Pending More Than 24hr',
          style: 'tableHeader',
          alignment: 'center',
        },
        {
          text: 'No of Potholes Attended(More than 24 hrs time taken to attend)',
          style: 'tableHeader',
          alignment: 'center',
        },
        {
          text: 'No of Potholes Attended(Less than 2 hrs between before & after)',
          style: 'tableHeader',
          alignment: 'center',
        },
        { text: 'AE Name', style: 'tableHeader', alignment: 'center' },
        { text: 'AE Mobile No', style: 'tableHeader', alignment: 'center' },
      ],
    ];
    if (this.rowData) {
      this.rowData.forEach((rec) => {
        data.push([
          { text: rec.wardName },
          { text: rec.count },
          { text: rec.completed },
          { text: rec.pending, style: 'boldText' },
          { text: rec.pending24hr },
          { text: rec.totaltookMoreThan24hrCount },
          { text: rec.lessThan2hr },
          { text: rec.userName },
          { text: rec.mobileNo },
        ]);
      });

      var docDefinition = {
        content: [
          {
            table: {
              widths: [100, '*', 100],
              header: 'center',
              body: [
                [
                  {
                    rowSpan: 2,
                    image: CustomVFS.eps95logo,
                    fit: [50, 50],
                    alignment: 'center',
                  },
                  {
                    text: 'BRIHANMUMBAI MUNICIPAL CORPORATION',
                    alignment: 'center',
                    fontSize: '13',
                    bold: 'true',
                  },
                  { rowSpan: 2, text: 'Roads', alignment: 'center' },
                ],
                [
                  '',
                  {
                    text:
                      'Roads Pothole Status Report From 01-06-2024 To ' +
                      moment(new Date()).format('DD-MM-YYYY'),
                    alignment: 'center',
                  },
                  '',
                ],
              ],
              alignment: 'center',
            },
            pageSize: 'A4',
            pageOrientation: 'landscape',
          },

          {
            table: {
              widths: ['*', '*', '*', '*', '*', '*', '*', '*', '*'],
              body: data,
            },
          },
        ],
        styles: {
          header: {
            fontSize: 14,
            bold: true,
            alignment: 'center',

            lineHeight: 1.25,
          },
          boldText: {
            bold: true,
          },
          subheader: {
            fontSize: 8,
          },
          quote: {
            italics: true,
          },
          small: {
            fontSize: 6,
          },
          block: {
            margins: [0, 5],
          },
          tableHeader: {
            bold: true,
            color: 'black',
            alignment: 'center',

            fontSize: 8,
          },
          footnote: {
            fontSize: 6,
            margin: [0, 1, 0, 0],
          },
        },
        pageSize: 'A4',
        pageOrientation: 'landscape',
        defaultStyle: {
          //font: "Noto",
          fontSize: 10,
          alignment: 'center',
          lineHeight: 1.25,
        },
        preserveSpace: {
          preserveLeadingSpaces: true,
        },
      };

      pdfMake.createPdf(docDefinition).download(fileName + '.pdf');
    }
  }
}
