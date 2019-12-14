$(document).ready(function() { 
    var minutesDisplayEl = document.querySelector("#minutes");
    var secondsDisplayEl = document.querySelector("#seconds");
    var searchContainerEl = document.querySelector(".searchContent");
    var resultContainerEl = document.querySelector(".resultContent");
    var userInputEl = document.querySelector(".userInput");
    var searchBtnEl = document.querySelector('.searchBtn');
    var currentDayEl = document.querySelector("#currentDay")

    var totalSeconds = 0;
    var secondsElapsed = 0;
    var interval;
    var score = 0;
    var shuffledQues = "";
    var currentQuesIndex = 0;
    var currentHour = 0;
    // This is our API key
    var APIKey = '20fbd5d33642471f44e32d9d9f0a2317';
    // 'https://api.openweathermap.org/data/2.5/forecast?q=sydney,aus&mode=xml&appid='
    var queryURL;

    getLocation();
    displayCityArray();

    $(".searchBtn").on("click", searchBtn);
    $(".savedCityBtn").on("click", savedCityBtn);
    $(".clearBtn").on("click", clearList);

    function searchBtn(event) {
        // This 'preventDefault' method tells the user agent that if the event does not get explicitly
        // handled, its default action should not be taken as it normally would be.
        event.preventDefault(event);
        // The stopPropagation() method stops the bubbling of an event to parent elements, preventing
        // any parent handlers from being notified of the event. You can use the method event.isPropagationStopped()
        // to know whether this method was ever called (on that event object).
        event.stopPropagation(event);
        console.log("search button clicked");
        var cityNameInput = $(".userInput").val().trim();
        cityNameUppercase = cityNameInput.toUpperCase();
        console.log(cityNameInput);
        if(cityNameInput != '') {
            $(".searchBtn").on("click", ajaxSearch(cityNameInput));
            $(".savedCityBtn").on("click", savedCityBtn);
        }
        // Transfer content to HTML
        // $(".city").html("<h1>" + response.name + " Weather Details</h1>");
        // $(".wind").text("Wind Speed: " + response.wind.speed);
        
        // // Converts the temp to Kelvin with the below formula
        // var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        // $(".tempF").text("Temperature (Kelvin) " + tempF);

        // Log the data in the console as well
        // console.log("Wind Speed: " + response.wind.speed);
    }

    function savedCityBtn(event) {
        // This 'preventDefault' method tells the user agent that if the event does not get explicitly
        // handled, its default action should not be taken as it normally would be.
        event.preventDefault(event);
        // The stopPropagation() method stops the bubbling of an event to parent elements, preventing
        // any parent handlers from being notified of the event. You can use the method event.isPropagationStopped()
        // to know whether this method was ever called (on that event object).
        event.stopPropagation(event);
        console.log("city button clicked");
        var cityNameInput = $(this).attr('data-value').trim();
        console.log(cityNameInput);

        ajaxSearch(cityNameInput);
    }

    function geoLocationWeather(latitude,longitude){
        // Here we are building the URL we need to query the database
        if (location.protocol === 'http:') {
            queryURL = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
            latitude + '&lon=' + longitude + '&appid=' + APIKey;
        }
        else {
            queryURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' +
            latitude + '&lon=' + longitude + '&appid=' + APIKey;
        }
        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
        url: queryURL,
        method: "GET"
        })
        // We store all of the retrieved data inside of an object called "response"
        .then(function(response) {
            $('.resultContent').empty();
            // Log the queryURL
            console.log(queryURL);
            // Log the resulting object
            console.log(response);
            var stringifyResponse = JSON.stringify(response);
            for(var i = 0; i < 1; i++){
                var cityName = JSON.stringify(response.name);
                var cityLat = JSON.stringify(response.coord.lat);
                var cityLon = JSON.stringify(response.coord.lon);
                var cityDate = response.dt;
                var displayDate = moment.unix(cityDate).utc();
                var cityWeatherIcon = response.weather[i-i].icon;
                var iconURL = 'http://openweathermap.org/img/w/' + cityWeatherIcon + '.png';
                var cityTemp = JSON.stringify(response.main.temp);
                var tempF = (cityTemp - 273.15) * 1.80 + 32;
                var cityHumidity = JSON.stringify(response.main.humidity);
                var cityWindSpeed = JSON.stringify(response.wind.speed);

                console.log(cityDate);
                console.log(displayDate.toString());
                console.log('Temperature: ' + tempF.toFixed(2) + '\xB0F');
                // Here we run our AJAX call to the OpenWeatherMap UltraViolet API
                if (location.protocol === 'http:') {
                    var uvindexURL = 'http://api.openweathermap.org/data/2.5/uvi?appid=' +
                    APIKey + '&lat=' + cityLat + '&lon=' + cityLon;
                }
                else {
                    uvindexURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' +
                    APIKey + '&lat=' + cityLat + '&lon=' + cityLon;
                }
                $.ajax({
                url: uvindexURL,
                method: "GET"
                })
                // We store all of the retrieved data inside of an object called "response"
                .then(function(uvResponse) {
                    $('.resultContent').empty();
                    // Log the queryURL
                    console.log(uvResponse);
                    var cityUVIndex = JSON.stringify(uvResponse.value);
                    console.log(cityUVIndex);
                    // var stringifyResponse = JSON.stringify(response);
                    var displayDiv = $('<div>').addClass('displayDiv col-md-12');
                    var title01El = $('<div>').addClass('currentDay col-md-12');
                    var title02El = $('<div>').addClass('currentDay col-md-12');
                    var cityNameEl = $('<div>').addClass('currentDay col-md-9');
                    var tempFEl = $('<div>').addClass('currentDay col-md-12');
                    var cityHumidityEl = $('<div>').addClass('currentDay col-md-12');
                    var cityWindSpeedEl = $('<div>').addClass('currentDay col-md-12');
                    var row01El = $('<div>').addClass('row');
                    var cityUVIndexTitleEl = $('<div>').addClass('currentDay');
                    var cityUVIndexValueEl = $('<div>').addClass('currentDay');
                    var weatherIconEl = $('<div>').addClass('currentDay col-md-4')
                    var weatherIcon = $('<img>').addClass('weatherIcon'); 

                    weatherIcon.css('text-align', 'left');
                    weatherIcon.attr('src', iconURL)
                    displayDiv.attr('dataIndex', i);
                    displayDiv.css({'border': 'solid', 'border-width': '1px', 'border-color': '#777777', 'padding-bottom': '20px'});
                    cityUVIndexTitleEl.css({'margin-bottom': '10px', 'margin-left': '30px', 'margin-right': '10px'});
                    cityUVIndexValueEl.css({'background-color': '#ff0000', 'color': '#ffffff', 'margin-bottom': '10px', 'padding-left': '5px', 'padding-right': '5px', 'border-radius': '5px'});
                    $('.resultContent').append(displayDiv);

                    title01El.html('<h3>Current Location</h3>');
                    title02El.html('<h3>5-Day Forcast:</h3>');
                    cityNameEl.html('<h3>' + cityName + ' ' + displayDate.format('DD/MM/YYYY') + '</h3>');
                    tempFEl.text('Temperature: ' + tempF.toFixed(2) + '\xB0F');
                    cityHumidityEl.text('Humidity: ' + cityHumidity + '\u0025');
                    cityWindSpeedEl.text('Wind Speed: ' + cityWindSpeed + ' MPH');
                    cityUVIndexTitleEl.text('UV Index:');
                    cityUVIndexValueEl.text(cityUVIndex);

                    displayDiv.append(title01El);
                    displayDiv.append(cityNameEl);
                    displayDiv.append(weatherIconEl);
                    weatherIconEl.append(weatherIcon);
                    displayDiv.append(tempFEl);
                    displayDiv.append(cityHumidityEl);
                    displayDiv.append(cityWindSpeedEl);
                    displayDiv.append(row01El);
                    row01El.append(cityUVIndexTitleEl);
                    row01El.append(cityUVIndexValueEl);
                    displayDiv.append(title02El);

                    if (location.protocol === 'http:') {
                        var queryForcast = 'http://api.openweathermap.org/data/2.5/forecast?lat=' +
                        cityLat + '&lon=' + cityLon + '&appid=' + APIKey;
                    }
                    else {
                        queryForcast = 'https://api.openweathermap.org/data/2.5/forecast?lat=' +
                        cityLat + '&lon=' + cityLon + '&appid=' + APIKey;
                    }
                    // Here we run our AJAX call to the OpenWeatherMap UltraViolet API
                    $.ajax({
                    url: queryForcast,
                    method: "GET"
                    })
                    // We store all of the retrieved data inside of an object called "response"
                    .then(function(response) {
                        var forcastRow = $('<div>').addClass('row');
                        forcastRow.css('font-size', '12px')
                        displayDiv.append(forcastRow);
                        console.log(response);

                        for(i = 0; i < 5; i++) {
                            cityDate = response.list[i * 8].dt;
                            displayDate = moment.unix(cityDate).utc();
                            cityWeatherIcon = response.list[i * 8].weather[(i * 8)-(i * 8)].icon;
                            iconURL = 'http://openweathermap.org/img/w/' + cityWeatherIcon + '.png';
                            cityTemp = JSON.stringify(response.list[i * 8].main.temp);
                            tempF = (cityTemp - 273.15) * 1.80 + 32;
                            cityHumidity = JSON.stringify(response.list[i * 8].main.humidity);
                            cityWindSpeed = JSON.stringify(response.list[i * 8].wind.speed);

                            var forcastDiv = $('<div>').addClass('col-md-2 forcastDiv');
                            var cityDateEl = $('<div>').addClass('forcastDay');
                            tempFEl = $('<div>').addClass('forcastDay');
                            cityHumidityEl = $('<div>').addClass('forcastDay');
                            weatherIcon = $('<img>').addClass('weatherIcon');
                            
                            cityDateEl.text(displayDate.format('DD/MM/YYYY'))
                            weatherIcon.attr('src', iconURL);
                            tempFEl.text('Temperature: ' + tempF.toFixed(2) + '\xB0F');
                            cityHumidityEl.text('Humidity: ' + cityHumidity + '\u0025');

                            forcastDiv.attr('dataIndex', i);
                            forcastDiv.css({'background-color': '#03fcf2', 'margin': '8px','text-align': 'left', 'padding-left': '5px'});
                            forcastRow.append(forcastDiv);
                            forcastDiv.append(cityDateEl);
                            forcastDiv.append(weatherIcon);
                            forcastDiv.append(tempFEl);
                            forcastDiv.append(cityHumidityEl);
                        }
                    });
                });
            }
        });
    }

    function ajaxSearch(b){
        // Here we are building the URL we need to query the database
        if (location.protocol === 'http:') {
            queryForcast = 'http://api.openweathermap.org/data/2.5/forecast?q=' +
            b + '&appid=' + APIKey;
        }
        else {
            queryForcast = 'https://api.openweathermap.org/data/2.5/forecast?q=' +
            b + '&appid=' + APIKey;
        }
        console.log(queryForcast);
        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            type:'GET',
            url: queryForcast,
            dataType:'JSON',
            success: function(response) {
                $('.resultContent').empty();
                // Log the queryURL
                console.log(queryForcast);
        
                // Log the resulting object
                console.log(response);
                var stringifyResponse = JSON.stringify(response);
                for(var i = 0; i < 1; i++) {
                    var cityName = JSON.stringify(response.city.name);
                    var cityLat = JSON.stringify(response.city.coord.lat);
                    var cityLon = JSON.stringify(response.city.coord.lon);
                    var cityDate = response.list[i].dt;
                    var displayDate = moment.unix(cityDate).utc();
                    var cityWeatherIcon = response.list[i].weather[i-i].icon;
                    var iconURL = 'http://openweathermap.org/img/w/' + cityWeatherIcon + '.png';
                    var cityTemp = JSON.stringify(response.list[i].main.temp);
                    var tempF = (cityTemp - 273.15) * 1.80 + 32;
                    var cityHumidity = JSON.stringify(response.list[i].main.humidity);
                    var cityWindSpeed = JSON.stringify(response.list[i].wind.speed);

                    console.log(cityDate);
                    console.log(displayDate.toString());
                    console.log('Temperature: ' + tempF.toFixed(2) + '\xB0F');

                    // Here we run our AJAX call to the OpenWeatherMap UltraViolet API
                    if (location.protocol === 'http:') {
                        uvindexURL = 'http://api.openweathermap.org/data/2.5/uvi?appid=' +
                        APIKey + '&lat=' + cityLat + '&lon=' + cityLon;
                    }
                    else {
                        uvindexURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' +
                        APIKey + '&lat=' + cityLat + '&lon=' + cityLon;
                    }
                    $.ajax({
                    url: uvindexURL,
                    method: "GET"
                    })
                    // We store all of the retrieved data inside of an object called "response"
                    .then(function(uvResponse) {
                        $('.resultContent').empty();
                        // Log the queryURL
                        console.log(uvResponse);
                        var cityUVIndex = JSON.stringify(uvResponse.value);
                        console.log(cityUVIndex);

                        // Log the resulting object
                        console.log(response);
                        // var stringifyResponse = JSON.stringify(response);
                        displayDiv = $('<div>').addClass('displayDiv col-md-12');
                        title02El = $('<div>').addClass('currentDay col-md-12');
                        cityNameEl = $('<div>').addClass('currentDay col-md-9');
                        tempFEl = $('<div>').addClass('currentDay col-md-12');
                        cityHumidityEl = $('<div>').addClass('currentDay col-md-12');
                        cityWindSpeedEl = $('<div>').addClass('currentDay col-md-12');
                        row01El = $('<div>').addClass('row');
                        cityUVIndexTitleEl = $('<div>').addClass('currentDay');
                        cityUVIndexValueEl = $('<div>').addClass('currentDay');
                        weatherIconEl = $('<div>').addClass('currentDay col-md-4')
                        weatherIcon = $('<img>').addClass('weatherIcon'); 

                        weatherIcon.css('text-align', 'left');
                        weatherIcon.attr('src', iconURL)
                        displayDiv.attr('dataIndex', i);
                        displayDiv.css({'border': 'solid', 'border-width': '1px', 'border-color': '#777777', 'padding-bottom': '20px'});
                        cityUVIndexTitleEl.css({'margin-bottom': '10px', 'margin-left': '30px', 'margin-right': '10px'});
                        cityUVIndexValueEl.css({'background-color': '#ff0000', 'color': '#ffffff', 'margin-bottom': '10px', 'padding-left': '5px', 'padding-right': '5px', 'border-radius': '5px'});
                        $('.resultContent').append(displayDiv);

                        title02El.html('<h3>5-Day Forcast:</h3>');
                        cityNameEl.html('<h3>' + cityName + ' ' + displayDate.format('DD/MM/YYYY') + '</h3>');
                        tempFEl.text('Temperature: ' + tempF.toFixed(2) + '\xB0F');
                        cityHumidityEl.text('Humidity: ' + cityHumidity + '\u0025');
                        cityWindSpeedEl.text('Wind Speed: ' + cityWindSpeed + ' MPH');
                        cityUVIndexTitleEl.text('UV Index:');
                        cityUVIndexValueEl.text(cityUVIndex);

                        displayDiv.append(cityNameEl);
                        displayDiv.append(weatherIconEl);
                        weatherIconEl.append(weatherIcon);
                        displayDiv.append(tempFEl);
                        displayDiv.append(cityHumidityEl);
                        displayDiv.append(cityWindSpeedEl);
                        displayDiv.append(row01El);
                        row01El.append(cityUVIndexTitleEl);
                        row01El.append(cityUVIndexValueEl);
                        displayDiv.append(title02El);

                        var forcastRow = $('<div>').addClass('row');
                        forcastRow.css('font-size', '12px')
                        displayDiv.append(forcastRow);

                        for(i = 0; i < 5; i++) {
                            cityDate = response.list[i * 8].dt;
                            displayDate = moment.unix(cityDate).utc();
                            cityWeatherIcon = response.list[i * 8].weather[(i * 8)-(i * 8)].icon;
                            iconURL = 'http://openweathermap.org/img/w/' + cityWeatherIcon + '.png';
                            cityTemp = JSON.stringify(response.list[i * 8].main.temp);
                            tempF = (cityTemp - 273.15) * 1.80 + 32;
                            cityHumidity = JSON.stringify(response.list[i * 8].main.humidity);
                            cityWindSpeed = JSON.stringify(response.list[i * 8].wind.speed);

                            var forcastDiv = $('<div>').addClass('col-md-2 forcastDiv');
                            var cityDateEl = $('<div>').addClass('forcastDay');
                            tempFEl = $('<div>').addClass('forcastDay');
                            cityHumidityEl = $('<div>').addClass('forcastDay');
                            weatherIcon = $('<img>').addClass('weatherIcon');
                            
                            cityDateEl.text(displayDate.format('DD/MM/YYYY'))
                            weatherIcon.attr('src', iconURL);
                            tempFEl.text('Temperature: ' + tempF.toFixed(2) + '\xB0F');
                            cityHumidityEl.text('Humidity: ' + cityHumidity + '\u0025');

                            forcastDiv.attr('dataIndex', i);
                            forcastDiv.css({'background-color': '#03fcf2', 'margin': '8px','text-align': 'left', 'padding-left': '5px'});
                            forcastRow.append(forcastDiv);
                            forcastDiv.append(cityDateEl);
                            forcastDiv.append(weatherIcon);
                            forcastDiv.append(tempFEl);
                            forcastDiv.append(cityHumidityEl);
                            saveToLocal(b);
                            displayCityArray();
                        }
                    });                  
                }
            },
            error: function(){
                alert("Error, 404 (not found)!")
            }
        });
        // $.ajax({
        // url: queryForcast,
        // method: "GET"
        // })
        // // We store all of the retrieved data inside of an object called "response"
        // .then(function(response) {
            
        // });
    }

    function getLocation() {
        // Make sure browser supports this feature
        if (navigator.geolocation) {
            // Provide our showPosition() function to getCurrentPosition
            navigator.geolocation.getCurrentPosition(showPosition);
        } 
        else {
          alert("Geolocation is not supported by this browser.");
        }
    }

    // This will get called after getCurrentPosition()
    function showPosition(position) {
        // Grab coordinates from the given object
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        console.log("Your coordinates are Latitude: " + lat + " Longitude " + lon);
        geoLocationWeather(lat,lon);
    }

    function search(key, inputArray) {
        for (i = 0; i < inputArray.length; i++) {
            if (inputArray[i].cityName === key) {
                return true;
            }
        }
    }

    function saveToLocal(a) {
        userInputUppercase = a.toUpperCase();
        console.log('Current Initials are: ' + userInputUppercase);
        // Check if there is something in storage with user initials
        // check local storage
        var savedCityString = localStorage.getItem('savedCity');
        savedCityJSON = JSON.parse(savedCityString);
        console.log(savedCityString);
        console.log('savedCityString is ' + savedCityString);
        // check if string exists, then convert to JSON
        console.log('initial JSON.parse(savedCityString) ' + JSON.parse(savedCityString));
        if (savedCityJSON == null) {
            console.log("City: " + userInputUppercase);
            
            var savedCityJSON = [];
            var cities = {
                'cityName': userInputUppercase
            }

            savedCityJSON.push(cities);
            localStorage.setItem('savedCity', JSON.stringify(savedCityJSON));
            console.log("After running highscoreJSON" + JSON.stringify(savedCityJSON));
        }
        else {
            var index = search(userInputUppercase, savedCityJSON);
            console.log(index);
            if(index) {
                // alert('City already saved!')
            }
            else {
                savedCityJSON = JSON.parse(savedCityString);
                cities = {
                    'cityName': userInputUppercase
                }
                savedCityJSON.push(cities);
                localStorage.setItem('savedCity', JSON.stringify(savedCityJSON));
                        
                console.log(savedCityJSON);
            }
            
        }
        // console.log("out of all loops " + savedCityString);
    }

    // for(var j = 0; j < savedCityJSON.length; j++) {
    //     if(userInputUppercase === savedCityJSON[j].cityName) {
    //         savedCityJSON.splice(j, 1);
    //         localStorage.setItem('savedCity', JSON.stringify(savedCityJSON));
    //         displayCityArray();
    //     }
    // }

    function displayCityArray() {
        $('.savedCityDisplay').empty();
        savedCityString = localStorage.getItem('savedCity');
        savedCityJSON = JSON.parse(savedCityString);
        console.log(savedCityJSON);
        if (savedCityJSON == null) {
            savedCityJSON = [];
            for (var k = 0; k < savedCityJSON.length; k++) {
                var cityBtnEl = $('<div>').addClass('savedCityBtn btn');
                cityBtnEl.attr('data-value', savedCityJSON[k].cityName)
                cityBtnEl.text(savedCityJSON[k].cityName);
                $('.searchContent').append(cityBtnEl);
            }
        }
        else {
            for (var k = 0; k < savedCityJSON.length; k++) {
                var cityBtnEl = $('<div>').addClass('savedCityBtn btn');
                cityBtnEl.attr('data-value', savedCityJSON[k].cityName);
                cityBtnEl.text(savedCityJSON[k].cityName);
                $('.savedCityDisplay').append(cityBtnEl);
            }
        }
    }

    function clearList(event) {
        // This 'preventDefault' method tells the user agent that if the event does not get explicitly
        // handled, its default action should not be taken as it normally would be.
        event.preventDefault(event);
        // The stopPropagation() method stops the bubbling of an event to parent elements, preventing
        // any parent handlers from being notified of the event. You can use the method event.isPropagationStopped()
        // to know whether this method was ever called (on that event object).
        event.stopPropagation(event);
        var userClearSelect = event.target;
        var clearSelect = userClearSelect.matches("button");
        if (clearSelect) {
            console.log("clear button clicked");
            // $('.inputTextArea').val('');
            $('.savedCityDisplay').empty();
            localStorage.clear();
        }
    }

    // Current Date and Time
    var m = moment();
    console.log(m);
    currentHour = m.hour();//this is in format

    // Create from ISO 8601 String
    m = moment("2019-05-19T23:10:00.000+05:00");

    // Using a format
    m = moment("14/06/2019 4:50PM", "DD/MM/YYYY h:mmA");

    // Create using milliseconds since epoch (1st Jan 1970)
    m = moment(600000);

    // Create using seconds since epoch (1st Jan 1970)
    m = moment.unix(7200);

    // Create a moment object in UTC mode
    m = moment.utc("2019-05-19T23:10:00.000+05:00");

    m = moment();

    var timeIdArray = [m.format('09:00'),m.format('10:00'), m.format('11:00'), m.format('12:00'), m.format('13:00'), m.format('14:00'), m.format('15:00'), m.format('16:00'), m.format('17:00')];

    console.log(`toString() => ${m.toString()}`);
    console.log(`toISOString() => ${m.toISOString()}`);

    // $('#minutes').text(1.3);

    function update() {
        $('#minutes').html(moment().format('HH:mm:ss'));
    }

    setInterval(update, 1000);

    currentDayEl.textContent = m.format("dddd DD MMMM YYYY");

    function displayTimeEl() {
        var timeIdEl = document.querySelectorAll(".timeId");
        var timeText = timeIdEl[0].textContent;
        console.log(timeText);
    }

    function getFormattedMinutes() {
        var secondsLeft = totalSeconds - secondsElapsed;

        var minutesLeft = Math.floor(secondsLeft / 60);

        var formattedMinutes;

        if (minutesLeft < 10) {
            formattedMinutes = "0" + minutesLeft;
        } else {
            formattedMinutes = minutesLeft;
        }

        return formattedMinutes;
    }

    function getFormattedSeconds() {
        var secondsLeft = (totalSeconds - secondsElapsed) % 60;

        var formattedSeconds;

        if (secondsLeft < 10) {
            formattedSeconds = "0" + secondsLeft;
        } else {
            formattedSeconds = secondsLeft;
        }

        return formattedSeconds;
    }

    function setTime() {
        var minutes = minutesDisplayEl.value = 30;

        clearInterval(interval);
        totalSeconds = minutes * 60;
    }

    function renderTime() {
        minutesDisplayEl.textContent = getFormattedMinutes();
        secondsDisplayEl.textContent = getFormattedSeconds();

        if (secondsElapsed >= totalSeconds) {
            stopTimer();
        }
    }

    function startTimer() {
        setTime();

        interval = setInterval(function () {
            secondsElapsed++;
            renderTime();
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(interval);
        renderTime();
    }

    function stopTimer() {
        secondsElapsed = 0;
        setTime();
        renderTime();
    }
});