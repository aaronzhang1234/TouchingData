//Justin Delisi formatCurrency.js
inlets = 1;
outlets = 1;
var formattedAmount;


function formatCurrency(amount) {
	amount = Math.round(amount);
	formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	outlet(0, formattedAmount);
}