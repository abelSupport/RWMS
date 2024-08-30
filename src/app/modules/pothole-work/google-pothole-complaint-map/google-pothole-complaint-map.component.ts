import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { AgGridAngular } from 'ag-grid-angular';
import { MapTwitterImageCellRenderer } from './twitter-image-cell-renderer.component';
import { MapAfterImageCellRenderer } from './after-image-cell-renderer.component';
import { MapBeforeImageCellRenderer } from './before-image-cell-renderer.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocationService } from 'src/app/core/services/location.service';
import { TwitterComplaintService } from 'src/app/core/services/twitter-complaint.service';
import { PotholeComplaintFormComponent } from '../../pothole-work/pothole-complaint-form/pothole-complaint-form.component';
import { CommonService } from 'src/app/core/services/common.service';
import { environment } from 'src/environments/environment';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { GooglePotholeComplaintFormComponent } from '../google-pothole-complaint-form/google-pothole-complaint-form.component';
import { MapFeatureComponent } from '../../open-layers/map-feature/map-feature.component';
import { DeleteBtnCellRenderer } from './delete-button-cell-renderer.component';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';

@Component({
  selector: 'app-google-pothole-complaint-map',
  templateUrl: './google-pothole-complaint-map.component.html',
  styleUrls: ['./google-pothole-complaint-map.component.scss'],
})
export class GooglePotholeComplaintMapComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  map: google.maps.Map;
  marker: google.maps.Marker;

  lat = 19.116625;
  lng = 72.862358;
  zoom: number = 12;
  potholeUsers: any;
  rowData1: any;

  constructor(
    public matDialog: MatDialog,
    private twitterComplaintService: TwitterComplaintService,
    private commonService: CommonService,
    private http: HttpClient,
    private locationService: LocationService,
    private masticWorkService: MasticworkService,
    private potholeUserService: PotholeUserService
  ) {}

  ngOnInit(): void {
    this.mapInit();
    this.initAutocomplete();
    this.loadGeoJsonLayer();
    this.addMapClickListener();

    this.rowSelection = 'multiple';
    this.frameworkComponents = {
      btnCellRenderer: MapTwitterImageCellRenderer,
      deleteBtnCellRenderer: DeleteBtnCellRenderer,
      mapAfterImageCellRenderer: MapAfterImageCellRenderer,
      mapBeforeImageCellRenderer: MapBeforeImageCellRenderer,
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
    this.getTwitterCompalint();
  }

  mapInit() {
    const mapOptions = {
      center: { lat: this.lat, lng: this.lng },
      zoom: this.zoom,
    };
    this.map = new google.maps.Map(
      document.getElementById('map') as HTMLElement,
      mapOptions
    );
  }

  initAutocomplete() {
    const input = document.getElementById('search-box') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }

      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(17);
      }

      const marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location,
      });
    });
  }

  addMapClickListener() {
    this.map.data.addListener('click', (event) => {
      console.log(event);

      google.maps.event.trigger(this.map, 'click', {
        latLng: event.latLng,
      });

      this.openNewComponent(event);
    });
  }

  addMarker(location: google.maps.LatLng | google.maps.LatLngLiteral) {
    if (this.marker) {
      this.marker.setMap(null);
    }
    console.log(location);

    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
    });
  }

  API_URL = environment.baseUrl;

  loadGeoJsonLayer() {
    this.http
      .get(this.API_URL + 'geo/getelectrolwardlayer')
      .subscribe((data: any) => {
        this.map.data.addGeoJson(data);
        this.setMapStyle();
        this.addFeatureNames();
      });
  }

  setMapStyle() {
    this.map.data.setStyle({
      strokeWeight: 1,
      strokeColor: '#333333', // black color for the stroke
      fillColor: null, // no fill color
      fillOpacity: 0, // fill opacity set to 0
    });
  }

  addFeatureNames() {
    this.map.data.addListener('addfeature', (event) => {
      const feature = event.feature.Gg;
      console.log(feature);

      const name = feature.getProperty('wardname');

      const bounds = new google.maps.LatLngBounds();
      feature.getGeometry().forEachLatLng(function (latlng) {
        bounds.extend(latlng);
      });

      const center = bounds.getCenter();
      new google.maps.Marker({
        position: center,
        map: this.map,
        label: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 0, // Hide the marker icon, only show the label
        },
      });
    });
  }

  onQuickFilterChanged() {
    let val = (<HTMLInputElement>document.getElementById('quickFilter')).value;
    this.agGrid.api.setQuickFilter(val);
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
  }

  gridOptions = {
    rowHeight: 40,
    getRowHeight: function (params) {
      return 40;
    },
  };

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

  getTwitterCompalint() {
    this.masticWorkService.getTwitterWork().subscribe((result) => {
      if (result.status === 200) {
        this.rowData1 = result.data;

        this.potholeUserService.getPotholeUsers().subscribe((result) => {
          if (result.status === 200) {
            this.potholeUsers = result.data;
            debugger;
            this.rowData1.forEach((row) => {
              const matchedUser = this.potholeUsers.find(user => user._id === row.subEngineerName);
              
              if (matchedUser) {
                row.subEngineerFirstName = matchedUser.firstName;
                row.electrolWardNo=matchedUser.electrolWardNo;
              }
            });
            this.rowData1=this.rowData1.filter(f=>f.subEngineerFirstName!=="Sneha Kshatriya")
            const userWardString = sessionStorage.getItem('UserWard');
            const userWards = userWardString.split(',');
    
            const filteredLocations = this.rowData1.filter((location) =>
              userWards.includes(String(location.wardName.wardName))
            );
    
            this.rowData = filteredLocations;
    
          }
        });

    
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
            minWidth: 120,
          },
          {
            headerName: 'Ward Name',
            field: 'wardName.wardName',
            minWidth: 120,
          },
          { headerName: 'Electoral Ward No', field: 'electrolWardNo' },
          {
            headerName: 'Road Name',
            field: 'locationName',
            minWidth: 150,
          },
          { headerName: 'Tweet Link', field: 'link', cellRenderer: this.linkCellRenderer },
          {
            headerName: 'PRO Remarks',
            field: 'remarks',
            minWidth: 200,
          },
          {
            headerName: 'Sub Engineer Remarks',
            field: 'remarkTransferSE',
            minWidth: 200,
          },
          {
            headerName: 'Status',
            field: 'status',
            minWidth: 200,
            cellStyle: this.getCellStyle.bind(this),
          },
          {
            headerName: 'Tweet Image',
            field: '_id',
            cellRenderer: 'btnCellRenderer',
            afterImage: '',
            minWidth: 200,
          },
          {
            headerName: 'Before Image',
            field: '_id',
            cellRenderer: 'mapBeforeImageCellRenderer',
            afterImage: '',
            minWidth: 200,
          },
          {
            headerName: 'After Image',
            field: '_id',
            cellRenderer: 'mapAfterImageCellRenderer',
            afterImage: '',
            minWidth: 200,
          },
          {
            headerName: 'Created On',
            field: 'createdOn',
            valueGetter: (params) => {
              return this.commonService.FormatDateTime(params.data.createdOn);
            },
          },
          { headerName: 'Created By', field: 'createdBy' },
          {
            headerName: 'Attended On',
            field: 'modifiedOn',
            valueGetter: (params) => {
              return this.commonService.FormatDateTime(params.data.modifiedOn);
            },
          },
          { headerName: 'Attended By', field: 'modifiedBy' },
          { headerName: 'Assigned To', field: 'subEngineerFirstName' },
          { headerName: 'Deleted By', field: 'deletedBy' },
          { headerName: 'Delete Remarks', field: 'deleteRemarks' },
          { headerName: 'Deleted On', field: 'deletedOn' },
          {
            headerName: 'Action',
            field: '_id',
            cellRenderer: 'deleteBtnCellRenderer',
            afterImage: '',
            minWidth: 200,
          },

        ];
      }
    });
  }

  linkCellRenderer(params) {
    if(params?.data?.tweetlink){
      return `<a href="${params.data.tweetlink}" target="_blank">${params?.data?.tweetlink}</a>`;
    }else {
      return '';
    }
  }
  
  OnGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }
  getCellStyle(params: any) {
    // Check if a row should have a specific color based on some condition
    if (params.data.status == 'Open') {
      return { background: '#FADBD8' };
    } else if (params.data.status == 'Closed') {
      return { background: '#ffffcc' };
    } else if (params.data.status == 'Completed') {
      return { background: '#D5F5E3' };
    }else if (params.data.status == 'Deleted') {
      return { background: '#FF8A8A' };
    }
    // else if (params.data.status == 'On Hold') {
    //   return { background: '#F8D6B3', color: 'black',border: '1px dashed black' };
    // } else if (params.data.status == 'Delayed') {
    //   return { background: '#FCF3CF', color: 'black',border: '1px dashed black' };
    // } else if (params.data.status == 'Completed') {
    //   return { background: '#D5F5E3', color: 'black',border: '1px dashed black' };
    // }
    else {
    }
    return null;
  }

  openNewComponent(feature) {
    const dialogConfig2 = new MatDialogConfig();
    dialogConfig2.disableClose = false;
    dialogConfig2.id = 'twitter';
    dialogConfig2.height = '500px';
    dialogConfig2.width = '780px';
    dialogConfig2.position = {
      top: '90px',
    };

    this.locationService.getDataEntrySearchParams(feature);
    dialogConfig2.panelClass = 'rounded-dialog';
    this.matDialog.open(PotholeComplaintFormComponent, dialogConfig2);
  }
}
