import { Component,Input,Output, OnInit,Directive,EventEmitter,QueryList, ViewChildren } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import {AuthService} from '../auth/auth.service';
import {Product} from './product';
import {BasketProduct} from '../basket/basketproduct';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'list-products',
  templateUrl: './list-products.component.html'
})
export class ProductsList implements OnInit {
	
	filt: "";
	products:any[];
	saveProducts: any[];
	info:any;
	errorMessage: string;
	private pages:any;
	private page:number=0;
  
	private roles: string[];
	private authority: string;
	
	private sortCheck : boolean = true;
  
	constructor(private token: TokenStorageService, private http: AuthService) { 
	}
	
	private prod: Product;
	
	sorting(column: number) {
		if(this.sortCheck) {
			if(column===1) {
				this.products.sort((a, b) => {
					if (a.name>b.name) {
						return 1;
					}
					if (a.name<b.name) {
						return -1;
					}
					return 0;
				});
			}
			if(column===2) {
				this.products.sort((a, b) => {
					return a.price-b.price;
				});
			}
			if(column===3) {
				this.products.sort((a, b) => {
					return a.counter-b.counter;
				});
			}
			this.sortCheck = false;
		}
		else if(!this.sortCheck) {
			if(column===1) {
				this.products.sort((a, b) => {
					if (a.name>b.name) {
						return -1;
					}
					if (a.name<b.name) {
						return 1;
					}
					return 0;
				});
			}
			if(column===2) {
				this.products.sort((a, b) => {
					return b.price-a.price;
				});
			}
			if(column===3) {
				this.products.sort((a, b) => {
					return b.counter-a.counter;
				});
			}
			this.sortCheck = true;
		}
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
	
	filter() {
		console.log("Для фильтра : "+this.filt);
		this.products=this.saveProducts;
		let prods = [];
		for(let i=0;i<this.products.length;i++) {
			let strname: string = this.products[i].name;
			if(strname.includes(this.filt)===true) {
				console.log("Нашёл подстроку в : "+this.products[i].name)
				prods.push(this.products[i]);
			}
		}
		console.log("Полученный массив : "+prods);
		this.products=prods;
	}
  
	setPage(i,event:any){
		event.preventDefault();
		this.page=i;
		this.getData();
	}
  
	deleteProd(id: number) {
		this.http.deleteProduct(id).subscribe(
			data => {
				console.log(data);
				this.getData();
			},
			error => {
				this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
			}
		);
	}
  
  getData(){
    
    this.http.getInfo(this.page).subscribe(
      data => {
        this.products = data.content;
		this.saveProducts = data.content;
        this.pages=new Array(data.totalPages);
      },
      error => {
        this.errorMessage = `${error.status}: ${JSON.parse(error.error).message}`;
      }
    );
  }
  
	inBasket(product: Product) {
		let keys = Object.keys(localStorage);
		console.log(keys);
		console.log("Длина : "+keys.length);
		var j: number = 0;
		let checkProd=false;
		for(let key of keys) {
			console.log("Полученный ключ на "+j+" : "+key);
			if(key==="userId"||key==="userRole"||key==="loggedIn"){
				console.log("Пропускаю");
			}
			else {
				let basketProd = JSON.parse(localStorage.getItem(key));
				console.log("Полученный элемент на "+j+" : "+basketProd.idprod+" "+basketProd.nameprod+" "+basketProd.priceprod+" "+basketProd.counterprod);
				if(basketProd.idprod==product.id) {
					checkProd=true;
					if(product.counter>0) {
						basketProd.counterprod++;
						localStorage.setItem(product.id.toString(), JSON.stringify(basketProd));
					}
					else {
						this.errorMessage = "Продукта нет на складе";
					}
					break;
				}
			}
			j++;
		}
		if(checkProd===false) {
			console.log("Продукт не найден");
			if(product.counter>0) {
				let basketProduct=new BasketProduct(product.id, product.name, product.price, 1);
				localStorage.setItem(product.id.toString(), JSON.stringify(basketProduct));
			}
			else {
				this.errorMessage = "Продукта нет на складе";
			}
		}
	}
	
	printProducts() {
		this.http.printProducts().subscribe(
			data => {
				console.log(data['message']);
				this.errorMessage = data['message'];
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
