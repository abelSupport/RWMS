import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CookerService } from 'src/app/core/services/cooker.service';
import { GeoLocationService } from 'src/app/core/services/geo-location.service';
import { LocationService } from 'src/app/core/services/location.service';
import { MasticworkService } from 'src/app/core/services/masticwork.service';
import { PotholeUserService } from 'src/app/core/services/pothole-user.service';

@Component({
  selector: 'app-widgets',
  templateUrl: './widgets.component.html',
  styleUrls: ['./widgets.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WidgetsComponent implements AfterContentInit, OnInit {
  wards: any = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F/N',
    'F/S',
    'G/S',
    'G/N',
    'H/E',
    'H/W',
    'K/E',
    'K/W',
    'P/S',
    'P/N',
    'R/S',
    'R/C',
    'R/N',
    'M/E',
    'M/W',
    'L',
    'N',
    'S',
    'T',
    'EEH',
    'WEH',
  ];

  wardList: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private masticWorkService: MasticworkService,
    private potholeUserService: PotholeUserService,
    private locationService: LocationService,
    private geoService: GeoLocationService,
    private cookerService: CookerService
  ) {
    this.getWards();
  }

  getWards() {
    this.locationService.getWards().subscribe(
      (result) => {
        if (result.status === 200) {
          this.wardList = result.data;
          console.log(this.wardList);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  rowData;
  potholeUsers;
  totalcount;
  totalcompleted;

  last24hrtotalcount;
  last24hrtotalcompleted;

  ngOnInit() {
    this.getPotholeData();
    this.getLiveCookerData();
    this.getRegisteredCookersData();
  }

  displayYesterdayDate;
  getPotholeData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    this.displayYesterdayDate = yesterday.toLocaleDateString('en-GB', options);

    debugger;
    // Set startDate to the start of yesterday in UTC
    const startDate = new Date(
      Date.UTC(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        0,
        0,
        0,
        0
      )
    );

    // Set endDate to the end of yesterday in UTC
    const endDate = new Date(
      Date.UTC(
        yesterday.getFullYear(),
        yesterday.getMonth(),
        yesterday.getDate(),
        23,
        59,
        59,
        999
      )
    );

    this.masticWorkService.getPotholeWork().subscribe((result) => {
      if (result) {
        let data = result.data;
        this.potholeUserService.getPotholeUsers().subscribe((result) => {
          if (result.status === 200) {
            this.potholeUsers = result.data;
            data.forEach((row) => {
              const matchedUser = this.potholeUsers.find(
                (user) => user._id === row.subEngineerName
              );
              if (matchedUser) {
                row.userName = matchedUser.userName;
              }
            });
            let wardWiseList = [];

            data = data.filter((f) => String(f?.userName) !== '7020325511');

            this.totalcount = 0;
            this.totalcompleted = 0;
            let totalpending = 0;
            let totaltootkLessthan2hr = 0;
            let totalpending24hrcount = 0;
            let totaltookMoreThan24hrCount = 0;

            this.last24hrtotalcount = 0;
            this.last24hrtotalcompleted = 0;

            const last24hrTotalData = data.filter((f) => {
              const dataDateUTC = new Date(f.dataDate);
              return dataDateUTC >= startDate && dataDateUTC <= endDate;
            });

            this.last24hrtotalcount = last24hrTotalData.length;

            let last24hrCompletedData = last24hrTotalData.filter(
              (f) =>
                (f.beforeImagePath != null && f.afterImagePath != null) ||
                (f.dataDate !== null && f.modifiedOn !== null)
            );
            this.last24hrtotalcompleted = last24hrCompletedData.length;

            this.wards.forEach((element) => {
              let filteredWards = data.filter(
                (f) => f.wardName.wardName === element
              );
              let count = filteredWards.length;
              this.totalcount = this.totalcount + count;
              let tookMoreThan24hr = filteredWards.filter(
                (f) => f?.modifiedOn !== null
              );

              tookMoreThan24hr = tookMoreThan24hr.filter((f) => {
                let reportedDate = new Date(f.dataDate);
                let attendedDate = new Date(f.modifiedOn);
                let timeDifference =
                  Number(attendedDate) - Number(reportedDate);
                let hoursDifference = timeDifference / (1000 * 60 * 60);
                console.log(
                  reportedDate,
                  attendedDate,
                  timeDifference,
                  hoursDifference
                );
                return hoursDifference > 24;
              });
              tookMoreThan24hr = tookMoreThan24hr.filter(
                (f) => String(f.source) !== String('BulkUpload')
              );

              let tookMoreThan24hrCount = tookMoreThan24hr.length;
              totaltookMoreThan24hrCount =
                totaltookMoreThan24hrCount + tookMoreThan24hrCount;

              let lassThan2hr = filteredWards.filter(
                (f) => f?.modifiedOn !== null
              );
              lassThan2hr = lassThan2hr.filter((f) => {
                let reportedDate = new Date(f.dataDate);
                let attendedDate = new Date(f.modifiedOn);
                let timeDifference =
                  Number(attendedDate) - Number(reportedDate);
                let hoursDifference = timeDifference / (1000 * 60 * 60);
                //  console.log( reportedDate, attendedDate, timeDifference, hoursDifference );
                return hoursDifference < 2;
              });

              lassThan2hr = lassThan2hr.filter(
                (f) => String(f.source) !== String('BulkUpload')
              );

              let tookLessThan2hrCount = lassThan2hr.length;
              totaltootkLessthan2hr =
                totaltootkLessthan2hr + tookLessThan2hrCount;

              let completed = filteredWards.filter(
                (f) =>
                  (f.beforeImagePath != null && f.afterImagePath != null) ||
                  (f.dataDate !== null && f.modifiedOn !== null)
              ).length;
              this.totalcompleted = this.totalcompleted + completed;

              let pending = filteredWards.filter((f) => {
                if (f.source === 'MobileApp') {
                  return (
                    f.beforeImagePath !== null && f.afterImagePath === null
                  );
                } else if (f.source === 'BulkUpload') {
                  return f.dataDate !== null && f.modifiedOn === null;
                } else if (f.source === 'Twitter') {
                  return f.afterImagePath === null;
                }
                return false;
              });
              let pendingc = pending.length;
              totalpending = totalpending + pendingc;

              let pending24hr = filteredWards.map((f) => {
                let date = new Date(f.dataDate);
                date.setHours(date.getHours() - 5);
                date.setMinutes(date.getMinutes() - 30);
                f.dataDate = date;
                return f;
              });

              pending24hr = pending24hr.filter(
                (f) => String(f.source) !== String('BulkUpload')
              );

              // let pending24hrcount = pending24hr.filter(
              //   (f) =>
              //     (f.beforeImagePath != null &&
              //       f.afterImagePath === null &&
              //       f.dataDate < this.createdOn24hrBefore) ||
              //     (f.beforeImagePath === null &&
              //       f.afterImagePath === null &&
              //       f.dataDate < this.createdOn24hrBefore &&
              //       f.modifiedOn === null) ||
              //     (f.beforeImagePath === null &&
              //       f.afterImagePath === null &&
              //       f.dataDate === null &&
              //       f.modifiedOn === null)
              // );

              // pending24hrcount = pending24hrcount.length;
              // totalpending24hrcount = totalpending24hrcount + pending24hrcount;
              let obj = {
                wardName: element,
                count: count,
                completed: completed,
                pending: pendingc,
                //pending24hr: pending24hrcount,
                totaltookMoreThan24hrCount: tookMoreThan24hrCount,
                lessThan2hr: tookLessThan2hrCount,
                //userName: this.getNameByWardName(element),
                //mobileNo: this.getPhoneNoByWardName(element),
              };
              wardWiseList.push(obj);
            });

            let obj = {
              wardName: 'Total',
              count: this.totalcount,
              completed: this.totalcompleted,
              pending: totalpending,
              pending24hr: totalpending24hrcount,
              totaltookMoreThan24hrCount: totaltookMoreThan24hrCount,
              lessThan2hr: totaltootkLessthan2hr,
              userName: '',
              mobileNo: '',
            };
            this.rowData = wardWiseList;

            this.rowData.push(obj);
          }
        });
      }
    });
  }

  vtsData;
  liveCookers;
  getLiveCookerData() {
    this.cookerService.getCookerData().subscribe((res) => {
      if (res.status == 200) {
        let data = res.data;
        debugger;
        const uniqueDataMap = new Map();

        data.forEach((item) => {
          // Use cookerRegNo as the key and item as the value
          if (!uniqueDataMap.has(item.cookerRegNo)) {
            uniqueDataMap.set(item.cookerRegNo, item);
          }
        });

        this.liveCookers = uniqueDataMap.size;
      }
    });
  }

  registeredCookers;
  getRegisteredCookersData() {
    this.masticWorkService.getCookerMasterData().subscribe((res) => {
      const uniqueData = [];
      if (res.status == 200) {
        let data = res.data;
        debugger;
        
        
        const seen = new Map();

        for (const item of data) {
          if (!seen.has(item.CookerRegistrationNo)) {
            seen.set(item.CookerRegistrationNo, true);
            uniqueData.push(item);
          }
        }
        debugger;
        let allCookerMasterData = uniqueData.filter(cooker => cooker.CookerRegistrationNo !== "Other");
        this.registeredCookers = allCookerMasterData.length;
      }
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
