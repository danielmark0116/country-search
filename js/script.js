// SEARCH COMPONENT load function
function searchComponent() {
  const searchComponent = document.querySelector('#search-component').innerHTML;
  Mustache.parse(searchComponent);

  const rendered = Mustache.render(searchComponent, { someVar: 'some value' });
  document.querySelector('#render-box').innerHTML = rendered;
}

// CONTRY COMPONENT load function
function countryComponent(countryName = 'test') {
  const countryComponent = document.querySelector('#country-component')
    .innerHTML;
  Mustache.parse(countryComponent);

  getCountry(countryName).then(function(data) {
    const { name, flag, timezones, population, capital, region } = data[0];

    const rendered = Mustache.render(countryComponent, {
      name: countryName,
      flag: flag,
      capital: capital,
      population: population,
      region: region,
      timezones: timezones,
      // linkPrefix - fix for GITHUB href value if repo not hosted as main account githubpages
      linkPrefix: /github.io/i.test(window.location.href)
        ? 'country-search/'
        : '',
      wiki: `https://en.wikipedia.org/wiki/${name}`
    });

    document.querySelector('#render-box').innerHTML = rendered;
  });
}

// GET COUNTRY

function getCountry(param) {
  return fetch(`https://restcountries.eu/rest/v2/name/${param}`)
    .then(res => res.json())
    .catch(function(err) {
      console.log(err);
    });
}

function searchResult(searchValue) {
  getCountry(searchValue)
    .then(data => {
      document.querySelector('#input').innerHTML = '';
      const countries = [];
      data.forEach(function(x) {
        countries.push(x.name);
      });
      let allC = document.createElement('ul');
      allC.setAttribute('class', 'list-group');
      countries.forEach(function(x) {
        let element = document.createElement('li');
        element.setAttribute('class', 'list-group-item');
        let link = document.createElement('a');
        link.setAttribute('href', `?country=${x}`);
        link.innerText = 'More info';
        let par = document.createElement('p');
        par.innerHTML = x;
        element.appendChild(par);
        element.appendChild(link);
        allC.appendChild(element);
      });
      document.querySelector('#output').innerHTML = '';
      document.querySelector('#output').appendChild(allC);
    })
    .catch(err => {
      console.log(err);
      document.querySelector('#output').innerHTML = 'No such country';
    });
  document.querySelector(
    '#output'
  ).innerHTML = `<div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>`;
}

document.addEventListener('DOMContentLoaded', function() {
  const url = window.location.href;
  const urlParam = new URL(url);
  if (urlParam.searchParams.has('country')) {
    countryComponent(urlParam.searchParams.get('country'));
  } else {
    searchComponent();
    document.querySelector('#input').addEventListener('input', function(e) {
      document.querySelector('#output').innerHTML = '';

      if (e.target.value === '') {
        document.querySelector('#output').innerHTML =
          'Type in the country name';
      } else {
        searchResult(e.target.value);
      }
    });
  }
});
