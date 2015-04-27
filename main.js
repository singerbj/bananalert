$().ready(function(){
  addb.init({
    appId: 3425
  });

  var prefixUrl = "http://addb.absolutdrinks.com";
  var suffixUrl = "/?apiKey=62700cc90288442e9514edeb70fc64ab";

  var ingredientSearch = $('#ingredient-search');
  var ingredientResults = $('#ingredient-results');
  var ingredientHave = $('#ingredient-have');
  var ingredientNeed = $('#ingredient-need');
  var drinkMake = $('#drink-make');
 
  var haveArray = [];
  var needArray = [];

  var timeoutId;
  ingredientSearch.keyup(function(ev){
    ingredientResults.empty();
    if(timeoutId){
      clearTimeout(timeoutId);  
    }
    timeoutId = setTimeout(function(){
      if(ingredientSearch.val().length > 0){
        $.ajax({
          url: prefixUrl + "/quicksearch/ingredients/" + ingredientSearch.val() + suffixUrl,
          type: 'GET',
          crossDomain: true,
          dataType: 'jsonp',
          success: function(data) {
            ingredientResults.empty();
            data.result.forEach(function(obj){  
              var possible = $('<div class="ingredient" id="i' + obj.id + '"><button class="btn btn-xs btn-default" role="button">Have It!</button>&nbsp;' + obj.name + '</div>');
              possible.ingredient = obj;
              possible.find('button').click(function(){
                var have = $('<div class="ingredient" id="i' + obj.id + '"><button class="btn btn-xs btn-default" role="button">Remove</button>&nbsp;' + obj.name + '</div>');
                have.ingredient = obj;
                have.find('button').click(function(){
                  ingredientHave.find('#i' + have.ingredient.id).remove();
                  haveArray.splice(haveArray.indexOf(have.ingredient.id), 1);
                  fetchMakeGet();
                });
                ingredientHave.append(have);
                haveArray.push(have.ingredient.id);
                fetchMakeGet();
              });
              ingredientResults.append(possible);
            });
          },
          error: function(data) {
          }
        });
      }
    }, 250);
  });


  var fetchMakeGet = function(){
    ingredientNeed.empty();
    $.ajax({
      url: prefixUrl + "/drinks/with/" + haveArray.join('/and/') + suffixUrl + '&pageSize=99999',
      type: 'GET',
      crossDomain: true,
      dataType: 'jsonp',
      success: function(data) {
        console.log(data);
        ingredientNeed.empty();
        data.result.forEach(function(drink){
          drink.ingredients.forEach(function(ingredient){
            console.log(ingredient);
            if(!(needArray.indexOf(ingredient) > -1)){
              needArray.push(ingredient.id);
              var need = $('<div class="ingredient" id="i' + ingredient.id + '"><button class="btn btn-xs btn-default" role="button">Remove</button>&nbsp;' + ingredient.name + '</div>');
              need.ingredient = ingredient;
              need.find('button').click(function(){
                ingredientNeed.find('#i' + need.ingredient.id).remove();
                needArray.splice(needArray.indexOf(need.ingredient.id), 1);
                fetchMakeGet();
              });
              ingredientNeed.append(need);
            }
          });

          //if(addDrink){
            var drinkEl = $('<div class="drink" id="d' + drink.id + '">' + drink.name + '</div>');
            drinkMake.append(drinkEl);
          //}
        });
      },
      error: function(data) {
      
      }
    }); 
  };

});


