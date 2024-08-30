export interface CookerModel{
    _id: String;
    contractorName: string;
    cookerImageFileName: string;
    cookerImagePath: string;
    Above9m: string;
    Contractor: string;
    CookerRegistrationNo: string;
    SrNo: string;
    CookerRegistrationNo2: string;
    VisibleOnMap: string;
    Ward: string;
    WorkCode: string;
    Zone: string;

}


export interface ICookerModelResponce {
    message: String;
    status: number;
    data: CookerModel[];
  }