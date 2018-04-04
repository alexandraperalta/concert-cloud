

var eventBriteToken = 'H3LGM754AS3WAX5USJYR'
var googleApiKey = 'AIzaSyAoSUvf9nkYuSYOhZbwtCjt1THHC9V0KGo'
var sgId = 'MTEwMzkzNDZ8MTUyMjM2NDA5NS41Mw'
var sgKey = '094349186bab82b92cda01baee0176b6a15cb2703a3b630c1108bc73ba7a66d3'
var qYoutube;
var qEventBrite;
var eventType = "concert"
var sgQ = "";
var page = 1;
var sgPerformer = ""; 
var favorites = [];
var displayFavorites = false;



$(document).ready(function(){
 
/* EVENTBRITE
    $.ajax({
        method: 'GET',
        url: eventBriteurl,
        async: true,
        crossDomain: true,
        headers: {}
    }).done(function(response){
        var results = response.events
        console.log(results)
        for(i=0; i < results.length; i++){
            var title = results[i].name.html + '<p>'
            $('#results').append(title)
        }
    }) */

    // click event for performer button - loads youtube video
    $('body').on('click', '.performerBtn', function(){
        // get the text of the button (performer name used for youtube search)
        var performer = $(this).text();
        // get the event-id
        var eventId = $(this).attr('event-id')
        // use the event-id attr to select the videoDiv 
        var videoDiv = $('.video-output[event-id=' + eventId + ']')
        // set the youtube search to performer plus music
        qYoutube = performer + " music"
        // call youtube api with the div of where to display the video
        queryYoutube(videoDiv)
        
    })

    $('#btnSearch').on('click', function(){
        
        if(!displayFavorites){
      var  searchInput = $('#search')
      // sgPerformer = searchInput.val();
        sgQ = searchInput.val();
        querySeatGeek();
     //   searchInput.val('')
      //  resetVariables();
        }
    })

    $('#navFavorites').on('click', function(){
        displayFavorites = true;
    
        $('#navFavorites').addClass("active")
        $('#navHome').removeClass("active")
        $('#results').empty();
        if(favorites.length > 0){
            querySeatGeek();
        }
    })

    $('#navHome').on('click', function(){
        displayFavorites = false;
        $('#navFavorites').removeClass("active")
        $('#navHome').addClass("active")
        if(sgQ.length === 0){
            $('#results').empty;
        } else{
        querySeatGeek();
        }
    })

    $('body').on('click', '.btnFavorite', function(){
        var thisBtn = $(this)
        var eventId = $(this).attr("event-id")
     
        if(favorites.indexOf(eventId) < 0){
            favorites.push(eventId)
        } else {
            var idx = favorites.indexOf(eventId)
            favorites.splice(idx, 1)
        }
        if(displayFavorites){
            if(favorites.length > 0){
                querySeatGeek();
            } else {
            $('#results').empty();
            }
        }
        updateFavoriteBtn(thisBtn)  
    })
 
})




// searches seatgeek api
function querySeatGeek(){
    $('#results').empty();
    var url = 'https://api.seatgeek.com/2/events?taxonomies.name=' + eventType;
    url += '&' + $.param({
    'per_page': 10,
    'page': page,
    'q': sgQ,
    'client_id': sgId,
    'client_secret': sgKey,
    'performers.slug': sgPerformer,
    'id': favorites
    });
    console.log(url)

    $.ajax({
        method: 'GET',
        url: url,
        async: true,
        crossDomain: true,
        headers: {}
    }).done(function(response){
        // get the resulting events
        var results = response.events
        console.log(results)
        // loop through the results
        for(i = 0; i < results.length; i++){
            
            // create the main panel for results
            var resultPanel = $('<div class="panel panel-default resultPanel">')
            var panelHeading = $('<div class="panel-heading">').appendTo(resultPanel);
            // favorite button
            var btnFavorite = $('<button class="btnFavorite">').appendTo(panelHeading)
            var panelTitle = $('<h1>').appendTo(panelHeading);
            
            var panelBody = $('<div class="panel-body">').appendTo(resultPanel);

            // create the sub row to divide main panel
            var row = $('<div class="row">').appendTo(panelBody);
            // columns of main panel - size can be adjusted just by changing the bootstrap classes
            var leftCol = $('<div class="col-xs-12 col-md-6">').appendTo(row);
            var middleCol = $('<div class="col-xs-12 col-md-6">').appendTo(row);
            var rightCol = $('<div class="col-xs-0">').appendTo(row);

            // create the sub-panels
            // venuePanel contains venue info
            var venuePanel = $('<div class="panel panel-default">').appendTo(leftCol);
            var venueBody = $('<div class="panel-body">')
                            .html("<h3>Where:</h3>")
                            .appendTo(venuePanel);
            var venueDiv = $('<div>').appendTo(venueBody);
            // event panel is for event info like performers
            var eventPanel = $('<div class="panel panel-default">').appendTo(middleCol);
            var eventBody = $('<div class="panel-body">').appendTo(eventPanel);
            var eventDiv = $('<div>').appendTo(eventBody);
            // div for performers
            var performersDiv = $('<div>')
                                .html("<h3>Who:</h3>")
                                .appendTo(eventDiv);
            // div for event date and forecast
            var whenDiv = $('<div>').html("<h3>When:</h3>");
            // div for youtube video display
            var videoDiv = $('<div class="video-output">');
            
                            

            

            // get the performers
            for(j = 0; j < results[i].performers.length; j++){
                var performer = results[i].performers[j].name
                // create a btn-link for each performer, set its text to the performer name
                var performerBtn = $('<button class="btn btn-link performerBtn">').text(performer);
                // append each performer button to the performersDiv
                performersDiv.append(performerBtn);
            };

            // assign the event results to variables
            var eventId = results[i].id;
            var eventUrl = results[i].url;
            var eventScore = results[i].score;
            var venueName = '<h4>' + results[i].venue.name + '</h4>';
            var venueStreet = results[i].venue.address;
            var venueCity = results[i].venue.city;
            var venueState = results[i].venue.state;
            var venueCityandState = venueCity + ", " + venueState;
            var venueZip = results[i].venue.postal_code;
            var venueLocation = results[i].venue.location;
            var title = results[i].title;
            var date = moment(results[i].datetime_local).format("MM/DD/YYYY");
            var dateTime = moment(results[i].datetime_local) //.format("MM-DD-YYYY HH:mm")
            
            var formattedDateTime = moment(results[i].datetime_local).format("dddd, MMMM Do YYYY, [at] h:mm a")
            var formattedAddress = venueStreet + "<br>" + venueCityandState + "<br>" + venueZip
            
            

            // Set the title of the result panel
            panelTitle.html(date + " - " + title) //.append(btnFavorite) panelHeading.append(
            // append the formatted date/time to whenDiv
            whenDiv.append(formattedDateTime)
            // set the event-id for the button
            performerBtn.attr("event-id", eventId)
            //TODO: get venue rating from yelp?
            // append all the venue stuff plus the whenDiv to the venue panel
            venueDiv.append(venueName, formattedAddress, whenDiv);
            // append the videoDiv to the performersDiv (output video will display below performers)
            performersDiv.append(videoDiv);
            
            // assign ids to divs for later use
            resultPanel.attr('event-id', eventId);
            performersDiv.attr('event-id', eventId);
            whenDiv.attr('event-id', eventId);
            videoDiv.attr('event-id', eventId);
            btnFavorite.attr({'id': 'b' + eventId,
                            'event-id': eventId})
                           

            updateFavoriteBtn(btnFavorite)
            

            // get the weather if the event date is within the next 5 days (the openweather api limit)
            var fiveDaysAway = moment().add(5, 'd') //.format("MM-DD-YYYY HH:mm");
            if(moment(dateTime).isBetween(moment(), fiveDaysAway)){
                queryWeather(whenDiv, venueZip, dateTime);
            }
            // append it all to the results div
            $('#results').append(resultPanel);
        }


    }) 
    
}


