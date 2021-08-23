import '@pnotify/core/dist/BrightTheme.css';
import {defaultModules, error} from '@pnotify/core';
import debounce from 'lodash.debounce';
import PNotifyMobile from '@pnotify/mobile';
import country from "/templates/country.hbs"
import countries from "/templates/countries.hbs"

defaultModules.set(PNotifyMobile, {});


const mainLink = 'https://restcountries.eu/rest/v2/name/';
const fetchCountries = (countries) => {
  const listOfCountries = `${countries}`;
  return fetch(mainLink + listOfCountries).then(response => response.json());
}

const refs = {
  mainSearchForm: document.querySelector(".form-inline"),
  mainSearchInput: document.querySelector(".form-control"),
  countriesContent: document.querySelector(".articles")
}

refs.mainSearchInput.addEventListener("change", debounce(countrySearchInput, 500))

function countrySearchInput(event) {
  event.preventDefault();
  clearCountriesContent();
  const searchTypes = event.target.value;

  fetchCountries(searchTypes).then(data => {
    if (data.length > 10) {
      error({
        text: "Too many matches found. Please enter a more specific query!"
      });
    } else if (data.status === 404) {
      error({
        text: "No country has been found. Please enter a more specific query!"
      });
    } else if (data.length === 1) {
      findCountry(data, country);
    } else if (data.length <= 10) {
      findCountry(data, countries);
    }
  })
    .catch(error => {
      error({
        text: "You must enter query parameters!"
      });
    })
}

function findCountry(countries, template) {
  const markup = countries.map(count => template(count)).join();
  refs.countriesContent.insertAdjacentHTML('afterbegin', markup)
}

function clearCountriesContent() {
  refs.countriesContent.innerHTML = '';
}
