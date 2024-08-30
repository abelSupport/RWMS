import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/core/services/location.service';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'btn-cell-renderer',
  template: `
    <img
      width="180px"
      height="180px"
      style="cursor: pointer;"
      (click)="openImage()"
      [src]="afterImageUrl"
      alt="After Image"
    />
  `,
})
export class AfterImageCellRenderer implements ICellRendererAngularComp {
  private params: any;
  afterImageUrl = 'https://roads.mcgm.gov.in:3000/MasticWork/5635_before.jpg';
  API_URL = environment.imageUrl;
  agInit(params: any): void {
    this.params = params;
    this.afterImageUrl = this.API_URL + this.params.data.afterImagePath;
  }

  openImage(): void {
    window.open(this.afterImageUrl, '_blank');
  }

  refresh(): boolean {
    return false;
  }
}
