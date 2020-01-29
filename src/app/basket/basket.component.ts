import { Component,Input,Output, OnInit,Directive,EventEmitter,QueryList, ViewChildren } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Product} from '../home/product';
import {BasketProduct} from './basketproduct';
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
  selector: 'basket',
  templateUrl: './basket.component.html'
})
export class BasketList implements OnInit {
	
	filt: "";
	private basketProducts: any[];
	private saveBasketProducts: any[];
	info:any;
	errorMessage: string;
	
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
	constructor(private token: TokenStorageService, private http: AuthService) { 
	}
	
	onSort({column, direction}: SortEvent) {
		// resetting other headers
		this.headers.forEach(header => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});
		// sorting products
		if (direction === '') {
			this.basketProducts = this.basketProducts;
		} else {
			this.basketProducts = [...this.basketProducts].sort((a, b) => {
				const res = compare(a[column], b[column]);
				return direction === 'asc' ? res : -res;
			});
		}
	}
	
	ngOnInit() {
		this.info={
			token:this.token.getToken()
		}
		if(this.info.token){
			this.getData();
		}
		else {
			window.location.replace("/auth/login");
		}
	}
	
	filter() {
		console.log("Для фильтра : "+this.filt);
		this.basketProducts=this.saveBasketProducts;
		let prods = [];
		console.log("Длина : "+this.basketProducts.length);
		for(let i=0;i<this.basketProducts.length;i++) {
			let strname = this.basketProducts[i].nameprod;
			console.log("Строка : "+strname);
			if(strname.includes(this.filt)===true) {
				console.log("Нашёл подстроку в : "+this.basketProducts[i].nameprod)
				prods.push(this.basketProducts[i]);
			}
		}
		console.log("Полученный массив : "+prods);
		this.basketProducts=prods;
	}
	
	confirmedOrder(basketProduct: BasketProduct) {
		this.http.confirmOrder(basketProduct).subscribe(
			data => {
				console.log("Полученные данные : "+data['message']);
				this.errorMessage = data['message'];
				if(this.errorMessage==="Заказ добавлен") {
					localStorage.removeItem(basketProduct.idprod+"");
				}
				this.getData()
			},
			error => {
				this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
			}
		);
	}
	
	getData(){
		let keys = Object.keys(localStorage);
		console.log(keys);
		console.log("Длина : "+keys.length);
		var baskProds = [];
		var j: number = 0;
		for(let key of keys) {
			//console.log("Полученный ключ на "+j+" : "+key);
			if(key==="userId"||key==="userRole"||key==="loggedIn"){
				//console.log("Пропускаю");
			}
			else {
				let basketProd = JSON.parse(localStorage.getItem(key));
				//console.log("Полученный элемент на "+j+" : "+basketProd.idprod+" "+basketProd.nameprod+" "+basketProd.priceprod+" "+basketProd.counterprod);
				baskProds.push(basketProd);
			}
			j++;
		}
		this.basketProducts = baskProds;
		this.saveBasketProducts = this.basketProducts;
	}
	
	removeFromBasket(basketProduct: BasketProduct) {
		localStorage.removeItem(basketProduct.idprod+"");
		this.getData();
	}
	
	
	
	logout() {
		localStorage.clear();
		this.token.signOut();
		window.location.reload();
	}
	
}