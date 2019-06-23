/* eslint-env jquery, node, mocha */
/*eslint no-console: 1 */

$().ready(function() {
  var lat;
  var lon;
  var isCelsius = true;

  $.getJSON("http://ip-api.com/json/?callback=?", function(loc) {
    lat = loc.lat; //find the latitude and longitude via IP-address
    lon = loc.lon;

    request();
  });

  function request() {
    var url =
      "http://api.openweathermap.org/data/2.5/weather?&lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=030d7de8a214a9bde023ab75b4453c13&units=metric";
    $.getJSON(url, ajaxRequest, failure).catch(function(error) {
      console.error(error);
    });
  }

  function ajaxRequest(json) {
    $("#mainWeather").html(json.weather[0].description + " ");
    $("#mainWeather").prepend(
      '<img src="http://openweathermap.org/img/w/' +
        json.weather[0].icon +
        '.png">'
    );
    var temperature = json.main.temp;
    $("#temp").html(temperature + " °C ");
    $("#temp").on("click", { value: temperature }, przeliczanieTemp);
    $("#humidity").html(json.main.humidity + " %");
    $("#wind").html(json.wind.speed + " km/h");
    $("#clouds").html(json.clouds.all + ": %");
    setBackground(json.weather[0].icon);
    $(".mainWeather").show();
  }

  function przeliczanieTemp(event) {
    if (isCelsius) {
      // przelicz na F
      var temperature = event.data.value * 1.8 + 32;
      $("#temp").html(temperature + " °F ");
      $("#otherTemp").html("| °C");
      isCelsius = !isCelsius;
    } else {
      // przelicz na C
      $("#temp").html(event.data.value + " °C ");
      $("#otherTemp").html("| °F");
      isCelsius = !isCelsius;
    }
  }

  function failure() {
    $("#mainWeather").html(
      "<h2>Sorry, but there's a temporary server problem </h2>"
    );
  }

  function setBackground(value) {
    switch (value) {
      case "01d":
      case "01n": //clear sky':
        $("body").addClass("clearSky");
        break;
      case "02d":
      case "02n":
        $("body").addClass("fewClouds");
        break;
      case "03d": // scattered clouds':
      case "03n":
        $("body").addClass("scatteredClouds");
        break;
      case "04d": // 'broken clouds':
      case "04n":
        $("body").addClass("brokenClouds");
        break;
      case "09n": // case 'shower rain':
      case "09d":
        $("body").addClass("showerRain");
        break;
      case "10d": // case 'rain':
      case "10n":
        $("body").addClass("rain");
        break;
      // case 'thunderstorm':
      case "11d":
      case "11n":
        $("body").addClass("thunderstorm");
        break;
      case "13d":
      case "13n":
        $("body").addClass("snow");
        break;
      case "50d":
      case "50n":
        $("body").addClass("mist");
        break;
    }
  }
});
