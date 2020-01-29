import { Component,OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from '../auth/token-storage.service';
  
@Component({
    selector: 'show',
    templateUrl:'./show.html'
})

export class OrdersShow implements OnInit{
	id: number;
	info:any;
    form:any={};
    errorMessage:any;
	private roles: string[];
	private authority: string;
	
    constructor(private http:AuthService, private token: TokenStorageService, private activateRoute: ActivatedRoute){
		this.id = activateRoute.snapshot.params['id'];
		console.log(this.id);
    }
	
    getData(){
        this.http.getOrder(this.id).subscribe(
            data => {
				this.form = data;
				console.log(this.form);
            },
            error => {
              this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
			}
		);   
    }
	
    ngOnInit()
    {
		this.info={
			token:this.token.getToken()
		}
		if(this.info.token){
			if (this.token.getToken()) {
				this.roles = this.token.getAuthorities();
				this.roles.every(role => {
					if (role === 'ROLE_ADMIN') {
						this.authority = 'admin';
						this.getData();
						return false;
					} 
					return true;
				});
			}
			if(this.authority !== 'admin') {
				localStorage.clear();
				this.token.signOut();
				window.location.replace("/auth/login");
			}   
		}
		else {
			localStorage.clear();
			this.token.signOut();
			window.location.replace("/auth/login");
		}
    }  
}
