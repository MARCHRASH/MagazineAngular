import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
	selector:'app-reg',
	templateUrl: './registration.component.html',
	styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
    `]
})
export class RegistrationComponent implements OnInit {
	
	user: User = new User();
	
	private errorMessage: string;
	
	constructor(private Reg: UserService, private router: Router) {}
	
	ngOnInit() {}
	
	registrationUser(event) {
		event.preventDefault();
		const target = event.target;
		const login = target.querySelector('#login').value;
		const password = target.querySelector('#password').value;
		const passwordCheck = target.querySelector('#passwordCheck').value;
		
		if(password===passwordCheck) {
			this.Reg.regUser(login, password).subscribe(data => { this.router.navigate(['authenticated']);},(error)=>{console.log(error.error),this.errorMessage=error.error});
		}
		else {
			this.errorMessage = "Пароли не совпадают";
		}
	}
}