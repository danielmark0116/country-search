document.addEventListener('DOMContentLoaded', function() {
  const url = window.location.href;
  console.log(url);
  const urlParam = new URL(url);
  console.log(urlParam.searchParams.get('a'));

  document.querySelector('#input').addEventListener('input', function(e) {
    console.log(e.target.value);
    document.querySelector('#output').innerHTML = '';

    if (e.target.value === '') {
      console.log('type in the country');
    } else {
      fetch(`https://restcountries.eu/rest/v1/name/${e.target.value}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          document.querySelector('#input').innerHTML = '';
          const countries = [];
          data.forEach(function(x) {
            countries.push(x.name);
          });
          console.log(countries);
          let allC = document.createElement('div');
          countries.forEach(x => {
            let element = document.createElement('div');
            element.innerText = x;
            allC.appendChild(element);
          });
          document.querySelector('#output').innerHTML = '';
          document.querySelector('#output').appendChild(allC);
        })
        .catch(err => {
          console.log(err);
          document.querySelector('#output').innerHTML = 'No such country';
        });
      document.querySelector('#output').innerHTML = 'Loading';
    }
  });
});
