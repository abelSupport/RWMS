import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'btn-cell-renderer',
  template: `
    <!-- <img
      width="180px"
      height="180px"
      style="cursor: pointer;"
      (click)="openImage()"
      [src]="cookerImagePath"
      alt="Twitter Image"
    /> -->

    <button *ngIf="haveImage" cButton (click)="openImage()"> View Image </button>
  `,
})
export class ImageCellRenderer implements ICellRendererAngularComp {
  params: any;
  cookerImagePath = '';
  API_URL = environment.imageUrl;
  haveImage = false;

  agInit(params: any): void {
    debugger;
    
    this.params = params;
    if(params.data.cookerImageFileName != undefined ) {
      this.haveImage = true;
    }
    else {
      this.haveImage = false;
    }
    this.cookerImagePath = this.API_URL + this.params.data.cookerImagePath;
  }

  openImage(): void {
    window.open(this.cookerImagePath, '_blank');
  }

  refresh(): boolean {
    return false;
  }
}
