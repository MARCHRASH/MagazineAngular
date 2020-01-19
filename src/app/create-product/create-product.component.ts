import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'create-product',
  templateUrl: './create-product.component.html',
  styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
		select.ng-touched.ng-valid {border:solid green 2px;}
		select.ng-touched.ng-invalid {border:solid red 2px;}
    `]
})
export class CreateProductComponent implements OnInit {

  product: Product = new Product();
  submitted = false;

  constructor(private orderService: OrderService, private productService: ProductService, private router: Router) { }

  ngOnInit() {
	  const userRole = localStorage.getItem('userRole');
	  if(userRole!="admin") {
		  this.router.navigate(['product']);
	  }
  }

  newProduct(): void {
    this.submitted = false;
    this.product = new Product();
  }

  save() {
    this.productService.createProduct(this.product)
      .subscribe(data => 
	  {
		console.log(data);
		this.product = new Product();
		this.router.navigate(['product']);
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
