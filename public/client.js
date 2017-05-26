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
	if(abrv === 'Choose Coin to Add or Update') return;
	
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
		$('tbody.coinsYouHave').html(toAppend); 
	});

});

// on load
fetchSaveShowAndTotalPrices();


$('a.refresh').on("click", function(event){
	event.preventDefault();
  fetchSaveShowAndTotalPrices();
});

function fetchSaveShowAndTotalPrices(){
  let clonedTable = $('tbody.coinsYouHave').clone();

  let getPrices = new Promise((resolve, reject) => {
    fetchAndSavePrices(clonedTable, resolve, reject);
  })

  // tally total & grandtotal
  .then(function (clonedTable){
      var grandTotal = 0;
      //console.log('getPrices.then called');
      $(clonedTable).find('tr').each(function(){
        
        let qty = Number($(this).find('td.qty').text());
        //console.log(`qty is ${qty}`);
        
        let price =  $(this).find('td.usd').text();
        //console.log(`price is ${price}`);
        
        let total = (qty * price);
        grandTotal += total;
        //console.log(`total is ${total}`);    

        $(this).find('td.total').text(total.toFixed(2));    
      });
      $('td.grandTotal').text(grandTotal.toFixed(2));
    }
  )
  // save to DOM
  $('tbody.coinsYouHave').replaceWith(clonedTable);

}

function fetchAndSavePrices(clonedTable, resolve, reject){
  //console.log('fetchAndSavePrices called');
  $.ajax({
    url: "/coin/prices",
  })
  .done(function( theDbPriceObject ) {

      Object.keys(theDbPriceObject).map(coin => {

        var coinOrOtherObject = theDbPriceObject[coin];

          if(coinOrOtherObject.lastPrice){

            Object.keys(coinOrOtherObject.lastPrice).map(currency => {
          
              var price = coinOrOtherObject.lastPrice[currency];
          
              var tdSelectors = `tr.${coin} td.${currency.toLowerCase()}`
        
              $(clonedTable).find(tdSelectors).html(price);
            });
          }
         
    })

    resolve (clonedTable);

  });
}
	
  















