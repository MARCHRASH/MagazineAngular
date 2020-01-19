import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../order';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'order-details',
  templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit {
	
  id: number;
  private order: Order;
  private role: boolean=false;
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private orderService: OrderService, private activateRoute: ActivatedRoute, private http: HttpClient, private router: Router)
  {
	  this.id = activateRoute.snapshot.params['id'];
	  console.log(this.id);
  }

  ngOnInit() {
	  const roleUser = localStorage.getItem('userRole');
	  console.log("Роль пользователя : "+roleUser);
	  if(roleUser==="admin"){
		  this.role=!this.role;
	  } 
	  else {
		this.http.get(`${this.baseUrl}/fulldoc/${this.id}`).subscribe((data: Order) => this.order=data);
	  }
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
