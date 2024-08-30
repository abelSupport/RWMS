import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-plantex-vts-feature',
  templateUrl: './plantex-vts-feature.component.html',
  styleUrls: ['./plantex-vts-feature.component.scss']
})
export class PlantexVtsFeatureComponent implements OnInit {
  feature: any;
  address: any;
  registrationNo: any;
  vendorName:any;
  DateTime: any;
 
  Back() {}
  constructor(
    private locationService: LocationService,
  ) {
    this.locationService.dataEntrySearchParams.subscribe((result) => {
      this.feature = result.feature;
      console.log(this.feature);
      this.address = this.feature.Address;
      this.registrationNo = this.feature.RegistrationNo;
      this.vendorName=this.feature.VendorName;
      this.DateTime = this.feature.GPSDateTime;
    });
  }

  ngOnInit(): void {
   
  }
}
