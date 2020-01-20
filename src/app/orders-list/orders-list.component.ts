import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../user';

import { OrderService } from '../order.service';
import { Order } from '../order';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListComponent implements OnInit {
	
  private page: number=0;
  private field: string;
  
  private role: boolean=false;

  private orders: Array<any>;
  private pages: Array<number>;

  constructor(private orderService: OrderService, private activateRoute: ActivatedRoute, private router: Router) 
  {
  }
  
  setPage(i,event:any)
  {
	  event.preventDefault();
	  this.page=i;
	  this.reloadData();
  }

  ngOnInit() {
	const roleUser = localStorage.getItem('userRole');
	  console.log("Роль пользователя : "+roleUser);
	  if(roleUser==="admin"){
		  this.role=!this.role;
	  } 
		this.reloadData();
  }

  deleteOrders() {
    this.orderService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: ' + error));
  }
  
  deleteOrder(id: number) {
    this.orderService.deleteOrder(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }
  
  reloadData()
  {	
	const userid = JSON.parse(localStorage.getItem('userId'));
	const roleUser = localStorage.getItem('userRole');
	this.orderService.postUserId(userid).subscribe(
		data=>{
			console.log(data);
			this.orderService.getPageOrdersList(this.page).subscribe(
				data=>{
					this.orders=data['content'];
					this.pages=new Array(data['totalPages']);
					
					this.orderService.postUserRole(roleUser).subscribe(
						data => {
							console.log(data);
						}, (error) => {
							console.log(error.error.message);
						}
					);
					
				},
				(error)=>
				{
					console.log(error.error.message);
				}
			);
		}, (error)=>
		{
			console.log(error.error.message);
		});
  }
  
  exit() {
	  console.log("Выхожу");
	  this.orderService.getWhenExit().subscribe(
		data => {
			console.log("Полученные данные от сервера : "+data);
			this.router.navigate(['authenticated']);
		}, (error) => {
			console.log(error);
		});
  }
}
