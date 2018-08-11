import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

import { IdentityService } from '@app/core/authentication';
import { UserService } from '@app/core/http';
import { SNACKBAR_DURATION } from '@app/shared/constants';
import { User, IUser } from '@app/shared/models';

export interface UserFormComponentData {
  user: User;
}

@Component({
  selector: 'app-user-form',
  templateUrl: 'user-form.component.html',
  styleUrls: ['user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  public error: string;
  public form: FormGroup;

  constructor(public dialogRef: MatDialogRef<UserFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: UserFormComponentData,
              private formBuilder: FormBuilder,
              public identityService: IdentityService,
              private snackBar: MatSnackBar,
              private userService: UserService) {}

  public ngOnInit() {
    this.dialogRef.updateSize('360px');
    this.setupForm();
  }

  public async save() {
    if (this.form.invalid) {
      this.form.get('email').markAsTouched();
      this.form.get('level').markAsTouched();

      return;
    }

    const values: IUser = {
      email: this.form.get('email').value,
      level: this.form.get('level').value
    };

    if (this.data.user._id) {
      this.update(values);
    } else {
      this.create(values);
    }
  }

  private async create(data: IUser) {
    try {
      const user = await this.userService.create(data);
      this.snackBar.open('User created successfully.', 'Close', { duration: SNACKBAR_DURATION });
      this.dialogRef.close(user);
    } catch (e) {
      this.error = 'That email is already taken.';
    }
  }

  private setupForm(): void {
    this.data = this.data || { user: new User() };

    this.form = this.formBuilder.group({
      email: [this.data.user.email, Validators.required],
      level: [this.data.user.level],
    });

    this.form.valueChanges.subscribe(() => this.error = null);
  }

  private async update(data: IUser) {
    data._id = this.data.user._id;

    try {
      const user = await this.userService.update(data);
      this.snackBar.open('User updated successfully.', 'Close', { duration: SNACKBAR_DURATION });
      this.dialogRef.close(user);
    } catch (e) {
      this.error = 'That email is already taken.';
    }
  }
}
