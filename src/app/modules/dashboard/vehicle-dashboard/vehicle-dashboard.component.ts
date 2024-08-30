import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import VectorSource from 'ol/source/Vector';
import { contractor } from 'src/app/containers/default-layout/_nav';
import { CommonService } from 'src/app/core/services/common.service';
import { ScadamagnifikService } from 'src/app/core/services/scadamagnifik.service';
import { environment } from 'src/environments/environment';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import View from 'ol/View';
import { Coordinate } from 'ol/coordinate';
import { FullScreen } from 'ol/control';
import { fromLonLat } from 'ol/proj';
import {
  Circle,
  Circle as CircleStyle,
  Fill,
  Icon,
  Stroke,
  Style,
  Text,
} from 'ol/style';
import Swal from 'sweetalert2';
import { CookerService } from 'src/app/core/services/cooker.service';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-vehicle-dashboard',
  templateUrl: './vehicle-dashboard.component.html',
  styleUrls: ['./vehicle-dashboard.component.scss'],
})
export class VehicleDashboardComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  
  pageTitle: string = 'Cooker Vehicle Dashboard';
  form: FormGroup;
  customStylesValidated = false;
  wardLayer: any;

  prakashVehicleList = [
    'MH43BX7624',
    'MH43CE0224',
    'MH43CE7424'
  ];

  scadaKingVehicleList = [
    'MH43CE1106', 
    'MH43BP8022',
    'MH43BP8024',
    'MH43CE1105',    
    'MH43CE1337',    
    'MH43BP8025',
    'MH43CE1293',
    'MH01EE5061',   
    'MH04GR2826',   
    'MH01EM1201', 
    'MH04KU6035',  
    'MH04LQ2363',   
    'MH43BP8023',   
    'MH04LE9563',   
    'MH04GF9144',   
    'MH01EM1202',   
    'MH01EE5062',   
    'MH48CQ6467',   
    'MH48CQ6466',   
    'MH04LQ2362',   
  ];

  scadaW2TrackVehicleList = [
    'MH04KU8894',
    'MH04KU9772',
    'MH47BL6417',
    'MH04JU6419',
    'MH48BM5159',
    'MH48BM5158',
    'MH04LQ3813',
    'MH43CE7093',
    'MH43CE7095',
    'MH47AS5733',
    'MH47AS1872',
    'MH47AS5724'
  ];

  algoTrackVehicleList = [
    'MH 01 DR 6426',
    'MH 01 EM 2536',
    'MH 01 DR 6425',
    'MH 01 EM 2535'
  ];

  lintechVehicleList = [
    'MH47BL2970',    
    'MH47BL2961',
    'MH47BL3789',    
    'MH47AS8977',    
    'MH47BL6867',    
    "MH47BL7380",
  ];

  syncFleetVehicleList = [  ];
  linmankoliVehicleList = [];
  linkonarkVehicleList = [];

  contractorNameList = [
    { id: 'scadaw2track', name: 'Scada w2 Track' },
    { id: 'scadaking', name: 'ScadaKing' },
    { id: 'algotrack', name: 'AlgoTrack' },       // NEW INDIA ROADWAYS

    { id: 'syncfleet', name: 'SyncFleet' },

    { id: 'linmankoli', name: 'Linmankoli' },
    { id: 'linkonark', name: 'Linkonark' },
    { id: 'prakash', name: 'Prakash Engineers and Infra' },
    { id: 'lintech', name: 'Lintech Infrastructure Pvt. Ltd.' },
  ];

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
    private _fb: FormBuilder,
    private router: Router,
    private commonService: CommonService,
    private scadamagnifikService: ScadamagnifikService,
    private masticworkService: MasticworkService
  ) {}

  scadaData: any;
  scadakingData: any;
  API_URL = environment.baseUrl;
  lat = 51.678418;
  lng = 7.809007;
  map: Map;
  center: Coordinate = [8111403.258440978, 2166113.1415149523];
  zoom: number = 10;

  ngOnInit() {
    this.form = this._fb.group({
      contractorName: [
        '-1',
        [Validators.required, this.commonService.SelectRequiredValidator],
      ],
      vehicle: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
    });

    this.getCookerMasterData();
  }

  cookerMasterData = [];
  getCookerMasterData() {
    this.masticworkService.getCookerMasterData().subscribe((cookerResult) => {
      this.cookerMasterData = cookerResult.data;
    });
  }

  // vectorLayer: VectorLayer<any>;
  scadaLayer: VectorLayer<any>;
  scadaKingLayer: VectorLayer<any>;
  masticPlantData: any;
  masticPlantLayer: any;

  updateMap() {
    if (!this.map) {
      this.initialiseMap();
    } else {
      // Update the existing vector layer's source
      this.scadaLayer.setSource(this.scadaData);

      const extent = this.scadaData.getExtent();
      this.map.getView().fit(extent, {
        duration: 1000, // Duration of the animation in milliseconds
        maxZoom: 10, // Maximum zoom level after fitting the extent
      });
    }
  }

  initialiseMap() {
    this.wardLayer = new VectorSource({
      url: this.API_URL + 'geo/getwardlayer',
      format: new GeoJSON({ geometryName: 'wardfeaturelayer' }),
    });

    const wardLayer = new VectorLayer({
      source: this.wardLayer,
      style: (feature) => {
        const wardName = feature.get('wardname');
        return new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: 'black',
            width: 1,
          }),
          text: new Text({
            textAlign: 'center',
            textBaseline: 'middle',
            font: '12px Cambria',
            text: wardName,
            fill: new Fill({ color: 'black' }),
            stroke: new Stroke({ color: 'white', width: 0.5 }),
            offsetX: 0,
            offsetY: 0,
            placement: 'point',
            overflow: true,
          }),
        });
      },
    });

    this.masticPlantData = new VectorSource({
      url: this.API_URL + 'geo/getmasticplantlayer',
      format: new GeoJSON({ geometryName: 'MasticPlant' }),
    });

    this.masticPlantLayer= new VectorLayer({
      source: this.masticPlantData,
      style: new Style({
        image: new Circle({
          radius: 5, // Adjust the radius as needed
          fill: new Fill({
            color: 'red', // Red fill color
          }),
          stroke: new Stroke({
            color: 'white', // White stroke color
            width: 2,
          }),
        }),
      })
     
    });

    this.scadaLayer = new VectorLayer({
      source: this.scadaData,
      style: new Style({
        image: new Circle({
          radius: 8, // Adjust the radius as needed
          fill: new Fill({
            color: 'blue', // Red fill color
          }),
          stroke: new Stroke({
            color: 'white', // White stroke color
            width: 2,
          }),
        }),
      }),
    });

    this.scadaKingLayer = new VectorLayer({
      source: this.scadakingData,
      style: new Style({
        image: new Circle({
          radius: 10, // Adjust the radius as needed
          fill: new Fill({
            color: 'blue', // Red fill color
          }),
          stroke: new Stroke({
            color: 'white', // White stroke color
            width: 2,
          }),
        }),
      }),
    });

    const baseLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      target: 'map', // The id of the HTML element where the map will be rendered
      layers: [baseLayer, this.scadaLayer, wardLayer, this.scadaKingLayer],
      view: new View({
        center: this.center, // Center the map on your data
        zoom: this.zoom,
      }),
    });
    
  }

  vehicleList = [];
  onContractorChange(e) {
    var val = e.target.value;
    if (val == 'scadaw2track') {
      this.vehicleList = this.scadaW2TrackVehicleList;
    } else if (val == 'scadaking') {
      this.vehicleList = this.scadaKingVehicleList;
    } else if (val == 'syncfleet') {
      this.vehicleList = this.syncFleetVehicleList;
    } else if (val == 'prakash') {
      this.vehicleList = this.prakashVehicleList;
    } else if (val == 'lintech') {
      this.vehicleList = this.lintechVehicleList;
    } else if (val == 'linmankoli') {
      this.vehicleList = this.linmankoliVehicleList;
    } else if (val == 'linkonark') {
      this.vehicleList = this.linkonarkVehicleList;
    }else if (val == 'algotrack') {
      this.vehicleList = this.algoTrackVehicleList;
    }
    else {
    }
  }

  cookerRowData = [];
  data: any;
  onSubmit() {
    
    let fromDate = this.form.value.fromDate.replace('T', '');
    let toDate = this.form.value.toDate.replace('T', '');

    if ( this.form.value.contractorName == 'scadaw2track') {
      let obj = {
        customer: this.form.value.contractorName,
        vehicle: this.form.value.vehicle,
        from_date: fromDate,
        to_date: toDate,
      };

      this.scadamagnifikService.getScadaLayer(obj).subscribe((res) => {
        this.data = res;
        if (res.status == 200) {
          this.scadaData = new VectorSource({
            features: new GeoJSON().readFeatures(this.data, {
              featureProjection: 'EPSG:3857', // Match the projection of the map
            }),
          });

          this.updateMap();
        } else {
          Swal.fire({
            icon: 'warning',
            text: 'No Data Found!',
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              // window.location.reload();
            }
          });
        }
      });
    } 

    else if(this.form.value.contractorName == 'scadaking') {
      const fromdate = this.form.value.fromDate.replace('T', '');
      const todate = this.form.value.toDate.replace('T', '');
      const formattedFromdate = fromdate.slice(0, 10) + " " + fromdate.slice(10);
      const formattedToDate = todate.slice(0, 10) + " " + todate.slice(10);

      let obj = {
        customer: this.form.value.contractorName,
        vehiclenumber: this.form.value.vehicle,
        startDateTime: formattedFromdate,
        endDateTime: formattedToDate
      };

      this.scadamagnifikService.getScadaKingLayer(obj).subscribe((res) => {
        if (res.status == 200) {
          this.data = res;
          this.scadaData = new VectorSource({
            features: new GeoJSON().readFeatures(this.data, {
              featureProjection: 'EPSG:3857', // Match the projection of the map
            }),
          });

          this.updateMap();

        } else if(res.status == 201) {
          Swal.fire({
            icon: 'warning',
            text: 'No Data Found!',
          }).then((result) => {
            if (result.isConfirmed) {
              // window.location.reload();
            }
          });
        }

        else {
          Swal.fire({
            icon: 'warning',
            text: res.message,
          }).then((result) => {
            if (result.isConfirmed) {
              // window.location.reload();
            }
          });
        }

      });
    }

    else if(this.form.value.contractorName == 'algotrack') {
     debugger;
      const fromdate = this.form.value.fromDate.replace('T', '%20');
      const todate = this.form.value.toDate.replace('T', '%20');
      
      // const formattedFromdate = fromdate.slice(0, 10) + " " + fromdate.slice(10);
      // const formattedToDate = todate.slice(0, 10) + " " + todate.slice(10);

      const vehicle = this.form.value.vehicle.replace(/ /g, '%20');

      let obj = {
        customer: this.form.value.contractorName,
        vehiclenumber: vehicle,
        startDateTime: fromdate,
        endDateTime: todate
      };

      this.scadamagnifikService.getAlgotrackLayer(obj).subscribe((res) => {
        debugger;
        if (res.status == 200) {
          this.data = res;
          this.scadaData = new VectorSource({
            features: new GeoJSON().readFeatures(this.data, {
              featureProjection: 'EPSG:3857', // Match the projection of the map
            }),
          });

          this.updateMap();

        } else if(res.status == 201) {
          Swal.fire({
            icon: 'warning',
            text: 'No Data Found!',
          }).then((result) => {
            if (result.isConfirmed) {
              // window.location.reload();
            }
          });
        }

        else {
          Swal.fire({
            icon: 'warning',
            text: res.message,
          }).then((result) => {
            if (result.isConfirmed) {
              // window.location.reload();
            }
          });
        }

      });
    }
    
    else if(
      this.form.value.contractorName == 'prakash' || 
      this.form.value.contractorName == 'lintech' ||
      this.form.value.contractorName == 'linmankoli'||
      this.form.value.contractorName == 'linkonark'
    ) {
      let fDate = formatDate(this.form.value.fromDate);
      let tDate = formatDate(this.form.value.toDate);

      let obj = {
        customer: this.form.value.contractorName,
        vehicle: this.form.value.vehicle,
        from_date: fDate,
        to_date: tDate,
      };

      this.scadamagnifikService.getMagnificLayer(obj).subscribe((res) => {
        this.data = res;
        if (res.status == 200) {
          this.scadaData = new VectorSource({
            features: new GeoJSON().readFeatures(this.data, {
              featureProjection: 'EPSG:3857', // Match the projection of the map
            }),
          });

          this.updateMap();
        } else {
          Swal.fire({
            icon: 'warning',
            text: 'No Data Found!',
          }).then((result) => {
            if (result.isConfirmed) {
              // window.location.reload();
            }
          });
        }
      });
    }

    if(this.form.value.vehicle != '' ) {
      let regNo = this.form.value.vehicle;
      this.cookerRowData = this.cookerMasterData.filter((c) => c. CookerRegistrationNo == regNo );
      if(this.cookerRowData.length > 0 ) {
        this.rowData = this.cookerRowData;
        this.getOnGridReady()
      }
    }
    

  }

 getOnGridReady() {
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
      headerName: 'Work Code',
      field: 'WorkCode',
      minWidth: '200',
    },
    
    {
      headerName: 'Contractor',
      field: 'Contractor',
      minWidth: '250',
    },
    
    {
      headerName: 'Above 9m',
      field: 'Above9m',
      minWidth: '200',
    },
   
  ];

  this.rowSelection = 'multiple';
  this.frameworkComponents = {  };

  }

  OnGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.defaultColDef = params.defaultColDef;
    this.context = params.context;
  }

  Back() {}
}


function formatDate(inputDate) {
  // Replace 'T' with a space
  inputDate = inputDate.replace('T', ' ');

  // Split the date and time parts
  let [datePart, timePart] = inputDate.split(' ');

  // Split the date into year, month, and day
  let [year, month, day] = datePart.split('-');

  // Return the formatted date
  return `${month}/${day}/${year} ${timePart}`;
}
