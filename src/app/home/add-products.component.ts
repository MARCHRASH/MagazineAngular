import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';
  
@Component({
    selector: 'add-products',
    templateUrl:'./add-products.component.html'
})

export class ProductsAdd implements OnInit{
    form:any={};
    info:any;
	private authority: string;
	private roles: string[];
	
    constructor(private addService:AuthService,private token: TokenStorageService){
    }
	
    ngOnInit(){
		this.info={
			token:this.token.getToken()
		}
		if(!this.info.token){
			window.location.replace("/auth/login");
		}
		else {
			if (this.token.getToken()) {
				this.roles = this.token.getAuthorities();
				this.roles.every(role => {
					if (role === 'ROLE_ADMIN') {
						this.authority = 'admin';
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
    }
	
    onSubmit(){
		this.addService.Add(this.form).subscribe(
			data => {
				console.log(data); 
				window.location.replace("/products");   
			}, 
			error => {
				console.log(error);
			}
		);
    }
	
	logout() {
		localStorage.clear();
		this.token.signOut();
		window.location.reload();
	}
}
