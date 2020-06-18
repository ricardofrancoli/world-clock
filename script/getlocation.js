const form = document.querySelector('form');
const input = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const autocomplete = document.querySelector('.autocomplete');
const localTime = document.querySelector('.local-time');
const userSearch = document.querySelector('.user-search');
const searchFacts = document.querySelector('.search-facts');
const searchFactsList = document.querySelector('.search-facts-list');

let townOptions;

const townSearch = async (search) => {
    try {
        const res = await axios.get('http://api.geonames.org/searchJSON?', {
            params: {
                q: search,
                orderby: 'relevance',
                cities: 'cities500',
                maxRows: 500,
                username: 'ricardofrancoli'
            },
        });
    
        console.log(search)
        console.log(res)
    
        let towns;
        if(!search.length) {
            dropdown.classList.add('is-hidden');
            towns = '';
            return;
        }

        towns = res.data.geonames;
        let townMatches = towns.filter(town => {
            const regex = new RegExp(`^${search}`, 'gi');
            return town.toponymName.match(regex) || town.countryName.match(regex);
        });

        autocomplete.innerHTML = '';

        dropdown.classList.remove('is-hidden');
        outputHtml(townMatches);

        // If user decides to click on option, do this
        townOptions = document.querySelectorAll('a');
        for(let option of townOptions) {
            option.addEventListener('click', () => {
                optionOnSearch();
                getTimezone(option.dataset.lat, option.dataset.lng, option.dataset.population);
                getInputText(option);
            });
        }
    }
    catch (err) {
        console.log('Oops! There\'s been an error! ' + err);
    }
}

// If user decides to press 'Enter', search for first option on the dropdown
form.addEventListener('keypress', event => {
    if(event.key == 'Enter') {
        event.preventDefault();
        onInputEnter(townOptions[0]);
    }
});

const onInputEnter = (option) => {
    optionOnSearch();
    getTimezone(option.dataset.lat, option.dataset.lng, option.dataset.population);
    getInputText(option);
};

// What happens uppon selecting a town
const optionOnSearch = () => {
    dropdown.classList.add('is-hidden');
    searchFacts.classList.remove('is-hidden');
    searchFactsList.classList.remove('is-hidden');
    timezoneLocal.classList.add('is-hidden');
    clockText.classList.add('is-hidden');
    input.value = '';
    pauseClock(interval);
}

// Prevents too many searches to the API
let timeoutId;
const onInput = event => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        townSearch(event.target.value);
    }, 200)
}

input.addEventListener('input', onInput);


// HTML output
const getInputText = (option) => {
    timezoneText.innerHTML = `
        <p class="user-search">Here's the time in <b>${option.dataset.town}</b> <i>(${option.dataset.region})</i> ${flag(option.dataset.country)}</p>
    `;
    searchFacts.innerHTML = `
        <p class="facts-title">Some facts about ${option.dataset.town}:</p>
    `;
}

const outputHtml = (townMatches) => {
    if(townMatches.length > 0) {
        const html = townMatches.map(match => `
            <div class="dropdown-content">
                <a 
                    class="dropdown-item"
                    href="#"
                    data-town="${match.toponymName}"
                    data-region="${match.adminName1}"
                    data-country="${match.countryName}"
                    data-lat="${match.lat}"
                    data-lng="${match.lng}"
                    data-population="${match.population}"
                >

                ${match.toponymName} <i>(${match.adminName1})</i>, <b>${match.countryName}</b>
                
                </a>
            </div>
        `)
        .slice(0, 8)
        .join('');

        autocomplete.innerHTML = html;
    }
}