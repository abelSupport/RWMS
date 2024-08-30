import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { MapsAPILoader } from '@agm/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocationService } from 'src/app/core/services/location.service';
import { TwitterComplaintService } from 'src/app/core/services/twitter-complaint.service';
import { PotholeComplaintFormComponent } from '../../pothole-work/pothole-complaint-form/pothole-complaint-form.component';
import { AgGridAngular } from 'ag-grid-angular';
import { CommonService } from 'src/app/core/services/common.service';
import {MapOldTwitterImageCellRenderer} from './after-image-cell-renderer.component'
import { MapFeatureComponent } from '../../open-layers/map-feature/map-feature.component';

@Component({
  selector: 'app-create-pothole-complaint',
  templateUrl: './create-pothole-complaint.component.html',
  styleUrls: ['./create-pothole-complaint.component.scss'],
})
export class CreatePotholeComplaintComponent {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  lat = 19.116625;
  lng = 72.862358;
  zoom: number = 12;
  address: string = '';
  map;
  @ViewChild('search')
  public searchElementRef!: ElementRef;
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
    public matDialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private locationService: LocationService,
    private twitterComplaintService: TwitterComplaintService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['address'],
        }
      );

      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 15;
          this.address = place.formatted_address;
        });
      });
    });
    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: MapOldTwitterImageCellRenderer,
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
    this.getTwitterCompalint()
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

  onMapClick(event: any): void {
    console.log(event);
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.map.addListener('click', (e: google.maps.MouseEvent) => {
      let obj={
        lat:e.latLng.lat(),
        lng:e.latLng.lng()
      }
      console.log(e.latLng.lat(), e.latLng.lng());
      this.openNewComponent(obj);
    });
  }

  getTwitterCompalint() {
    this.twitterComplaintService.getTwitterComplaints().subscribe((result) => {
      debugger;
      if (result.status === 200) {
        debugger;
        this.rowData = result.data;
        this.columnDefs = [
          {
            headerName: 'Road Name',
            field: 'locationName',
            minWidth: 150,
          },
          {
            headerName: 'Remarks',
            field: 'remarks',
            minWidth: 200,
          },
          {
            headerName: 'Tweet Image',
            field: '_id',
            cellRenderer: 'btnCellRenderer',
            afterImage:'',
            minWidth: 200,
          },
          {
            headerName: 'Created On',
            field: 'createdOn',
            valueGetter: (params) => {
              return this.commonService.DateFormatter(params.data.createdOn);
            },
          },
          {
            headerName: 'Status',
            field: 'status',
            minWidth: 200,
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
      }
    });
  }

  download() {
    let fileName =
      'Twitter Complaint Report ' +
      moment(new Date()).format('DDMMYYYY') +
      '.xlsx';
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
    debugger;
  }

  openNewComponent(feature) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.id = 'twitter';
    dialogConfig.height = '500px';
    dialogConfig.width = '820px';
    dialogConfig.position = {
      top: '150px',
    };

    this.locationService.getDataEntrySearchParams(feature);
    dialogConfig.panelClass = 'rounded-dialog';
    this.matDialog.open(MapFeatureComponent, dialogConfig);
  }
}
