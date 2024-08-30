import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'btn-cell-renderer',
  template: `
    <button
      class="me-1"
      color="success"
      cButton
      *ngIf="userRole === 'Data Owner'"
      (click)="btnClickedAddModuleDetailHandler()"
    >
      <svg cIcon name="cilMagnifyingGlass"></svg>
      Enter Data
    </button>
    <button
      class="me-1"
      color="light"
      cButton
      (click)="btnClickedSave()"
      *ngIf="userRole === 'Data Owner'"
    >
      <svg cIcon name="cilSave"></svg>
      Save
    </button>
    <button
      class="me-1"
      color="light"
      cButton
      (click)="btnClickedDigitizeHandler()"
      *ngIf="userRole === 'Data Owner'"
    >
      <svg cIcon name="cilPenAlt"></svg>
      Digitize
    </button>
    <button
      class="me-1"
      color="light"
      cButton
      (click)="btnClickedEditHandler()"
      *ngIf="userRole === 'Data Owner'"
    >
      <svg cIcon name="cilNoteAdd"></svg>
      Edit
    </button>
    <button
      class="me-1"
      color="light"
      cButton
      (click)="btnClickedAttachModuleHandler()"
      *ngIf="userRole === 'Data Owner'"
    >
      <svg cIcon name="cilLink"></svg>
      Attach Task
    </button>
  `,
})
export class BtnCellRenderer implements ICellRendererAngularComp {
  private params: any;
  userRole = sessionStorage.getItem("UserRole")
  constructor(private router: Router,private locationService:LocationService) {}
  agInit(params: any): void {
    this.params = params;
  }

  btnClickedSave(){
    console.log(this.params.data)

    let obj={
      _id:this.params.data._id,
      status:this.params.data.status,
      remarks:this.params.data.remarks,
      modifiedBy:sessionStorage.getItem('FullName'),
      modifiedOn:new Date(),
    }


    Swal.fire({
      title: '',
      text:'Do you want to update the Status Changes?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.locationService.saveRoadStatus(obj).subscribe((result) => {
          if(result){
            if (result.status === 200) {             
              Swal.fire({
                text: result.message.toString(),
                icon: 'success',
              }).then(()=>{
                window.location.reload();
              });              
            }
          }
    
          },
          (err) => {
            Swal.fire({
              text: err,
              icon: 'error',
            });
          }
        );
          } 
    })

  }

  btnClickedAddModuleDetailHandler() {
    this.router.navigate(['location/addmoduledetails/' + this.params.data._id]);
  }

  
  btnClickedDigitizeHandler() {
    this.router.navigate(['ol/digitize/' + this.params.data._id]);
  }

  btnClickedEditHandler() {
    this.router.navigate(['location/create/' + this.params.data._id]);
  }
  btnClickedAttachModuleHandler() {
    this.router.navigate(['location/attachmodule/' + this.params.data._id]);
  }
  refresh(): boolean {
    return false;
  }
}
