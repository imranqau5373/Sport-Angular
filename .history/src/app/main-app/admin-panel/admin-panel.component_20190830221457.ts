import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../../shared/services/http-api.service';
import { Title } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  sportName: string = "";
  constructor(private _httpService: HttpApiService, private modalService: NgbModal,
    private titleService: Title, private notifierService: NotifierService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin - Traffilizer');
    this.getUsers();
    this.getSports();
    //this.getReports();
  }

  loading: boolean = false;
  userList: any = [];
  sportList: any = [];
  //reportList: any = [];
  adminSelect: number = 1;

  // getReports() {
  //   this.loading = true;
  //   this._httpService.masterGet("api/admin/getallreports").subscribe(result => {
  //     this.loading = false;
  //     this.reportList = result;
  //   }, error => {
  //     this.loading = false;
  //   });
  // }

  getSports() {
    this.loading = true;
    this._httpService.masterGet("api/dashboard/GetAllSports").subscribe(result => {
      this.loading = false;
      this.sportList = result;
    }, error => {
      this.loading = false;
    });
  }

  getUsers() {
    this.loading = true;
    this._httpService.masterGet("api/admin/getalluser").subscribe(result => {
      this.loading = false;
      this.userList = result;
    }, error => {
      this.loading = false;
    });
  }

  inActiveUser(id) {
    this.loading = true;
    this._httpService.masterPost("api/admin/deactivateuser/", { "Id": id }).subscribe(result => {
      this.notifierService.notify('success', 'User deactivate successfully!');
      this.loading = false;
      for (const index in this.userList) {
        if (this.userList[index].Id == id) {
          this.userList[index].Status = false;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  activeUser(id) {
    this.loading = true;
    this._httpService.masterPost("api/admin/activateuser/", { "Id": id }).subscribe(result => {
      this.notifierService.notify('success', 'URL activate successfully!');
      this.loading = false;
      for (const index in this.userList) {
        if (this.userList[index].Id == id) {
          this.userList[index].Status = true;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  deleteUser(content, id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/admin/deleteuser/", { "Id": id }).subscribe(result => {
          this.notifierService.notify('success', 'User deleted successfully!');
          this.loading = false;
          for (const index in this.userList) {
            if (this.userList[index].Id == id) {
              this.userList.splice(index, 1);
            }
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });
  }

  OpenAddSport(content) {
    this.sportName = '';

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/dashboard/AddSport", { Sport_Name: this.sportName }).subscribe(result => {
          if (result.success) {
            this.notifierService.notify('success', 'URL added successfully!');
            this.loading = false;
          //  this.getUrls();
          }
          else {
            this.notifierService.notify('error', result.message);
            this.loading = false;
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });
  }
  ValidSport() {

   if (this.sportName.length < 0) {
      return true;
    } else {
      return false;
    }
  }

  disableSport(id) {
    this.loading = true;
    this._httpService.masterPost("api/dashboard/disablesport/", id).subscribe(result => {
      this.notifierService.notify('success', 'Sport disabled successfully!');
      this.loading = false;
      for (const index in this.sportList) {
        if (this.sportList[index].Sport_ID == id) {
          this.sportList[index].Status = false;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  enableSport(id) {
    debugger;
    this.loading = true;
    this._httpService.masterPost("api/dashboard/enablesport/", id).subscribe(result => {
      this.notifierService.notify('success', 'URL enabled successfully!');
      this.loading = false;
      for (const index in this.sportList) {
        if (this.sportList[index].Sport_ID == id) {
          this.sportList[index].Status = true;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  deleteSport(id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/dashboard/deletesport/", id).subscribe(result => {
          this.notifierService.notify('success', 'URL deleted successfully!');
          this.loading = false;
          for (const index in this.sportList) {
            if (this.sportList[index].Sport_ID == id) {
              this.sportList.splice(index, 1);
            }
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });

  }

  // deleteReportUrl(content, id){
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     if (result == "SaveClick") {
  //       this.loading = true;
  //       this._httpService.masterPost("api/admin/deletereporturl/", id).subscribe(result => {
  //         this.notifierService.notify('success', 'URL deleted successfully!');
  //         this.loading = false;
  //         for (const index in this.reportList) {
  //           if (this.reportList[index].Id == id) {
  //             this.reportList.splice(index, 1);
  //           }
  //         }
  //       }, error => {
  //         this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
  //         this.loading = false;
  //       });

  //     }
  //   }, (reason) => {
  //   });
  // }

  // resolveReport(content, id){
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //     if (result == "SaveClick") {
  //       this.loading = true;
  //       this._httpService.masterPost("api/admin/resolvereport/", id).subscribe(result => {
  //         this.notifierService.notify('success', 'Report resolved successfully!');
  //         this.loading = false;
  //         for (const index in this.reportList) {
  //           if (this.reportList[index].Id == id) {
  //             this.reportList.splice(index, 1);
  //           }
  //         }
  //       }, error => {
  //         this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
  //         this.loading = false;
  //       });

  //     }
  //   }, (reason) => {
  //   });
  // }


}
