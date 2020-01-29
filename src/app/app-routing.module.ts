import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsAdd } from './home/add-products.component';
import { ProductsEdit } from './home/edit-products.component';
import { ProductsList } from './home/list-products.component';
import { OrdersShow } from './admin/show-orders.component';
import { BasketList } from './basket/basket.component';
import { OrderList } from './order/list-order.component';

const routes: Routes = [
    { path: 'products', component: ProductsList },
    { path: 'user', component: UserComponent },
    { path:'add', component: ProductsAdd },
    { path: 'admin', component: AdminComponent },
    { path: 'auth/login', component: LoginComponent },
    { path: 'signup', component: RegisterComponent },
    { path:'edit/:id', component: ProductsEdit },
    { path:'show/:id', component: OrdersShow },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
	{ path: 'basket', component: BasketList },
	{ path: 'order', component: OrderList },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
