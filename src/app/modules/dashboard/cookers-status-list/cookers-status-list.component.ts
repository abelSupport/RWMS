import { Component, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonService } from 'src/app/core/services/common.service';
import { CookerService } from 'src/app/core/services/cooker.service';
import { ListTwitterImageCellRenderer } from './twitter-image-cell-renderer.component';

import * as XLSX from 'xlsx';
import * as moment from 'moment';

import 'jspdf-autotable';
import { CustomVFS } from 'src/app/core/services/pdfmakefonts';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-cookers-status-list',
  templateUrl: './cookers-status-list.component.html',
  styleUrls: ['./cookers-status-list.component.scss'],
})
export class CookersStatusListComponent implements OnInit {
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
  rowData: any = [];
  gridOption;

  gridOptions = {
    headerHeight: 45,
    rowHeight: 40,
    // onRowClicked: this.onRowClicked.bind(this),
  };

  constructor(
    private cookerService: CookerService,
    private commonService: CommonService,
    private masticworkService: MasticworkService
  ) {}

  ngOnInit() {
    this.getCookersData();

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
        headerName: 'Cooker Registration No',
        field: 'CookerRegistrationNo',
        minWidth: '200',
      },
      {
        headerName: 'Ward',
        field: 'Ward',
        minWidth: '100',
      },
      {
        headerName: 'Zone',
        field: 'Zone',
        minWidth: '200',
       },     
      {
        headerName: 'Contractor Name',
        field: 'Contractor',
        minWidth: '250',
      },
      {
        headerName: 'Work Code',
        field: 'WorkCode',
        minWidth: '200',
      },
      {
        headerName: 'Created By',
        field: 'createdBy',
        minWidth: '200',
      },
      {
        headerName: 'Created On',
        field: 'createdOn',
        valueGetter: (params) => {
          return this.formatDate(params?.data?.createdOn);
        },
        minWidth: '200',
      },
      {
        headerName: 'Cooker Image',
        field: '_id',
        cellRenderer: 'listTwitterImageCellRenderer',
        afterImage: '',
        minWidth: 250,
      },
    ];

    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      listTwitterImageCellRenderer: ListTwitterImageCellRenderer,
    };
  }

  cookerData = [];
  cookerStatusData = [];
  matchingData = [];

  getCookersData() {
    this.masticworkService.getCookerMasterData().subscribe((cookerResult) => {
      this.cookerData = cookerResult.data;
      debugger;
      this.cookerService.getCookerData().subscribe((res) => {
        debugger;
        if (res.status == 200) {
          this.cookerStatusData = res.data;

          this.cookerStatusData.forEach((cooker) => {
            this.cookerData.forEach((row) => {
              if (cooker.cookerMasterID._id === row._id) {
                this.matchingData.push({
                  Above9m: cooker.cookerMasterID.Above9m,
                  cookerImageFileName: cooker.cookerImageFileName,
                  cookerImagePath: cooker.cookerImagePath,
                  createdBy: cooker.createdBy,
                  createdOn: cooker.createdOn,
                  contractorName: cooker.cookerMasterID.Contractor,
                  CookerRegistrationNo: cooker.cookerRegNo,
                  SrNo: cooker.cookerMasterID.SrNo,
                  VisibleOnMap: cooker.cookerMasterID.VisibleOnMap,
                  wardName: cooker.cookerMasterID.Ward,
                  WorkCode: cooker.cookerMasterID.WorkCode,
                  zoneName: cooker.cookerMasterID.Zone,
                  _id: cooker._id,
                });
              } 
              
              // else {
              //   this.matchingData.push({
              //     Above9m: cooker.Above9m,
              //     cookerImageFileName: null,
              //     cookerImagePath: null,
              //     createdBy: null,
              //     createdOn: null,
              //     contractorName: cooker.Contractor,
              //     CookerRegistrationNo: cooker.CookerRegistrationNo,
              //     CookerRegistrationNo2: cooker.CookerRegistrationNo2,
              //     SrNo: cooker.SrNo,
              //     VisibleOnMap: cooker.VisibleOnMap,
              //     wardName: cooker.Ward,
              //     WorkCode: cooker.WorkCode,
              //     zoneName: cooker.Zone,
              //     _id: cooker._id,
              //   });
              // }
            });
          });

          let data = this.cookerStatusData.map((cookerItem) => {
            const matchingRow = this.matchingData.find((rowItem) => rowItem._id === cookerItem._id);
            if (matchingRow) {
              return {
                Above9m: cookerItem.cookerMasterID.Above9m,
                cookerImageFileName: matchingRow.cookerImageFileName,
                cookerImagePath: matchingRow.cookerImagePath,
                createdBy: matchingRow.createdBy,
                createdOn: matchingRow.createdOn,

                Contractor: cookerItem.cookerMasterID.Contractor,
                CookerRegistrationNo: cookerItem.cookerRegNo,
                CookerRegistrationNo2: cookerItem.cookerRegNo,
                SrNo: cookerItem.cookerMasterID.SrNo,
                VisibleOnMap: cookerItem.cookerMasterID.VisibleOnMap,
                Ward: cookerItem.cookerMasterID.Ward,
                WorkCode: cookerItem.cookerMasterID.WorkCode,
                Zone: cookerItem.cookerMasterID.Zone,
                _id: cookerItem._id,
              };
            }
            return {
                Above9m: cookerItem.cookerMasterID.Above9m,
                cookerImageFileName: cookerItem.cookerImageFileName,
                cookerImagePath: cookerItem.cookerImagePath,
                createdBy: cookerItem.createdBy,
                createdOn: cookerItem.createdOn,

                Contractor: cookerItem.cookerMasterID.Contractor,
                CookerRegistrationNo: cookerItem.cookerRegNo,
                CookerRegistrationNo2: cookerItem.cookerRegNo,
                SrNo: cookerItem.cookerMasterID.SrNo,
                VisibleOnMap: cookerItem.cookerMasterID.VisibleOnMap,
                Ward: cookerItem.cookerMasterID.Ward,
                WorkCode: cookerItem.cookerMasterID.WorkCode,
                Zone: cookerItem.cookerMasterID.Zone,
                _id: cookerItem._id,
            };
          });

          debugger;
          this.rowData = data;
        }
      });
    });
  }

  

  // getCookersData() {
    
  //     this.cookerService.getCookerData().subscribe((res) => {
  //       debugger;
  //       if (res.status == 200) {
  //         this.cookerStatusData = res.data;

  //         this.rowData = this.cookerStatusData.map((cooker) => ({
  //           CookerRegistrationNo: cooker.cookerRegNo,
  //           createdBy: cooker.createdBy,
  //           createdOn: cooker.createdOn,
  //           locationName: cooker.locationName,
  //           cookerImageFileName: cooker.cookerImageFileName,
  //           cookerImagePath: cooker.cookerImagePath,
          
  //           // Uncomment and include other fields as needed
  //           // Above9m: cooker.Above9m,
  //           // contractorName: cooker.Contractor,
  //           // CookerRegistrationNo2: cooker.CookerRegistrationNo2,
  //           // SrNo: cooker.SrNo,
  //           // VisibleOnMap: cooker.VisibleOnMap,
  //           // wardName: cooker.Ward,
  //           // WorkCode: cooker.WorkCode,
  //           // zoneName: cooker.Zone,
  //           // _id: cooker._id
  //         }));
  //         debugger;          

  //       //   this.cookerData.forEach((cooker) => {
  //       //     this.cookerStatusData.forEach((row) => {
  //       //       if (cooker.CookerRegistrationNo === row.cookerRegNo) {
  //       //         this.matchingData.push({
  //       //           Above9m: cooker.Above9m,
  //       //           cookerImageFileName: row.cookerImageFileName,
  //       //           cookerImagePath: row.cookerImagePath,
  //       //           createdBy: row.createdBy,
  //       //           createdOn: row.createdOn,
  //       //           contractorName: cooker.Contractor,
  //       //           CookerRegistrationNo: cooker.CookerRegistrationNo,
  //       //           CookerRegistrationNo2: cooker.CookerRegistrationNo2,
  //       //           SrNo: cooker.SrNo,
  //       //           VisibleOnMap: cooker.VisibleOnMap,
  //       //           wardName: cooker.Ward,
  //       //           WorkCode: cooker.WorkCode,
  //       //           zoneName: cooker.Zone,
  //       //           _id: cooker._id,
  //       //         });
  //       //       }
  //       //       else {
  //       //         this.matchingData.push({
  //       //           Above9m: cooker.Above9m,
  //       //           cookerImageFileName: null,
  //       //           cookerImagePath: null,
  //       //           createdBy: null,
  //       //           createdOn: null,
  //       //           contractorName: cooker.Contractor,
  //       //           CookerRegistrationNo: cooker.CookerRegistrationNo,
  //       //           CookerRegistrationNo2: cooker.CookerRegistrationNo2,
  //       //           SrNo: cooker.SrNo,
  //       //           VisibleOnMap: cooker.VisibleOnMap,
  //       //           wardName: cooker.Ward,
  //       //           WorkCode: cooker.WorkCode,
  //       //           zoneName: cooker.Zone,
  //       //           _id: cooker._id,
  //       //         });
  //       //       }
  //       //     });
  //       //   });

  //       //   this.matchingData = this.cookerData.map(cookerItem => {
  //       //     const matchingRow = this.cookerStatusData.find(rowItem => rowItem.cookerRegNo === cookerItem.CookerRegistrationNo);
  //       //     if (matchingRow) {
  //       //         return {
  //       //             Above9m: cookerItem.Above9m,
  //       //             cookerImageFileName: matchingRow.cookerImageFileName,
  //       //             cookerImagePath: matchingRow.cookerImagePath,
  //       //             createdBy: matchingRow.createdBy,
  //       //             createdOn: matchingRow.createdOn,
  //       //             Contractor: cookerItem.Contractor,
  //       //             CookerRegistrationNo: cookerItem.CookerRegistrationNo,
  //       //             CookerRegistrationNo2: cookerItem.CookerRegistrationNo2,
  //       //             SrNo: cookerItem.SrNo,
  //       //             VisibleOnMap: cookerItem.VisibleOnMap,
  //       //             Ward: cookerItem.Ward,
  //       //             WorkCode: cookerItem.WorkCode,
  //       //             Zone: cookerItem.Zone,
  //       //             _id: cookerItem._id,
  //       //         };
  //       //     }
  //       //     return cookerItem;
  //       // });

  //         // debugger;
  //         // if(this.matchingData) {
  //         //   this.rowData = this.matchingData;
  //         // }
  //       }
  //     });
  
  // }

  quickfilter = "";

  onQuickFilterChanged() {
    let val = (<HTMLInputElement>document.getElementById('quickFilter')).value;
    debugger;
    this.agGrid.api.setQuickFilter(this.quickfilter);
  }

  OnGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }

  cookerExcelData = [];
  download() {
    this.cookerExcelData = this.rowData.map(
      ({
        CookerRegistrationNo,
        Ward,
        Zone,        
        Contractor,
        WorkCode,
        createdBy,
        createdOn,
        cookerImagePath,
      }) => ({
        CookerRegistrationNo: CookerRegistrationNo,
        Ward: Ward,
        Zone: Zone,        
        ContractorName: Contractor,
        WorkCode: WorkCode,
        CreatedBy: createdBy,
        CreatedOn: this.formatDate(createdOn),
        CookerImagePath: cookerImagePath,
      })
    );

    debugger;
    let fileName =
      'Cooker Status Excel' + moment(new Date()).format('DDMMYYYY') + '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.cookerExcelData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  downloadPDF() {
    
    const fileName = 'Cooker Status Report' + moment(new Date()).format('DDMMYYYY');
    let data: any = [
      [
        {
          text: 'Cooker Registration No',
          style: 'tableHeader',
          alignment: 'center',
        },
       { text: 'Ward', style: 'tableHeader', alignment: 'center' },
       { text: 'Zone', style: 'tableHeader', alignment: 'center' },       
        {
          text: 'Contractor Name',
          style: ['tableHeader', 'boldText'],
          bold: true,
          alignment: 'center',
        },
        { text: 'Work Code', style: 'tableHeader', alignment: 'center' },
        { text: 'Created By', style: 'tableHeader', alignment: 'center' },
        { text: 'Created On', style: 'tableHeader', alignment: 'center' },
       // {text: 'Cooker Image Path',style: 'tableHeader',alignment: 'center'},
        // { text: 'AE Mobile No', style: 'tableHeader', alignment: 'center', },
      ],
    ];
    if (this.rowData) {
      
      this.rowData.forEach((rec) => {
        data.push([
          { text: rec.CookerRegistrationNo, style: 'boldText' },
          { text: rec.Ward },
          { text: rec.Zone },
          { text: rec.Contractor },
          { text: rec.WorkCode },
          { text: rec.createdBy },
          { text: this.formatDate(rec.createdOn) },
          //{ text: rec.cookerImagePath },
          // { text: rec.mobileNo},
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
                  { rowSpan: 2, text: 'Cookers', alignment: 'center' },
                ],
                [
                  '',
                  {
                    text:
                      'Cooker Status Report',alignment: 'center',
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
              widths: [ '*', 'auto', 'auto', 'auto', '*',  '*', '*'],
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

  formatDate(dateString) {
    if(dateString != undefined) {
      const date = new Date(dateString);
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      console.log ( date + ' ' + year + ' ' + month + ' ' + day + ' ' + hours + ' ' + minutes )
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    else {
      return null;
    }
    
  }
}
