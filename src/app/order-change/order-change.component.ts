import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../order';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'order-change',
  templateUrl: './order-change.component.html',
  styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
    `]
})
export class OrderChangeComponent implements OnInit {
	
  id: number;
  order: Order = new Order();
  private baseUrl = 'http://localhost:8080/api/orders';
  submitted = false;

  constructor(private orderService: OrderService, private activateRoute: ActivatedRoute, private http: HttpClient, private router: Router)
  {
	  this.id = activateRoute.snapshot.params['id'];
	  console.log(this.id);
  }

  ngOnInit() {
	  const userRole = localStorage.getItem('userRole');
	  if(userRole!="admin") {
		  this.router.navigate(['product']);
	  }
	  else {
		this.http.get(`${this.baseUrl}/change/${this.id}`).subscribe((data: Order) => this.order=data);
	  }
  }
  
  save() {
	console.log("Начинаю изменение...");
    this.orderService.changeOrder(this.id,this.order)
      .subscribe(data => {
			console.log(data);
			this.router.navigate(['order']);
		}, (error) => {
			console.log(error);
		});
	console.log("Изменение завершено.");
  }
  
  onSubmit()
  {
	this.submitted = true;
    this.save();
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
