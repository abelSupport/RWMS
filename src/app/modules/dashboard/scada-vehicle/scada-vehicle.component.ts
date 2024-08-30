import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-scada-vehicle',
  templateUrl: './scada-vehicle.component.html',
  styleUrls: ['./scada-vehicle.component.scss']
})
export class ScadaVehicleComponent implements OnInit {
  form: FormGroup;
  customStylesValidated: boolean = false;
  showRoadNameInput:boolean = false;
  contractors = [ { name: 'M/s. Kamala Construction Co.', vehicles: ['MH47BL6417'] },
  { name: 'M/s. R & B Infraprojects', vehicles: ['MH04JU6419', 'MH48BM5159', 'MH48BM5158', 'MH04LQ3813', 'MH43CE7095', 'MH04KU8894', 'MH04KU9772', 'MH43CE7093'] },
  { name: 'M/s. Eric Infrastructure', vehicles: ['MH47AS1872','MH47AS5733','MH47AS5724'] },
  { name: 'PRAKASH ENGINEERS AND INFRA', vehicles: ['MH43BX7624','MH43CE0224','MH43CE7424'] },
  { name: 'Lintech Infrastructure Pvt. Ltd.', vehicles: ['MH47Y9056', 'MH47BL3789', 'MH48CB2799', 'MH47AS8977', 'MH47BL2961','MH47BL6867' ] }];

  vehicles: string[] = [];
  constructor(private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ){}

  ngOnInit(): void {
    debugger;
    this.form = this._fb.group({
      contractorName: ['',Validators.required],
      vehicleName: ['',Validators.required],
      fromdate: [''],
      todate:['']
    });

    this.form.get('contractorName').valueChanges.subscribe(value => {
      debugger;
      this.updateVehicles(value);
    });
  }

  updateVehicles(contractorName: string): void {
    const contractor = this.contractors.find(c => c.name === contractorName);
     this.vehicles = contractor ? contractor.vehicles : [];
    this.form.get('vehicleName').reset();
  }
  onSubmit(){
    debugger;
  }

  onReset(){
    this.customStylesValidated = false;
  }

  Back(){
    this.router.navigate(['dashboard']);
  }
}
