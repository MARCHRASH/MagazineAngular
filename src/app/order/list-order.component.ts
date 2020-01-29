import { Component,Input,Output, OnInit,Directive,EventEmitter,QueryList, ViewChildren } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Order} from './order';
import {BasketProduct} from '../basket/basketproduct';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

 
export type sortDirection='asc'|'desc'|'';
const rotate: {[key: string]: sortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };
export const compare = (v1, v2) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
export interface SortEvent{
  column:string;
  direction:sortDirection;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()'
  }
})
export class NgbdSortableHeader {

  @Input() sortable: string;
  @Input() direction: sortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    this.direction = rotate[this.direction];
    this.sort.emit({column: this.sortable, direction: this.direction});
  }
}

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
  
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
	constructor(private token: TokenStorageService, private http: AuthService) { 
	}
	private order: Order;
  
  
	onSort({column, direction}: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});
		// sorting products
		if (direction === '') {
			this.orders = this.orders;
		} else {
			this.orders = [...this.orders].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
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
