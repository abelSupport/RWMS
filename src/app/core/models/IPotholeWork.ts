import { User } from './IUser';
import { wardModel } from './IWard';

export interface PotholeWorkModel {
  _id: string;
  workCode: String;
  locationName: String;
  wardName: wardModel;
  zoneName: String;
  description: String;
  contractorName: String;
  dataDate: Date;
  length: number;
  width: number;
  coordinates: String;
  remarks: String;
  cookerRegistrationNo:String,
  masticQuantity:Number,   
  dbmQuantity:Number,  
  wmmQuantity:Number,   
  cost:Number,
  subEngineerName:User,
  beforeImagePath:String,
  afterImagePath:String,
  createdOn: Date;
  createdBy: String;
  modifiedOn: Date;
  modifiedBy: String;
}

export interface IPotholeWorkResponse {
  message: String;
  status: number;
  data: PotholeWorkModel[];
}

export interface IMasticRoadResponse {
  message: String;
  status: number;
  data: any[];
}

