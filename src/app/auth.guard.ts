import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
	
	constructor(private Auth: UserService, private router: Router)
	{
		
	}
	
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
			if(!this.Auth.isLoggedIn)
			{
				this.router.navigate(['authenticated'])
			}
			return this.Auth.isLoggedIn;
		}
}