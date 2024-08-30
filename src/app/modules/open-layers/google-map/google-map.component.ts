import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LocationService } from 'src/app/core/services/location.service';
import { PotholeComplaintFormComponent } from '../../pothole-work/pothole-complaint-form/pothole-complaint-form.component';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent {
  lat = 19.116625;
  lng = 72.862358;
  zoom: number = 12;
  address: string = '';
  map;
  @ViewChild('search')
  public searchElementRef!: ElementRef;

  constructor(   
    public matDialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private locationService: LocationService
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
  }

  onMapClick(event: any): void {
    console.log(event);
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.map.addListener('click', (e: google.maps.MouseEvent) => {
      console.log(e.latLng.lat(), e.latLng.lng());
      this.openNewComponent();
    });
  }

  openNewComponent() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    dialogConfig.height = '500';
    dialogConfig.width = '780px';
    dialogConfig.position = {
      top: '250px',
    };
    // let obj = {
    //   feature:feature
    // };
   // this.locationService.getDataEntrySearchParams(obj);
    dialogConfig.panelClass = 'rounded-dialog';
    this.matDialog.open(PotholeComplaintFormComponent, dialogConfig);
  }
}
