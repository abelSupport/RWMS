import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-mastic-plant-feature',
  templateUrl: './mastic-plant-feature.component.html',
  styleUrls: ['./mastic-plant-feature.component.scss']
})
export class MasticPlantFeatureComponent implements OnInit {
  feature: any;
  contractorName:any;
  ward:any;
  workCode:any;
  zone:any;
  division:any;

 
  Back() {}
  constructor(
    private locationService: LocationService,
  ) {
    this.locationService.dataEntrySearchParams.subscribe((result) => {
      this.feature = result.feature;
      console.log(this.feature);
      this.contractorName = this.feature["Name of Contractor"];
      this.division = this.feature["Division"];
      this.zone=this.feature["Zone"];
      this.ward = this.feature["Ward"];
      this.workCode = this.feature["Work Code"];
      debugger;

    });
  }

  ngOnInit(): void {
   
  }
}
