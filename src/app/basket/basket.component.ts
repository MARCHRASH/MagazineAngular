import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ProductService } from '../product.service';
import { OrderService } from '../order.service';
import { BasketProduct } from '../basketproduct';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'basket',
  templateUrl: './basket.component.html'
})
export class BasketComponent implements OnInit {
	
  private field: string;

  private basketProducts: Array<any>;

  constructor(private activateRoute: ActivatedRoute, private orderService: OrderService, private router: Router) 
  {
  }

  ngOnInit() {
    this.reloadData();
  }
  
  confirmedOrder(baskProd: BasketProduct) {
	  this.orderService.postConfirmedOrder(baskProd).subscribe(
	  data => {
		  console.log(data);
		  this.basketProducts = data;
	}, (error) => {
		  console.log(error.error.message);
	});
  }
  
  outBasket(baskProd: BasketProduct) {
	  this.orderService.postOutBasket(baskProd).subscribe(
	  data => {
		  console.log(data);
		  this.basketProducts = data;
	}, (error) => {
		  console.log(error.error.message);
	});
  }

  /*deleteProducts() {
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
  }*/

  /*reloadData() {
    this.documents = this.documentService.getDocumentsList();
  }*/
  reloadData()
  {	
	this.orderService.getBasket().subscribe(
		data=>{
			console.log("Полученные данные от сервер : "+data);
			this.basketProducts=data;
			
		},
		(error)=>
		{
			console.log(error.error.message);
		}
	)
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