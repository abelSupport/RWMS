import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'btn-cell-renderer',
  template: `

    <button
      cButton
      class="me-1"
      color="light"
      (click)="btnClickedEditHandler()"
    >
      <svg cIcon name="cilNoteAdd" style="margin-right: 5px;"></svg>
      Edit
    </button>
  `,
})
export class BtnCellRendererPothole implements ICellRendererAngularComp {
  private params: any;
  constructor(private router: Router) {}
  agInit(params: any): void {
    this.params = params;
  }

  btnClickedEditHandler() {
    this.router.navigate(['user/potholecreate/' + this.params.data._id]);
  }
  btnClickedAttachLocationHandler() {
    // console.log(this.params)
    this.router.navigate(['user/attachlocation/' + this.params.data._id]);
    // this.params.context.componentParent.methodFromParent(
    //     { id: this.params.data._id, name:this.params.data.locationName}
    //   );
  }
  refresh(): boolean {
    return false;
  }
}
