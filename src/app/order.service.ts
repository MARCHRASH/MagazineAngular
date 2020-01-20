import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product';
import { BasketProduct } from './basketproduct';

interface sendData {
	success: boolean,
	message: string
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8080/api/orders';
  private baseTest = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getOrder(id: number): Observable<Object> {
    return this.http.get(`${this.baseUrl}/fulldoc/${id}`);
  }
  
  changeOrder(id: number, order: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}` + `/changeOrd` + `/${id}`, order);
  }

  createOrder(order: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}` + `/create`, order);
  }

  updateOrder(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  getOrdersList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
  getPageOrdersList(page: number) {//: Observable<any> {
    return this.http.get(this.baseTest+'/orders?page='+page);
  }
  
  postUserId(id: number) {//: Observable<any> {
    return this.http.post<sendData>(this.baseTest+'/sendid', id);
  }
  
  postUserRole(role: string) {//: Observable<any> {
    return this.http.post<sendData>(this.baseTest+'/sendrole', role);
  }
  
  postProductIdBasket(product: Product) {//: Observable<any> {
    return this.http.post(this.baseTest+'/intobasket', product);
  }
  
  getWhenExit() {//: Observable<any> {
    return this.http.get(this.baseTest+'/product/whenexit');
  }
  
  getBasket(): Observable<any> {
	  return this.http.get(this.baseTest+'/basket');
  }
  
  postConfirmedOrder(basketProduct: BasketProduct): Observable<any> {
	  return this.http.post(this.baseTest+'/confirmedorder', basketProduct);
  }
  
  postOutBasket(basketProduct: BasketProduct): Observable<any> {
    return this.http.post(this.baseTest+'/outbasket', basketProduct);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + `/delete`, { responseType: 'text' });
  }
}
