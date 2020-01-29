import { Component,Input,OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {Product} from './product';
import { TokenStorageService } from '../auth/token-storage.service';
  
@Component({
    selector: 'edit-products',
    templateUrl:'./edit-products.component.html'
})

export class ProductsEdit implements OnInit{
	id: number;
    form:any={};
    errorMessage:any;
    info:any;
	private authority: string;
	private roles: string[];
	
    constructor(private http:AuthService, private token: TokenStorageService, private activateRoute: ActivatedRoute){
		this.id = activateRoute.snapshot.params['id'];
		console.log(this.id);
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
						return false;
					} 
					return true;
				});
			}
            this.http.getProd(this.id).subscribe(
                data => {
                  this.form = data;
                  console.log(this.form);
                },
                error => {
                  this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
                }
			);
        }
		else {
			window.location.replace("/auth/login");
		}
    }
	
    onSubmit(){ 
		this.http.Edit(this.id, this.form).subscribe(
			data => {
				console.log(data);    
			}, 
			error => {
				console.log(error);
			}
		);
		window.location.replace("/products")
    }
	
	logout() {
		localStorage.clear();
		this.token.signOut();
		window.location.reload();
	}
}
