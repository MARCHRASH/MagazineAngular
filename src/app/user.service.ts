import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface sendData {
	success: boolean,
	message: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
	private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn') || 'false');
	
	constructor(private http: HttpClient) {}
	
	setLoggedIn(value: boolean, id: number, role: string){
		this.loggedInStatus = value;
		//this.loggedInId = id;
		localStorage.setItem('loggedIn', this.loggedInStatus);
		localStorage.setItem('userId', id+"");
		localStorage.setItem('userRole', role);
		console.log("Установленная роль : "+role);
	}
	
	get isLoggedIn() {
		return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString())
	}
	
	getUserDetails(login, password): Observable<any>
	{
		console.log("Логин : "+login);
		console.log("Пароль : "+password);
		return this.http.post<sendData>('http://localhost:8080/api/login', {
			login,
			password
		})
	}
	
	regUser(login, password)
	{
		console.log("Логин : "+login);
		console.log("Пароль : "+password);
		return this.http.post<sendData>('http://localhost:8080/api/registration', {
			login,
			password
		})
	}
}