// searches youtube for a video with the performer, output it to videoDiv
function queryYoutube(videoDiv){
    var googleUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=' + qYoutube + '&type=video&videoEmbeddable=true&key=' + googleApiKey
    
    $.ajax({
        method: 'GET',
        url: googleUrl,
        async: true,
        crossDomain: true,
        headers: {}
    }).done(function(response){
        // get the results
        var results = response.items
        // get the video id from the results for the url
        var videoId = results[0].id.videoId
        // set the embed url with the video id
        var videoUrl  = 'https://www.youtube.com/embed/' + videoId
        // create the video panel to contain the video
        var videoPanel = $('<div class="panel panel-default">');
        var videoBody = $('<div class="panel-body">').appendTo(videoPanel)
        var iframeDiv = $('<div class="embed-responsive embed-responsive-16by9">')
        var videoEmbed = $('<iframe class="embed-responsive-item" allowfullscreen>')
                            .attr({src: videoUrl})
                            .appendTo(iframeDiv);
        videoBody.html(iframeDiv)
        videoDiv.html(videoPanel)
        
    })
    
}


function queryWeather(whenDiv, venueZip, dateTime){
  //  var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityAndState + ",us&units=imperial&APPID=cf2aa58036825fe3fb68e07d959d4291";
    var url = "https://api.openweathermap.org/data/2.5/forecast?zip=" + venueZip + "&units=imperial&APPID=cf2aa58036825fe3fb68e07d959d4291";
    $.ajax({
        url: url,
        method: "GET",
        async: true,
      crossDomain: true,
      headers: {}
      }).then(function(response) {
        var results = response.list
        console.log(response)
        for(var i = 0; i < results.length; i++){

      var forecastStartTime = moment(results[i].dt_txt)
      var forecastEndTime;
      if(i + 1 < results.length){
        forecastEndTime = moment(results[i + 1].dt_txt) 
      } else {
        forecastEndTime = moment(results[i].dt_txt)
      }
     
      console.log(i, venueZip, forecastStartTime, forecastEndTime, dateTime)
        if((moment(dateTime).isBetween(forecastStartTime, forecastEndTime, 'minute', [])) || (moment(dateTime).isSame(forecastStartTime, forecastEndTime, 'minute'))) {
            var lowTemp = Math.round(results[i].main.temp_min)
            var highTemp = Math.round(results[i].main.temp_max)
            var humidity = results[i].main.humidity
            var rain = results[i].rain
            var forecast = results[i].weather[0].description
            var weather = $("<div>").html('<h4>Forecast</h4>' + 'Temp: ' + lowTemp + ' - ' + highTemp + '&#176 (F)<br>' + forecast)
            whenDiv.append(weather)
        }
    }
      });
}


function updateFavoriteBtn(thisBtn){
    
    thisBtn.empty();
    var eventId = $(thisBtn).attr("event-id")
    var favStar = $('<span class="glyphicon">')
   console.log(thisBtn.attr("event-id"))
    // if it's not in favorites[], empty star otherwise filled star
    if(favorites.indexOf(eventId) < 0){
      //  $(thisBtn).attr("btnState", "inactive")
        favStar.removeClass("glyphicon-star").addClass("glyphicon-star-empty")
       
    } else {
     //   $(thisBtn).attr("btnState", "active")
        favStar.removeClass("glyphicon-star-empty").addClass("glyphicon-star")  
    }
        $(thisBtn).append(favStar)
}






