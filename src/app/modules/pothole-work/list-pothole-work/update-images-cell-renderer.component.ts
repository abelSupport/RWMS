import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { MasticworkService } from 'src/app/core/services/masticwork.service';

@Component({
  selector: 'btn-cell-renderer',
  template: `
    <!-- <label cLabel class="col-sm-3" for="txtFileUpload">Before Image</label> -->
    <c-row class="mb-12"> 
      <c-col [sm]="6">
        <input
          cFormControl
          type="file"
          #csvReader
          name="Upload File"
          id="beforeImage"
          (change)="beforeUploadListener($event)"
          accept=".jpg"
        />
      </c-col>

      <c-col [sm]="6">
        <button class="me-1" color="light" cButton color="success" (click)="updateBeforeImage()">
          <svg cIcon name="cilNoteAdd"></svg>
          Before Image Update
        </button>
      </c-col>      
    </c-row>

    <c-row class="mb-12"> 
      <c-col [sm]="6">
        <input
          cFormControl
          type="file"
          #csvReader
          name="Upload File"
          id="beforeImage"
          (change)="beforeUploadListener($event)"
          accept=".jpg"
        />
      </c-col>

      <c-col [sm]="6">
        <button class="me-1" color="light" cButton color="warning" (click)="updateAftereImage()">
          <svg cIcon name="cilNoteAdd"></svg>
          After Image Update
        </button>
      </c-col>      
    </c-row>
  `,
})
export class BtnUpdateBeforeImageCellRenderer
  implements ICellRendererAngularComp
{
  private params: any;
  edit: boolean = false;
  isDataEntry: boolean = false;
  userRole = sessionStorage.getItem('UserRole');
  dataEntry = sessionStorage.getItem('isDataEntry');
  isDelete: boolean = false;
  wardList = [];
  beforeImagePath: string;
  afterImagePath: string;
  constructor(
    public matDialog: MatDialog, 
    private router: Router,
    private masticWorkService: MasticworkService,
  ) {}

  agInit(params: any): void {
    debugger;
    this.params = params;
  }

  selectedFile: File = null;
  beforeImageBase64: String = null;
  beforeImageFileName: String = null;
  
  beforeUploadListener(event: any): void {
    this.selectedFile = event.target.files[0];
    this.beforeImageFileName = this.selectedFile.name;
    this.convertFile(this.selectedFile).subscribe((base64) => {
      this.beforeImageBase64 = base64;
      console.log(this.beforeImageBase64);
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      result.next(reader.result.toString());
      result.complete();
    };
    return result;
  }

  updateBeforeImage() {
    debugger;
    var id = this.params.data.masticWorkID;

    if (id) {
      if(this.beforeImageBase64 != null) {
        let objMasticWork = {
          _id : this.params.data._id,
          dataDate: this.params.data.dataDate,
          beforeImage: this.beforeImageBase64,
          beforeImageFileName: this.beforeImageFileName,
          afterImage: null,
          afterImageFileName: null,
          modifiedBy: sessionStorage.getItem('FullName'),
        };

        this.masticWorkService.updateImages(objMasticWork).subscribe((res) => {
          debugger;
          if(res.status == 201) {
            Swal.fire({
              text: 'Image Updated',
              icon: 'success',
            });
            // window.location.reload();
          }
        });
      }

      else {
        Swal.fire({
          text: "Choose Image",
          icon: "warning"
        })
      }

    }
  }

  updateAftereImage() {
    debugger;
    var id = this.params.data.masticWorkID;

    if (id) {
      if(this.params.data.beforeImagePath != null) {
        if(this.beforeImageBase64 != null) {
          let objMasticWork = {
            _id : this.params.data._id,
            dataDate: this.params.data.dataDate,
            beforeImage: null,
            beforeImageFileName: null,
            afterImage: this.beforeImageBase64,
            afterImageFileName: this.beforeImageFileName,
            modifiedBy: sessionStorage.getItem('FullName'),
          };
    
          this.masticWorkService.updateImages(objMasticWork).subscribe((res) => {
            debugger;
            if(res.status == 201) {
              Swal.fire({
                text: 'Image Updated',
                icon: 'success',
              });
              // window.location.reload();
            }
          });
        }
  
        else {
          Swal.fire({
            text: "Choose Image",
            icon: "warning"
          })
        }
      }

      else {
        Swal.fire({
          text: "Upload before Image First",
          icon: "warning"
        })
      }

    }
  }

  refresh(): boolean {
    return false;
  }
}
