import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { OrderService } from '../order.service';

@Component({
	selector:'app-auth',
	templateUrl: './authenticated.component.html',
	styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
    `]
})
export class AuthenticatedComponent implements OnInit {
	
	user: User = new User();
	
	private errorMessage: string;
	
	constructor(private Auth: UserService, private router: Router, private orderService: OrderService) {}
	
	ngOnInit() 
	{
		this.Auth.setLoggedIn(false, 0, "user");
	}
	
	loginUser(event) {
		event.preventDefault()
		const target = event.target
		const login = target.querySelector('#login').value
		const password = target.querySelector('#password').value
		
		this.Auth.getUserDetails(login, password).subscribe(data => {
			console.log(data)
			this.user = data;
			console.log("Пользователь : "+this.user.id+" "+this.user.login+" "+this.user.role);
			this.orderService.postUserId(this.user.id).subscribe(
				data=>{
					console.log(data);
					this.Auth.setLoggedIn(true, this.user.id, this.user.role);
					this.router.navigate(['product']);
					
					this.orderService.postUserRole(this.user.role).subscribe(
						data => {
							console.log(data);
						}, (error) => {
							console.log(error.error.message);
						}
					);
					
				},(error)=>
				{
					console.log(error.error.message);
				});
			},(error)=>{console.log(error.error),this.errorMessage=error.error});
	}
}