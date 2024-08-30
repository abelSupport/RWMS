import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { LocationService } from 'src/app/core/services/location.service';

@Component({
  selector: 'app-delete-pothole-work',
  templateUrl: './delete-pothole-work.component.html',
  styleUrls: ['./delete-pothole-work.component.scss'],
})
export class DeletePotholeWorkComponent implements OnInit {
  remarks: any;
  form: FormGroup;
  customStylesValidated: boolean = false;
  params: any;

  constructor(
    private dialogRef: MatDialogRef<DeletePotholeWorkComponent>,
    private _fb: FormBuilder,
    private mastiWorkService: MasticworkService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.locationService.dataEntrySearchParams.subscribe((result) => {
      this.params = result;
      console.log(this.params);
    });
  }

  ngOnInit(): void {
    this.form = this._fb.group({
      remarks: ['', Validators.required],
    });
  }

  Back() {}
  onSubmit() {
    this.customStylesValidated = true;
    if (this.form.invalid) {
      return;
    }
    let obj = {
      deleteRemarks: this.form.value.remarks,
      deletedBy: sessionStorage.getItem('FullName'),
    };
    debugger;
    this.mastiWorkService
      .deleteMasticWork(this.params._id, obj)
      .subscribe((result) => {
        console.log(result);

        if (result) {
          if (result.status === 201) {
            debugger;
            Swal.fire({
              text: 'Record Deleted',
              icon: 'success',
            }).then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
                if (
                  String(sessionStorage.getItem('UserRole')) === 'Data Owner'
                ) {
                  this.router.navigate(['potholework/list']).then(() => {
                    window.location.reload();
                  });
                } else {
                  this.router.navigate(['potholework/gmap']).then(() => {
                    window.location.reload();
                  });
                }
              }
            });
          }
        }
      });

    console.log(obj);
  }
}
