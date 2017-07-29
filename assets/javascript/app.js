$(document).ready(function(){
	var searchKeys = ["face palm", "head desk", "happy dance", "puppies"]; //Search terms to render as buttons

	//Variables to hold div locations
	var buttonPanel = $("#buttonPanel");
	var searchResults = $("#searchResults");

	// Function for displaying the search term buttons.  From in-class activity
  var renderButtons = function(){
    buttonPanel.empty();
    for (var i=0; i<searchKeys.length; i++){
      var button = $("<button>");
      button.attr("class", "searchTermsBtn btn");
      button.attr("id", searchKeys[i])
      button.text(searchKeys[i]);
      buttonPanel.append(button);
    }
  };

  //Adds a button to the buttonPanel
  var addAButton = function(newKey){
  	searchKeys.push(newKey);
  	renderButtons();
  };

  //Renders a gif in the Search Results div
  var renderGif = function(rating, stillURL, animateURL, state, iD){
  	var image = $("<img>");
  	var div = $("<div>");
  	var paragraph = $("<p>");
  	image.attr("data-still", stillURL);
  	image.attr("data-animate", animateURL);
  	image.attr("data-state", state);
  	image.attr("data-rating", rating);
  	image.class("results-image");
  	image.attr("id", iD);
  	if(state === "still"){
  		image.attr("src", stillURL);
  	}
  	else{
  		image.attr("src", animateURL);
  	}
  	paragraph.text("Rated: " + rating);
  	paragraph.class("results-p");
  	div.append(image);
  	div.append(paragraph);
  	searchResults.append(div);
  };

  /*
  Calls Giphy API, parses results, displays result gifs
  Giphy API key: 3a4a1f1b1bcd4f59beca120bfe5622f4
  Giphy API call: https://api.giphy.com/v1/gifs/search?api_key=3a4a1f1b1bcd4f59beca120bfe5622f4&q=&limit=10&lang=en
  */
  var getAndDisplayGifs = function(searchTerm){
  	var uriSearchTerm = encodeURIComponent(searchTerm)
  	var urlWithSearchTerm = "https://api.giphy.com/v1/gifs/search?api_key=3a4a1f1b1bcd4f59beca120bfe5622f4&limit=10&lang=en&q=" + uriSearchTerm;
  	$.ajax({
  		url: urlWithSearchTerm,
  		method: "GET"}).done(function(response){
  			for(var i=0; i<response.length; i++){
  				var rating = response.rating;
  				var stillURL = response.images.fixed_width_still;
  				var animateURL = response.images.fixed_width;
  				var state = "still";
  				renderGifs(rating, stillURL, animateURL, state, i);
  			}
  		});
  };


  //First button render to show default button set
  renderButtons();

  //Search button event handler
  $("#submit").click(function(){
   	event.preventDefault();
  	var searchTerm = $("#searchForm").val();
  	addAButton(searchTerm);
  })

  //Search term button event handler
  buttonPanel.on("click", ".searchTermsBtn", function(){
   	event.preventDefault();
  	var searchTerm = $(this).attr("id");
  	console.log(searchTerm);
  	searchResults.empty();
  	getAndDisplayGifs(searchTerm);
  });

  //Event handler - Click on results gif to animate
  searchResults.on("click", ".results-image", function(){
  	var imgID = $(this).attr("id");
  	swapImgUrl(imgID);
  });

});