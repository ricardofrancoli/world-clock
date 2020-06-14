const input = document.querySelector('input');
const searchBtn = document.querySelector('button');
const dropdown = document.querySelector('.dropdown');
const autocomplete = document.querySelector('.autocomplete');
const localTime = document.querySelector('.local-time');
const userSearch = document.querySelector('.user-search');
const searchFacts = document.querySelector('.search-facts');
const searchFactsList = document.querySelector('.search-facts-list');

const townSearch = async (search) => {
    try {
        const res = await axios.get('http://api.geonames.org/searchJSON?', {
            params: {
                q: search,
                orderby: 'relevance',
                cities: 'cities500',
                maxRows: 300,
                username: 'ricardofrancoli'
            },
        });
    
        console.log(search)
        console.log(res)
    
        let towns = res.data.geonames;
        let townMatches = towns.filter(town => {
            const regex = new RegExp(`^${search}`, 'gi');
            return town.toponymName.match(regex);
        });

        console.log(townMatches);
        // original for loop searchedTowns was down here

        if(!search.length) {
            dropdown.classList.remove('is-active');
            // !townMatches;
            return;
        }

        autocomplete.innerHTML = '';

        dropdown.classList.add('is-active');
        outputHtml(townMatches);

        const options = document.querySelectorAll('a');
        for(let option of options) {
            option.addEventListener('click', () => {
                optionOnClick();
                getTimezone(option.dataset.lat, option.dataset.lng);
                console.dir(option)
                timezoneText.innerHTML = `
                    <p class="user-search">Here's the time in <b>${option.dataset.town}</b> <i>(${option.dataset.region})</i> ${flag(option.dataset.country)}</p>
                    `;
                searchFacts.innerHTML = `
                    <p class="facts-title">Some facts about ${option.dataset.town}:</p>
                `;
            });
        }
    }
    catch (err) {
        console.log('Oops! There\'s been an error! ' + err);
    }
}

const getFacts = async (lat, lng) => {
    try {
        const res = await axios.get('https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=today',{
            params: {
                lat: lat,
                lng: lng,
                date: 'today',
                formatted: 0
            },
        })
        console.log(res)
        const facts = res.data.results;
        let sunrise = res.data.results.sunrise;
        // console.log(sunrise);
        sunrise = new Date(sunrise)
        // console.log(sunrise);
    }
    catch (err) {
        console.log('Oops! There\'s been an error! ' + err);
    }
}

// searchBtn.addEventListener('click' || 'enter', event => {
//     event.preventDefault();
//     pauseClock(interval);
//     townSearch(input.value);
//     input.value = '';
// });

let timeoutId;
const onInput = event => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
        townSearch(event.target.value);
    }, 300)
}

input.addEventListener('input', onInput);

const outputHtml = (townMatches) => {
    if(townMatches.length > 0) {
        const html = townMatches.map(match => `
            <div class="dropdown-content">
                <a 
                    class="dropdown-item"
                    data-town="${match.toponymName}"
                    data-region="${match.adminName1}"
                    data-country="${match.countryName}"
                    data-lat="${match.lat}"
                    data-lng="${match.lng}"
                >

                ${match.toponymName} (${match.adminName1}), ${match.countryName}
                
                </a>
            </div>
        `)
        .join('');

        autocomplete.innerHTML = html;
    }
}

const optionOnClick = () => {
    dropdown.classList.remove('is-active');
    searchFacts.classList.remove('is-hidden');
    searchFactsList.classList.remove('is-hidden');
    timezoneLocal.classList.add('is-hidden');
    clockText.classList.add('is-hidden');
    input.value = '';
    pauseClock(interval);
}

// const selectOption = (town) => {
//     for(let option of options) {
//         const options = document.querySelectorAll('a');
//         option.addEventListener('click', () => {
//             // dropdown.classList.remove('is-active');
//             // input.value = town;
//             console.log('hi')
//         });
//     }
// };

        // let searchedTowns = [];
        // for(let town of towns) {
        //     if (town.toponymName.toLowerCase().includes(search)) {
        //         searchedTowns.push({
        //             town: town.toponymName,
        //             country: town.countryCode,
        //             lat: town.lat,
        //             lng: town.lng
        //         });
        //     }
            // pauseClock(interval);
            // getTimezone(town.lat, town.lng)
        // }