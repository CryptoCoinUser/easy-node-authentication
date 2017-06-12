let tableRow =`<tr class='coin'>
<td class='abrv'> </td>
<td class='qty'><input class="qtyInput" type="text" size="7" value="0"> <a href="#" class="delete" title="Delete this coin">X</a></td>
<td class='cur'>some currency price placeholder</td>
<td class='total'>TBA</td>
</tr>`

function paintTheTable(data){
  const cur = data.savedUser.cur.toUpperCase();
  const coins = data.savedUser.coins;

  var grandTotal = 0;
  const toAppend = Object.keys(coins).reverse().map(coin => {
    let $domNode = $(tableRow);
    $domNode.find('.abrv').prepend(coin);
    $domNode.find('.qty .qtyInput').val(coins[coin]);

    $domNode.find('.cur').text(data.savedPrices[coin].lastPrice[cur]);

    var total = Number(coins[coin]) * Number(data.savedPrices[coin].lastPrice[cur]);
    grandTotal += total;
    $domNode.find('.total').text(total.toFixed(2));
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


$('form#chooseCurrency select').on('change', function(event){
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

 $('form#addForm').on('submit', function(event){
 	event.preventDefault();
	
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

$('form#tableForm').on('keyup', 'input.qtyInput', function(event){
  event.preventDefault();
  this.value = this.value.replace(/[^0-9\.]/g,'');
});

$('form#addForm').on('keyup', 'input.generalQtyInput', function(event){
  event.preventDefault();
  this.value = this.value.replace(/[^0-9\.]/g,'');
});

$('form#tableForm').on('blur', 'input.qtyInput', function(event){
  event.preventDefault();

  const abrv = $(this).closest('.coin').find('.abrv').text();
  console.log('qty for abrv');
  console.log(abrv);
  
  const qty = $(this).val();
  console.log('qty');
  console.log(qty);

  $.ajax({
    method: "POST",
    url: "/coin/qty",
    data: { abrv, qty }
  })
  .done(function( data ) {
    paintTheTable(data);
  });

});


$('form#tableForm a.delete').on('click', function(event){
  event.preventDefault();

   const abrv = $(this).closest('.coin').find('.abrv').text();
   console.log('delete abrv is');
   console.log(abrv);
/*
  $.ajax({
    method: "POST",
    url: "/coin/delete",
    data: { abrv }
  })
  .done(function( data ) {
    paintTheTable(data);
  });
*/
});


$('a.refresh').on("click", function(event){
	event.preventDefault();
  fetchSaveShowAndTotalPrices();
});


// on load

if($(location).attr('pathname') === '/profile'){
  fetchSaveShowAndTotalPrices();
}


	
  















