let tableRow =`<tr>
<td class='abrv'></td>
<td class='qty'></td>
<td class='cur'>some currency price placeholder</td>
<td class='total'>TBA</td>
</tr>`

function paintTheTable(data){
  console.log('data.savedUser.cur');
  console.log(data.savedUser.cur);
  const cur = data.savedUser.cur.toUpperCase();
  const coins = data.savedUser.coins;

  var grandTotal = 0;
  const toAppend = Object.keys(coins).reverse().map(coin => {
    let $domNode = $(tableRow);
    $domNode.find('.abrv').text(coin);
    $domNode.find('.qty').text(coins[coin]);

    $domNode.find('.cur').text(data.savedPrices[coin].lastPrice[cur]);

    var total = Number(coins[coin]) * Number(data.savedPrices[coin].lastPrice[cur]);
    grandTotal += total;
    $domNode.find('.total').text(total);
    //$domNode.find('.price').text(fakeCoinPrice(coin, 'USD'));
    return $domNode
  })
  $('td.grandTotal').text(grandTotal.toFixed(2));
  // append to the dom    
  $('tbody.coinsYouHave').html(toAppend); 
}


function fetchSaveShowAndTotalPrices(){
  $.ajax({
    url: "/coin/prices",
  })
  .then(function(data){
    paintTheTable(data);
  })
  .fail(function(err){
    console.log(err);
  })
}


$('form#chooseCurrency').on('submit', function(event){
  event.preventDefault();
  const cur = $('form#chooseCurrency').find('select.cur option:selected').val();

  $.ajax({
    method: "POST",
    url: "/user/cur",
    data: { cur }
  })
  .done(function( curString ) {
    fetchSaveShowAndTotalPrices();
    $('span.yourCurrencyIs').text(curString);
  });

})

// button event listener
$('form#addForm').on('submit', function(event){
	// prevent default
	event.preventDefault();
	
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
	.done(function( data ) {
    fetchSaveShowAndTotalPrices();
	});

});

$('a.refresh').on("click", function(event){
	event.preventDefault();
  fetchSaveShowAndTotalPrices();
});


// on load
fetchSaveShowAndTotalPrices();

	
  















