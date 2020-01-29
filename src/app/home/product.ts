
export class Product{
	id: number;
	name: string;
	price: number;
	counter: number;
	constructor(name: string, price: number, counter: number){
		this.name=name;
		this.price=price;
		this.counter=counter;
	}
}