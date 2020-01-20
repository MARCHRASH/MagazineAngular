import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ProductService } from '../product.service';
import { OrderService } from '../order.service';
import { Product } from '../product';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html'
})
export class ProductsListComponent implements OnInit {
	
  private page: number=0;
  private field: string;
  
  private role: boolean=false;

  private products: Array<any>;
  private pages: Array<number>;

  constructor(private productService: ProductService, private activateRoute: ActivatedRoute,private orderService: OrderService, private router: Router) 
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

  deleteProducts() {
    this.productService.deleteAll()
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log('ERROR: ' + error));
  }
  
  deleteProduct(id: number) {
    this.productService.deleteProduct(id)
      .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }
  
  putInBasket(productToBasket: Product) {
	  this.orderService.postProductIdBasket(productToBasket).subscribe(
		data => {
			console.log("Полученные данные от сервера : "+data);
			this.reloadData();
		}, (error) => {
			console.log(error);
		});
  }

  reloadData()
  {	
	const userid = JSON.parse(localStorage.getItem('userId'));
	const roleUser = localStorage.getItem('userRole');
	console.log("Полученный id пользователя : "+userid);
	this.orderService.postUserId(userid).subscribe(
		data=>{
			console.log(data);
			this.productService.getPageProductsList(this.page).subscribe(
				data=>{
					this.products=data['content'];
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
