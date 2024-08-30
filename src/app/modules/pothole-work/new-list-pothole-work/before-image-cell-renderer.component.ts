import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'btn-cell-renderer',
  template: `
    <img
      width="180px"
      height="180px"
      style="cursor: pointer;"
      (click)="openImage()"
      [src]="beforeImageUrl"
      alt="Before Image"
    />
  `,
})
export class BeforeImageCellRenderer implements ICellRendererAngularComp {
  private params: any;
  API_URL = environment.imageUrl;
  beforeImageUrl = 'https://roads.mcgm.gov.in:3000/MasticWork/5635_before.jpg';

  agInit(params: any): void {
    this.params = params;
    console.log(this.params);
    this.beforeImageUrl = this.API_URL + this.params.data.beforeImagePath;
  }
  openImage(): void {
    window.open(this.beforeImageUrl, '_blank');
  }

  refresh(): boolean {
    return false;
  }
}
