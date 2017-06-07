let tableRow =`<tr>
<td class='abrv'></td>
<td class='qty'></td>
<td class='usd'>USD price placeholder</td>
<td class='eur'>EUR price placeholder</td>
<td class='cny'>CNY price placeholder</td>
<td class='total'>TBA</td>
</tr>`

function paintTheTable(data){
  const coins = data.savedUser.coins;

  var grandTotal = 0;
  const toAppend = Object.keys(coins).reverse().map(coin => {
    let $domNode = $(tableRow);
    $domNode.find('.abrv').text(coin);
    $domNode.find('.qty').text(coins[coin]);

    $domNode.find('.usd').text(data.savedPrices[coin].lastPrice.USD);
    $domNode.find('.eur').text(data.savedPrices[coin].lastPrice.EUR);
    $domNode.find('.cny').text(data.savedPrices[coin].lastPrice.CNY);

    var usdTotal = Number(coins[coin]) * Number(data.savedPrices[coin].lastPrice.USD);
    grandTotal += usdTotal;
    $domNode.find('.total').text(usdTotal);
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
  });
}


$('form#chooseCurrency').on('submit', function(event){
  event.preventDefault();
  const cur = $('form#chooseCurrency').find('select.cur option:selected').val();
  console.log(`Cur is ${cur}`);

  $.ajax({
    method: "POST",
    url: "/user/cur",
    data: { cur }
  })
  .done(function( curString ) {
    console.log('AJAX cur is');
    console.log(curString);
    // select option in select.cur
    // $('select.cur option:selected').prop("selected"); // remove selected property
    // const newCurOptionSelector = `select.cur option.${curString}`;
    // console.log(newCurOptionSelector);
    // $('newCurOptionSelector').prop("selected");
    $('span.yourCurrencyIs').text(curString);

    // remove other currencies from tableRow
    const curTd = `<td class='${curString}'>${curString} price placeholder</td>`;
    console.log(curTd);
    $(tableRow).find('.total').text(curTd);
    $(tableRow).append('hello world');
    console.log(tableRow);

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
    paintTheTable(data);
	});

});

$('a.refresh').on("click", function(event){
	event.preventDefault();
  fetchSaveShowAndTotalPrices()
});


// on load
fetchSaveShowAndTotalPrices();

	
  















