import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';

@Component({
  selector: 'product-change',
  templateUrl: './product-change.component.html',
  styles: [`
        input.ng-touched.ng-invalid {border:solid red 2px;}
        input.ng-touched.ng-valid {border:solid green 2px;}
    `]
})
export class ProductChangeComponent implements OnInit {
	
  id: number;
  product: Product = new Product();
  private baseUrl = 'http://localhost:8080/api/products';
  submitted = false;

  constructor(private orderService: OrderService, private productService: ProductService, private activateRoute: ActivatedRoute, private http: HttpClient, private router: Router)
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
		  this.http.get(`${this.baseUrl}/change/${this.id}`).subscribe((data: Product) => this.product=data);
	  }
  }
  
  save() {
	console.log("Начинаю изменение...");
    this.productService.changeProduct(this.id,this.product)
      .subscribe(data => {
			console.log(data);
			this.router.navigate(['product']);
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
