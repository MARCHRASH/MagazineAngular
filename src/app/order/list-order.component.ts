import { Component,Input,Output, OnInit,Directive,EventEmitter,QueryList, ViewChildren } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Order} from './order';
import {BasketProduct} from '../basket/basketproduct';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'list-order',
  templateUrl: './list-order.component.html'
})
export class OrderList implements OnInit {
	filt: "";
	orders:any[];
	saveOrders:any[];
	info:any;
	errorMessage: string;
	private pages:any;
	private page:number=0;
  
	private roles: string[];
	private authority: string;
	private check: boolean=false;
	
	private sortCheck : boolean = true;
  
	constructor(private token: TokenStorageService, private http: AuthService) { 
	}
	private order: Order;
	
	sorting(column: number) {
		if(this.sortCheck) {
			if(column===1) {
				this.orders.sort((a, b) => {
					if (a.productName>b.productName) {
						return 1;
					}
					if (a.productName<b.productName) {
						return -1;
					}
					return 0;
				});
			}
			if(column===2) {
				this.orders.sort((a, b) => {
					return a.counterProduct-b.counterProduct;
				});
			}
			this.sortCheck = false;
		}
		else if(!this.sortCheck) {
			if(column===1) {
				this.orders.sort((a, b) => {
					if (a.productName>b.productName) {
						return -1;
					}
					if (a.productName<b.productName) {
						return 1;
					}
					return 0;
				});
			}
			if(column===2) {
				this.orders.sort((a, b) => {
					return b.counterProduct-a.counterProduct;
				});
			}
			this.sortCheck = true;
		}
	}
	
	filter() {
		console.log("Для фильтра : "+this.filt);
		this.orders=this.saveOrders;
		let ords = [];
		console.log("Длина : "+this.orders.length);
		for(let i=0;i<this.orders.length;i++) {
			let strname: string = this.orders[i].productName;
			console.log("Строка : "+strname);
			if(strname.includes(this.filt)===true) {
				console.log("Нашёл подстроку в : "+this.orders[i].productName)
				ords.push(this.orders[i]);
			}
		}
		console.log("Полученный массив : "+ords);
		this.orders=ords;
	}
  
	ngOnInit() {
		this.info={
			token:this.token.getToken()
		}
		if(this.info.token){
			this.getData();
			if (this.token.getToken()) {
				this.roles = this.token.getAuthorities();
				this.roles.every(role => {
					if (role === 'ROLE_ADMIN') {
						this.authority = 'admin';
						this.check=true;
						return false;
					} 
					return true;
				});
			}
		}
		else {
			window.location.replace("/auth/login");
		}
	}
  
	setPage(i,event:any){
		event.preventDefault();
		this.page=i;
		this.getData();
	}
  
	getData(){
		this.http.getInfoOrder(this.page).subscribe(
			data => {
				this.orders = data.content;
				this.saveOrders = this.orders;
				this.pages=new Array(data.totalPages);
			},
			error => {
				this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
			}
		);
	}
  
	logout() {
		localStorage.clear();
		this.token.signOut();
		window.location.reload();
	}
  
}
