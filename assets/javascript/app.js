$(document).ready(function(){
	var searchKeys = JSON.parse(localStorage.getItem("searchKeys")) || ["face palm", "head desk", "happy dance", "puppies"]; //Search terms to render as buttons.  Pull from LocalStorage if there are saved searches, otherwise use default list

	//Variables to hold div locations
	var buttonPanel = $("#buttonPanel");
	var searchResults = $("#searchResults");
	var savedSearchList = $("#savedSearchList");

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
//  	renderButtons();
  	localStorage.setItem("searchKeys", JSON.stringify(searchKeys));
  	addDropdownListItems();
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
  	image.addClass("results-image");
  	image.attr("id", iD);
  	div.addClass("imgClass");
  	if(state === "still"){
  		image.attr("src", stillURL);
  	}
  	else{
  		image.attr("src", animateURL);
  	}
  	paragraph.text("Rated: " + rating);
  	paragraph.addClass("results-p");
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
  		method: "GET"
  		}).done(function(response) {
  			for(var i=0; i<response.data.length; i++){
  				var rating = response.data[i].rating;
  				var stillURL = response.data[i].images.fixed_width_still.url;
  				var animateURL = response.data[i].images.fixed_width.url;
  				var state = "still";
  				renderGif(rating, stillURL, animateURL, state, i);
  			}
  		});
  };

  //Decide whether to animate or pause gif based on status, and replace the src with the correct URL
  var animateOrPause = function(imgID){
  	var image = document.getElementById(imgID);
  	var state = $(image).attr("data-state");
  	var animateURL = $(image).attr("data-animate");
  	var stillURL = $(image).attr("data-still");
  	if(state === "still"){
  		$(image).attr("src", animateURL);
  		$(image).attr("data-state", "animate");
  	}
  	else{
  		$(image).attr("src", stillURL);
  		$(image).attr("data-state", "still");
  	}
  };

  //Populates the Saved Searches dropdown list
  var addDropdownListItems = function(){
  	searchKeys = JSON.parse(localStorage.getItem("searchKeys")) || ["face palm", "head desk", "happy dance", "puppies"];
    savedSearchList.empty();
    for (var i=0; i<searchKeys.length; i++){
      var listItem = $("<li>");
      listItem.addClass("listItem");
      listItem.attr("id", searchKeys[i])
      listItem.html("<a href=#>" + searchKeys[i] + "</a>");
      savedSearchList.append(listItem);
    }
  }


  //First button render to show default button set
  //renderButtons();
  addDropdownListItems();

  //Search button event handler
  $(document).on("click", "#addToSearch",function(){
   	event.preventDefault();
  	var searchTerm = $("#searchForm").val();
  	addAButton(searchTerm);
  })

  $(document).on("click", "#clear", function(){
   	event.preventDefault();
  	$("#searchForm").val("");
  	$("#searchResults").empty();
  });

  //Search term button event handler
  $(document).on("click", "#submit", function(){
   	event.preventDefault();
  	var searchTerm = $("#searchForm").val();
  	searchResults.empty();
  	getAndDisplayGifs(searchTerm);
  });

  //Drop-down event handler
  $(document).on("click", ".listItem", function(){
   	event.preventDefault();
  	var searchTerm = $(this).attr("id");
  	searchResults.empty();
  	getAndDisplayGifs(searchTerm);
  });

  //Event handler - Click on results gif to animate
  searchResults.on("click", ".results-image", function(){
  	var imgID = $(this).attr("id");
  	animateOrPause(imgID);
  });

});