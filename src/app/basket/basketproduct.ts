
export class BasketProduct{
	idprod: number;
	nameprod: string;
	priceprod: number;
	counterprod: number;
	constructor(idprod: number, nameprod: string, priceprod: number, counterprod: number){
		this.idprod=idprod;
		this.nameprod=nameprod;
		this.priceprod=priceprod;
		this.counterprod=counterprod;
	}
}