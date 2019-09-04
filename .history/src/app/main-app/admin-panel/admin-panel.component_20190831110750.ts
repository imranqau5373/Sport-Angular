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
    this.getCourts();
  }

  loading: boolean = false;
  userList: any = [];
  sportList: any = [];
  courtList: any = [];
  adminSelect: number = 1;

  getCourts() {
    this.loading = true;
    this._httpService.masterGet("api/dashboard/getallcourts").subscribe(result => {
      this.loading = false;
    //  result.Court_Created_Date =  formatDate(result.Court_Created_Date, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
      this.courtList = result;
    }, error => {
      this.loading = false;
    });
  }

  getSports() {
    this.loading = true;
    this._httpService.masterGet("api/admin/GetAllSports").subscribe(result => {
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
        this._httpService.masterPost("api/admin/AddSport", { Sport_Name: this.sportName }).subscribe(result => {
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
    this._httpService.masterPost("api/admin/disablesport/", id).subscribe(result => {
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
    this._httpService.masterPost("api/admin/enablesport/", id).subscribe(result => {
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

  deleteSport(content,id) {   
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {     
      if (result == "SaveClick") {       
        this.loading = true;       
        this._httpService.masterPost("api/admin/deletesport/", id).subscribe(result => {          
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


  enableCourt(id) {
    debugger;
    this.loading = true;
    this._httpService.masterPost("api/admin/enablesport/", id).subscribe(result => {
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

  disableCourt(content, id){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/admin/disablecourt/", id).subscribe(result => {
          this.notifierService.notify('success', 'Report resolved successfully!');
          this.loading = false;
          for (const index in this.courtList) {
            if (this.courtList[index].Court_ID == id) {
              this.courtList.splice(index, 1);
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


}
