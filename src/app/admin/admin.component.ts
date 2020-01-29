import { Component,Input,Output, OnInit,Directive,EventEmitter,QueryList, ViewChildren } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Order} from '../order/order';
import { ActivatedRoute} from '@angular/router';

 
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
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
	
	constructor(private token: TokenStorageService,private http:AuthService, private route:ActivatedRoute) { 
	}
	
	private order:Order;
	onSort({column, direction}: SortEvent) {

    // resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});
    
    // sorting orders
		if (direction === '') {
			this.orders = this.orders;
		} 
		else {
			this.orders = [...this.orders].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
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
