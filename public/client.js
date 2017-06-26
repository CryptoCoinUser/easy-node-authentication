let tableRow =`<tr class='coin'>
<td class='abrv'> </td>
<td class='qty'>
  <input class="qtyInput" type="text" size="7" value="0"> 
  <a href="#" class="delete" title="Delete this coin">X</a>
</td>
<td class='cur'>some currency price placeholder</td>
<td class='total'>TBA</td>
</tr>`

function paintTheTable(data){

  const cur = data.savedUser.cur.toUpperCase();
  const coins = data.savedUser.coins;


  var grandTotal = 0;
  const toAppend = Object.keys(coins).reverse().map(coin => {
    if(coins[coin] < 0){
      return "";
    }


    let $domNode = $(tableRow);
    $domNode.find('.abrv').text(coin); 
    $domNode.find('.qty .qtyInput').val(coins[coin]);

    $domNode.find('.cur').text(data.savedPrices[coin].lastPrice[cur]);

    let total = Number(coins[coin]) * Number(data.savedPrices[coin].lastPrice[cur]);
    grandTotal += total;

    let totalText;

    if(total > 0){
      switch(true){
        case (total < 0.0001): 
          totalText = total.toFixed(5);
          break;
        case (total < 0.001):
          totalText = total.toFixed(4);
          break;
        case (total < 0.01):
          totalText = total.toFixed(3);
          break;
      default:
        totalText = total.toFixed(2);
      }
    } else {
      totalText = total;
    }

    $domNode.find('.total').text(totalText);
    

    addToChartData(coin);
    updateValueInChartData(coin, total);

    //$domNode.find('.price').text(fakeCoinPrice(coin, 'USD'));
    return $domNode
  })
  drawChart();
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
  .done(function( curObject ) {
    fetchSaveShowAndTotalPrices();
    $('span.yourCurrencyIs').text(curObject.cur);
  });

})

 $('form#addForm').on('submit', function(event){
 	event.preventDefault();
	
 	const abrv = $('form#addForm').find('select.coin option:selected').val(); 
	if(abrv === 'Choose Coin to Add or Update') return;
	
	const qty = $('form#addForm').find('input[name="qty"]').val();

	$.ajax({
		method: "POST",
		url: "/coin/add",
		data: { abrv, qty }
	})

	.done(function( data ) {
    fetchSaveShowAndTotalPrices();
	});

});

$('form#tableForm').on('keyup', 'input.qtyInput', function(event){
  event.preventDefault();
  this.value = this.value.replace(/[^0-9\.]/g,'');
});

$('form#addForm').on('keyup', 'input#generalQtyInput', function(event){
  event.preventDefault();
  this.value = this.value.replace(/[^0-9\.]/g,'');
});

$('form#tableForm').on('blur', 'input.qtyInput', function(event){
  event.preventDefault();

  const abrv = $(this).closest('.coin').find('.abrv').text();
  
  const qty = $(this).val();


  $.ajax({
    method: "PUT",
    url: "/coin/qty",
    data: { abrv, qty }
  })
  .done(function( data ) {
    paintTheTable(data);
  });

});


$('form#tableForm').on('click', 'a.delete', function(event){
  event.preventDefault();

  const coinToSend = $(this).closest('.coin').find('.abrv').text().toUpperCase(); //toUpperCase just in case;
  $.ajax({
    method: "DELETE",
    url: "/coin/delete",
    data: { abrv: coinToSend }
  })
  .done(function( data ) {
    paintTheTable(data);
  });

  deleteFromChartData(coinToSend);

});


$('a.refresh').on("click", function(event){
	event.preventDefault();
  fetchSaveShowAndTotalPrices();
});


/* visualization with d3plus.org */
/* */
function addToChartData(abrv){
  let coinValuePair = {"abrv": abrv, "value": 0};
  chartData.push(coinValuePair);
}

function updateValueInChartData(abrv, total){
  for(var i = 0; i < chartData.length; i++){
    if(chartData[i]["abrv"] === abrv){
      chartData[i]["value"] = Number(total);
      return;
    }
  }
}

function deleteFromChartData(abrv){
  for(var i = 0; i < chartData.length; i++){
    if(chartData[i]["abrv"] === abrv){
      chartData.splice(i,1);
      return;
    }
  }
}



var chartData = [];

function drawChart(){
  $('#viz').html('');
  d3plus.viz()
    .container("#viz")
    .data(chartData)
    .type("tree_map") //.type("pie")
    .id("abrv")
    .size("value")
    .labels({"align": "left", "valign": "top"})
    .draw()
}


// on load

if($(location).attr('pathname') === '/profile'){
  fetchSaveShowAndTotalPrices();
  drawChart();
}


	
  















