import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { ProductsList } from './home/list-products.component';
import { AdminComponent } from './admin/admin.component';

import { httpInterceptorProviders } from './auth/auth-interceptor';
import { ProductsEdit } from './home/edit-products.component';
import { ProductsAdd } from './home/add-products.component';
import {NgbdSortableHeader} from './home/list-products.component';
import { OrdersShow } from './admin/show-orders.component';

import { BasketList } from './basket/basket.component';
import { OrderList } from './order/list-order.component';

@NgModule({
  declarations: [ AppComponent, NgbdSortableHeader, ProductsAdd, LoginComponent, UserComponent, RegisterComponent, ProductsList, AdminComponent, ProductsEdit, OrdersShow, BasketList, OrderList ],
  imports: [ BrowserModule, AppRoutingModule, FormsModule, HttpClientModule ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
