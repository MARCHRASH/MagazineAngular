import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Order } from '../order';
import { OrderService } from '../order.service';

@Component({
  selector: 'create-order',
  templateUrl: './create-order.component.html',
  styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
		select.ng-touched.ng-valid {border:solid green 2px;}
		select.ng-touched.ng-invalid {border:solid red 2px;}
    `]
})
export class CreateOrderComponent implements OnInit {

  order: Order = new Order();
  submitted = false;

  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit() {
	  const userRole = localStorage.getItem('userRole');
	  if(userRole!="admin") {
		  this.router.navigate(['product']);
	  }
  }

  newOrder(): void {
    this.submitted = false;
    this.order = new Order();
  }

  save() {
    this.orderService.createOrder(this.order)
      .subscribe(data => 
	  {
		console.log(data);
		this.order = new Order();
		this.router.navigate(['order']);
	  },(error) => 
	  {
		  console.log(error);
	  });
  }

  onSubmit() {
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
