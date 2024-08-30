import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MasticWorkModel } from 'src/app/core/models/IMasticWork';
import { wardModel } from 'src/app/core/models/IWard';

@Component({
  selector: 'app-new-create-pothole-work',
  templateUrl: './new-create-pothole-work.component.html',
  styleUrls: ['./new-create-pothole-work.component.scss']
})
export class NewCreatePotholeWorkComponent implements OnInit {

  form: FormGroup;
  customStylesValidated: boolean =false;
  showRoadNameInput: boolean = false;
  masticRoadsList: MasticWorkModel[];
  wardList:wardModel[];
  locId:any;

  
  constructor(
    private _fb: FormBuilder,
    private router :Router,
    private route: ActivatedRoute

  ){}
  ngOnInit(): void {
    
  }
  onSubmit(){}

  onlocationChange(event: Event){}

  onWardChange(event: Event){}

  beforeUploadListener(event: Event){}

  viewBeforeImage(){}

  afterUploadListener(event: Event){}

  viewAfterImage(){}

  onReset(){}

  Back(){}

  uploadListener(event : Event){}
  upload = false;
  UploadClick(){}


}
