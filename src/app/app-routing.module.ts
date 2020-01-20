import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductChangeComponent } from './product-change/product-change.component';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderChangeComponent } from './order-change/order-change.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { RegistrationComponent } from './registration/registration.component';
import { BasketComponent } from './basket/basket.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
	{ path: '', redirectTo: 'authenticated', pathMatch: 'full' },
	{ path: 'authenticated', component: AuthenticatedComponent },
	{ path: 'registration', component: RegistrationComponent },
    { path: 'basket', component: BasketComponent, canActivate: [AuthGuard] },
    { path: 'product', component: ProductsListComponent, canActivate: [AuthGuard] },
    { path: 'add', component: CreateProductComponent, canActivate: [AuthGuard] },
	{ path: 'product/fullcus/:id', component: ProductDetailsComponent, canActivate: [AuthGuard] },
	{ path: 'product/change/:id', component: ProductChangeComponent, canActivate: [AuthGuard] },
	{ path: 'order', component: OrdersListComponent, canActivate: [AuthGuard] },
    { path: 'order/add', component: CreateOrderComponent, canActivate: [AuthGuard] },
	{ path: 'order/fullcus/:id', component: OrderDetailsComponent, canActivate: [AuthGuard] },
	{ path: 'order/change/:id', component: OrderChangeComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
