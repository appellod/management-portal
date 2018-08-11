import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSort, MatTable, MatTableDataSource, MatDialog } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { IdentityService } from '@app/core/authentication';
import { UserService } from '@app/core/http';
import { PromptComponent } from '@app/shared/components';
import { SNACKBAR_DURATION } from '@app/shared/constants';
import { User } from '@app/shared/models';

import { UserFormComponent } from '../components';

@Component({
  templateUrl: 'users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<User>;

  public dataSource: MatTableDataSource<User>;
  public displayedColumns: string[] = ['email', 'level', 'createdAt', 'updatedAt'];
  public search = '';

  private subject: Subject<string> = new Subject();

  constructor(public identityService: IdentityService,
              private matDialog: MatDialog,
              private snackBar: MatSnackBar,
              private titleService: Title,
              private userService: UserService) {}

  ngOnInit() {
    this.titleService.setTitle('Example | Users');

    if (this.identityService.user.level === 1) {
      this.displayedColumns.push('actions');
    }

    this.fetchUsers();

    this.subject.pipe(debounceTime(300)).subscribe(this.applyFilter.bind(this));
  }

  public clearSearch() {
    this.search = '';
    this.applyFilter('');
  }

  public onKeyUp(searchTextValue: string) {
    this.subject.next(searchTextValue);
  }

  public showRemovePrompt(user: User) {
    const dialogRef = this.matDialog.open(PromptComponent, {
      data: {
        buttons: [{ label: 'No' }, { color: 'primary', label: 'Yes' }],
        message: `Are you sure you want to delete ${user.email}?`
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'Yes') {
        await this.userService.remove(user._id);
        this.snackBar.open('User deleted successfully.', 'Close', { duration: SNACKBAR_DURATION });
        this.removeUser(user);
      }
    });
  }

  public showUpdatePrompt(user: User) {
    const dialogRef = this.matDialog.open(UserFormComponent, {
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser(result);
      }
    });
  }

  private applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private async fetchUsers() {
    const users = await this.userService.find({});

    this.dataSource = new MatTableDataSource<User>(users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private removeUser(user: User) {
    const index = this.dataSource.data.findIndex(u => u._id === user._id);
    this.dataSource.data.splice(index, 1);

    this.dataSource.data = [].concat(this.dataSource.data);
    this.table.renderRows();
  }

  private updateUser(user: User) {
    const index = this.dataSource.data.findIndex(u => u._id === user._id);
    this.dataSource.data[index] = user;

    this.dataSource.data = [].concat(this.dataSource.data);
    this.table.renderRows();
  }
}
