// get the country name from the value inputted on the form's text input
// use that text input value to search the countries api and get all data about that country

// create function to get the user inputted country's data from the rest countries api
  // append user inputted country name to html tag
  // get .capital
  // get .population
  // get .currencies[0]
    // .name, .code, .symbol
  // get languages[0]
    // .name
  // get timezones[0]
  // append all data into corresponding html tag

// create function to get the country's capital weather information
  // get current temperature
  // get high and low temperature
  // get weather description
  // get humidity
  // append all data to corresponding html tag

// create event listener on form to listen to submit and trigger:
  // 1. getting all data
  // 2. hide search page and display load page
  // 3. fade out load page and display main page

////// TO DO //////
// create event listener on a button to:
  // 1. fade in search page again
  // 2. empty html tags


const countries = {};

countries.url = 'https://restcountries.eu/rest/v2/name';
countries.weatherUrl = 'http://api.openweathermap.org/data/2.5/weather';
countries.weatherApiKey = 'c9a747c48bbadd82284c2f57f9cf4656';
countries.$searchForm = $('form');
countries.$userInput = $('input[type=text]');
countries.$searchPage = $('.search');
countries.$country = $('.country');
countries.$capital = $('.capital');
countries.$population = $('.population');
countries.$currency = $('.currency');
countries.$language = $('.language');
countries.$timezone = $('.timezone');
countries.$temperature = $('.main-temperature');
countries.$loHiTemp = $('.temperature-range');
countries.$weatherState = $('.state');
countries.$humidity = $('.humidity');
countries.$dataContainer = $('.country-info');
countries.$weatherContainer = $('.weather');
countries.$loadPage = $('.load-page');
countries.$backToSearch = $('#back-to-search');



countries.getCountriesData = (countryName) => {    
 const response =  $.ajax({  
    url: `${countries.url}/${countryName}`,
    method: 'GET',
    dataType: 'json'
  });
  return response;
};

countries.formatPopulation = (number) => {
  return number.toLocaleString();
};

countries.displayLanguages = (array) => {
  const languageName = array.map((value) => {
    return value.name;
  });    
  const formattedLanguage = languageName.join(', ');
  countries.$language.append(`<p>${formattedLanguage}</p>`);   
};

countries.displayTimezones = (array) => {  
  const validTimezones = array.filter(timezone => timezone.includes(':') == true);
  const allTimezones = validTimezones.join(' / ');
  countries.$timezone.append(`<p>${allTimezones}</p>`);  
};

countries.setWeatherData = (city) => {
    $.ajax({
    url: countries.weatherUrl,
    method: 'GET',
    dataType: 'json',
    data: {
      appid: countries.weatherApiKey,
      q: city,
      units: 'metric'
    }
  }).then((data) => {
    const tempRounded = Math.round(data.main.temp);
    countries.$temperature.append(`<h3>Current weather in ${city}</h3>
    <p>${tempRounded}&deg;C</p>`);
    const highTemp = Math.round(data.main.temp_max);
    const lowTemp = Math.round(data.main.temp_min);
    countries.$loHiTemp.append(`<p>High ${highTemp}&deg;C / Low ${lowTemp}&deg;C</p>`);
    const weatherState = data.weather[0].description;
    countries.$weatherState.append(`<p>${weatherState}</p>`);
    const humidity = data.main.humidity;
    countries.$humidity.append(`<p>${humidity}&percnt; Humidity</p>`);    
  }).catch(() => {
    countries.$weatherContainer.html('<p>Weather data unavailable at the moment</p>');
  });
};

countries.setCountriesData = () => {
  const searchedCountry = countries.$userInput.val();
  const countriesData = countries.getCountriesData(searchedCountry);
  countriesData.done((results) => {    
    const mainData = results[0];
    const country = mainData.name;
    const capital = mainData.capital;
    const currencyName = mainData.currencies[0].name;
    const currencyCode = mainData.currencies[0].code;
    const currencySymbol = mainData.currencies[0].symbol;
    const language = mainData.languages;
    countries.displayLanguages(language);
    const population = mainData.population;
    const formattedPopulation = countries.formatPopulation(population);    
    const timezone = mainData.timezones;
    countries.displayTimezones(timezone);
    countries.$country.append(`<h1>${country}</h1>`);
    countries.$capital.append(`<p>${capital}</p>`);
    countries.$population.append(`<p>${formattedPopulation}</p>`);
    countries.$currency.append(`<p>${currencyName} / ${currencyCode} / ${currencySymbol}</p>`);        
    countries.setWeatherData(capital);    
  }).fail(() => {
    countries.$dataContainer.html('<p>Data unavailable at the moment</p>');
  });
};

countries.hideLoadPage = () => {
  let counter = 3;
  const loadPage = setInterval(() => {
    counter--;
    if (counter === 0) {
      countries.$loadPage.fadeOut(700);
      clearInterval(loadPage);
    }
  }, 1000);
};

countries.emptyAllFields = () => {
  countries.$country.find('h1').remove();
  countries.$dataContainer.find('p').remove();
  countries.$weatherContainer.find('p, h3').remove();
};

countries.init = () => {
  countries.$searchForm.on('submit', (event) => {
    event.preventDefault();
    countries.setCountriesData();
    countries.$searchPage.fadeOut();
    countries.hideLoadPage();    
  });
  countries.$backToSearch.click(() => {
    document.querySelector('form').reset();    
    countries.$searchPage.css('display', 'flex');
    countries.$loadPage.css('display', 'flex');
    countries.emptyAllFields();
  });
};

$(() => {
  countries.init();
});