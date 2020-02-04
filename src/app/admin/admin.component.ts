import { Component,Input,Output, OnInit,Directive,EventEmitter,QueryList, ViewChildren } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Order} from '../order/order';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html'
})

export class AdminComponent implements OnInit {
	filt: "";
	orders: any[];
	saveOrders:any[];
	users: any[];
	info:any;
	private pages:any;
	private page:number=0;
	sortDirection:string='';
	errorMessage: string;
	
	private sortCheck : boolean = true;
	
	constructor(private token: TokenStorageService,private http:AuthService, private route:ActivatedRoute) { 
	}
	
	private order:Order;
	
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
			if(column===3) {
				this.orders.sort((a, b) => {
					if (a.user.name>b.user.name) {
						return 1;
					}
					if (a.user.name<b.user.name) {
						return -1;
					}
					return 0;
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
			if(column===3) {
				this.orders.sort((a, b) => {
					if (a.user.name>b.user.name) {
						return -1;
					}
					if (a.user.name<b.user.name) {
						return 1;
					}
					return 0;
				});
			}
			this.sortCheck = true;
		}
	}
	
	setPage(i,event:any){
		event.preventDefault();
		this.page=i;
		this.getData();
	}
	
	getData(){
    
		this.http.getAdmin(this.page).subscribe(
		data => {
			this.orders = data.content;
			this.saveOrders = data.content;
			console.log(data);
			console.log("Длина : "+data.numberOfElements);
			this.pages=new Array(data.totalPages);
		},
		error => {
			this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
		});
	}
	
	private roles: string[];
	private authority: string;
	
	ngOnInit() {
		this.info={
			token:this.token.getToken()
		}
		if(this.info.token){
			if (this.token.getToken()) {
				console.log("Проверяю роль");
				this.roles = this.token.getAuthorities();
				this.roles.every(role => {
					if (role === 'ROLE_ADMIN') {
						console.log("Роль администратора подтверждена");
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
	
	filter() {
		console.log("Для фильтра : "+this.filt);
		this.orders=this.saveOrders;
		let ords = [];
		console.log("Длина массива : "+this.orders.length);
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
	
	printOrders() {
		this.http.printOrders().subscribe(
			data => {
				console.log(data);
				this.errorMessage = data['message'];
			},
			error => {
				this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
			}
		);
	}
}
