import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthenticationService } from '@app/core/http';

import {
    ILogIn,
    IOnRegister,
    IPasswordResetRequested,
    IPasswordReset,
    LoginFormComponent,
    RegistrationFormComponent,
    PasswordResetRequestFormComponent,
    PasswordResetFormComponent
} from '../components';

enum Action {
    LogIn,
    Register,
    RequestPasswordReset,
    ResetPassword
}

@Component({
    templateUrl: 'login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
    @ViewChild(LoginFormComponent) public loginForm: LoginFormComponent;
    @ViewChild(RegistrationFormComponent) public registrationForm: RegistrationFormComponent;
    @ViewChild(PasswordResetRequestFormComponent) public passwordResetRequestForm: PasswordResetRequestFormComponent;
    @ViewChild(PasswordResetFormComponent) public passwordResetForm: PasswordResetFormComponent;

    public Action = Action;
    public action = Action.LogIn;
    public disableLogin: boolean;
    public hasErrors = false;
    public isLoggingIn = false;
    public loadingMessage: string;
    public showSalesforceLogin = false;

    private resetHash = '';

    constructor(private authenticationService: AuthenticationService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private titleService: Title) {
        this.titleService.setTitle('Example | Login');
    }

    ngOnInit() {
        this.resetHash = this.activatedRoute.snapshot.params.hash;

        if (this.resetHash) {
            this.action = Action.ResetPassword;
        }
    }

    public async onLogIn(data: ILogIn) {
        try {
            await this.authenticationService.login(data.email, data.password);
            this.login();
        } catch (e) {
            this.loginForm.error = 'Invalid email address or password.';
        }
    }

    public async onRegister(data: IOnRegister) {
        try {
            await this.authenticationService.signup(data.email, data.password);
            this.login();
        } catch (e) {
            this.registrationForm.error = 'Email address has already been registered.';
        }
    }

    public async onPasswordResetRequested(data: IPasswordResetRequested) {
        try {
            await this.authenticationService.requestPasswordReset(data.email);
            this.passwordResetRequestForm.message = `An email explaining how to reset your password has been sent to ${data.email}.`;
        } catch (e) {
            this.passwordResetRequestForm.error = 'Email address has not been registered yet.';
        }
    }

    public async onPasswordReset(data: IPasswordReset) {
        try {
            await this.authenticationService.resetPassword(this.resetHash, data.password);
            this.passwordResetForm.message = `Password reset successfully. Please login with your new password.`;
        } catch (e) {
            this.passwordResetForm.error = 'An error occurred resetting your password.';
        }
    }

    public setAction(action: Action) {
        this.action = action;
    }

    private login() {
        this.loadingMessage = 'Logging in...';
        this.router.navigateByUrl('/diseases');
    }
}
