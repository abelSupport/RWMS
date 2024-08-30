import { LocationModel } from './ILocation';
import { roleModel} from './IRole';



export interface PotholeUser {  
    _id:String;   
    userID: Number;
    firstName:String;
    lastName:String;
    userName:String;
    email:String;
    password:String;
    role:roleModel;
    mobileNo:String;
    
    ecNo:string;
    electrolWardNo:string;
    personalMobileNo:string;
    simAlloted:string;
    imsiAlloted:string;
    isActive:Boolean;
    locations: LocationModel[],
    wards:any[],   
    roleName:String,
    isDataEntry:String;
    createdOn:Date;
    createdBy:String;
    modifiedOn:Date;
    modifiedBy:String;
}

export interface IPotholeUserResponce{    
    message:String; 
    status :number;
    data : PotholeUser[];
    token:String;

}

export interface SearchPotholeUserUser{     
    userID: Number;
    userName:String;
    email:String; 
}
