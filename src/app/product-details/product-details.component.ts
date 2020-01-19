import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../product';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../order.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {
	
  id: number;
  private role: boolean=false;
  private product: Product;
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private productService: ProductService, private activateRoute: ActivatedRoute, private http: HttpClient, private orderService: OrderService, private router: Router)
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
	  this.http.get(`${this.baseUrl}/fulldoc/${this.id}`).subscribe((data: Product) => this.product=data);
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
