import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductChangeComponent } from './product-change/product-change.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderChangeComponent } from './order-change/order-change.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { RegistrationComponent } from './registration/registration.component';
import { BasketComponent } from './basket/basket.component';
import { AuthGuard } from './auth.guard';


@NgModule({
  declarations: [AppComponent,CreateProductComponent,ProductDetailsComponent,ProductChangeComponent,ProductsListComponent,OrdersListComponent,CreateOrderComponent,OrderDetailsComponent,OrderChangeComponent,AuthenticatedComponent,RegistrationComponent,BasketComponent],
  imports: [ BrowserModule,FormsModule,AppRoutingModule,HttpClientModule],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
