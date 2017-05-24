let tableRow = `<tr>
	              <td class='abrv'></td>
	              <td class='qty'></td>
	              <td class='usd'>USD</td>
                <td class='eur'>EUR</td>
                <td class='cny'>CNY</td>
	              <td class='total'>TBA</td>
	            </tr>`

// button event listener
$('form#addForm').on('submit', function(event){
	// prevent default
	event.preventDefault();
	console.log("form submitted, default prevented");

	// get our values from our form
	const abrv = $('form#addForm').find('select.coin option:selected').val(); 
	if(abrv === 'Choose Coin to Add') return;
	
	const qty = $('form#addForm').find('input[name="qty"]').val();

	// make a post ajax request with our values
	$.ajax({
		method: "POST",
		url: "/coin/add",
		data: { abrv, qty }
	})
	// succcess callback - update the DOM
	.done(function( coins ) {

		// get prices, as done in https://github.com/CryptoCoinUser/cryptoCompareAPI/blob/master/cryptocompare.js
		//lookupAllPricesAndDisplayThemInRows();

		const toAppend = Object.keys(coins).map(coin => {
			let $domNode = $(tableRow);
			$domNode.find('.abrv').text(coin);
			$domNode.find('.qty').text(coins[coin]);
			//$domNode.find('.price').text(fakeCoinPrice(coin, 'USD'));
			return $domNode
		})
		// append to the dom		
		$('tbody.coin-table').html(toAppend); 
	});

});

$('a.refresh').on("click", function(event){
	event.preventDefault();
	$.ajax({
		url: "/coin/prices",
	})
	.done(function( coinsApiResponse ) {
		console.log('API Response');
		console.log(coinsApiResponse);
      // clone table or tbody and then put back

      // put prices on pageload.

	});
});
	
















