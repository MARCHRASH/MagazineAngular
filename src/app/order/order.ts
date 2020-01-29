
export class Order{
	id: number;
	productName: string;
	counterProduct: number;
	constructor(productName: string, counterProduct: number){
		this.productName=productName;
		this.counterProduct=counterProduct;
	}
}