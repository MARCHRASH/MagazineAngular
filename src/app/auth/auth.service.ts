import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtResponse } from './jwt-response';
import { AuthLoginInfo } from './login-info';
import { SignUpInfo } from './signup-info';
import{Product} from '../home/product';
import{Order} from '../order/order';
import{BasketProduct} from '../basket/basketproduct';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private loginUrl = 'http://localhost:8080/api/auth/signin';
	private signupUrl = 'http://localhost:8080/api/auth/signup';
	private addUrl='http://localhost:8080/api/auth/addProduct';
	private addOrderUrl='http://localhost:8080/api/auth/addOrder';
	private homeUrl ='http://localhost:8080/api/auth/home/';
	private UrlOrders ='http://localhost:8080/api/auth/order/';
	private editUrl='http://localhost:8080/api/auth/products';
	private editUrlOrder='http://localhost:8080/api/auth/orders';
	private adminUrl='http://localhost:8080/api/auth/admin/';
	private editforUrl='http://localhost:8080/api/auth/products/changePro';
	private deleteforUrl='http://localhost:8080/api/auth/products/delete';
  
	constructor(private http: HttpClient) {
	}

	attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
		return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
	}
  
	deleteProduct(id: number): Observable<any> {
		return this.http.delete(this.deleteforUrl+`/${id}`, { responseType: 'text' });
	}

	signUp(info: SignUpInfo): Observable<string> {
		return this.http.post<string>(this.signupUrl, info, httpOptions);
	}
  
	getInfoOrder(page:number): Observable<any>{
		return this.http.get<any>(this.UrlOrders+page,httpOptions);
	}
  
	Add(product:Product): Observable<JwtResponse> {
		return this.http.post<JwtResponse>(this.addUrl,product, httpOptions);
	}
  
	confirmOrder(basketProduct: BasketProduct): Observable<JwtResponse> {
		console.log("Передаю объект : "+basketProduct.idprod+" "+basketProduct.nameprod);
		return this.http.post<JwtResponse>(this.addOrderUrl, basketProduct, httpOptions);
	}
  
	Edit(id: number, product: Product): Observable<JwtResponse> {
		return this.http.post<JwtResponse>(this.editforUrl+`/${id}`,product, httpOptions);
	}
	
	getInfo(page:number):Observable<any>{
		return this.http.get<any>(this.homeUrl+page,httpOptions);
	}
	
	printOrders(): Observable<JwtResponse> {
		return this.http.post<JwtResponse>(this.UrlOrders+`save`, httpOptions);
	}
  
	printProducts(): Observable<JwtResponse> {
		return this.http.post<JwtResponse>(this.editUrl+`/save`, httpOptions);
	}
  
	getAdmin(page:number):Observable<any>{
		return this.http.get<any>(this.adminUrl+page,httpOptions);
	}
  
	getProd(id: number):Observable<Product>{
		return this.http.get<Product>(this.editUrl+`/${id}`,httpOptions);
	}
	
	getOrder(id: number):Observable<Order>{
		return this.http.get<Order>(this.editUrlOrder+`/${id}`,httpOptions);
	}
  
	sendProd(product:any):Observable<JwtResponse>{
		return this.http.post<JwtResponse>(this.editUrl,product,httpOptions);
	}
}
