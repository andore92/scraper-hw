// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='article-box'>" + 
                            data[i].title + 
                            "<br />" + 
                            data[i].link + 
                            "<button class='btn btn-default'data-toggle='modal' data-target='#article-modal'>"+
                            "<a class='save-article-btn' data-id="+data[i]._id+">" +
                            "Save Article</a>"+
                            "</button>" +
                            "</div>");

  }
});

$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    if (data[i].saved === true) {
    // Display the apropos information on the page
    $("#saved-articles").append("<div class='article-box'>" + 
                            data[i].title + 
                            "<br />" + 
                            data[i].link + 
                            "<button class='btn btn-default' data-toggle='modal' data-target='#notesModal'>"+
                            "<a class='view-notes-btn' data-id="+ data[i]._id +">" +
                            "View Notes</a>"+
                            "</button>" +
                            "</div>");
  } else {
    "<div> No saved articles</div>"
  }

  }
});


$(document).on("click", ".save-article-btn", function(){
  $('.modal-title').empty();
  $('.modal-body').empty();
  var thisId = $(this).attr("data-id");
  console.log("button clicked")
  $.ajax({
    method: "GET",
    url: "/save/" + thisId
  }).done(function(data){

      $('.modal-title').append("<h2>Article Saved!</h2>")
      $('.modal-body').append("<p>Article can now be found by clicking on the Saved Articles tab</p>");
    
  
  });


 

});


// Whenever someone clicks a p tag
$(document).on("click", ".view-notes-btn", function() {
  // Empty the notes from the note section
  $('.modal-title').empty();
  $('.modal-body').empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $(".modal-title").append("<h2>" + data.title + "</h2>");
      console.log("test")
      // An input to enter a new title
      $(".modal-body").append("<div id='modal-input'>")
      $("#modal-input").append("<input class='input-group' id='titleinput' name='note title' >");
      // A textarea to add a new note body
      $("#modal-input").append("<input class='input-group' id='bodyinput' name='body'>");
      // A button to submit a new note, with the id of the article saved to it
      $("#modal-input").append("<button class='btn btn-default' data-id='" + data._id + "' id='savenote'>Save New Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $(".modal-body").append("<div id='current-note'>")
        // Place the body of the note in the body textarea
        $("#current-note").append("<h3>Current Note</h3>")
        $("#current-note").append("<h4>" + data.note.title + "</h4>")
        $("#current-note").append("<p>" + data.note.body + "</p>")
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
  $('.modal-title').empty();
  $('.modal-body').empty();
});