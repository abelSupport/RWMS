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
      alt="Before Image"
    />
  `,
})
export class MapBeforeImageCellRenderer implements ICellRendererAngularComp {
  private params: any;
  api = environment.imageUrl
  afterImageUrl = '';

  agInit(params: any): void {
    this.params = params;
    console.log(this.params);
    this.afterImageUrl =
      this.api + this.params.data.beforeImagePath;
  }

  openImage(): void {
    window.open(this.afterImageUrl, '_blank');
  }

  refresh(): boolean {
    return false;
  }
}
