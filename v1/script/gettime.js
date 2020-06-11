const input = document.querySelector('input');
const searchBtn = document.querySelector('button');
const localTime = document.querySelector('#local-time');
const localPlace = document.querySelector('#local-place');

const getClock = async (timezone) => {
    let res;
    try {
        timezone ? 
            res = await axios.get('http://worldtimeapi.org/api/timezone/' + timezone) :
            res = await axios.get('http://worldtimeapi.org/api/ip');

        const unixtime = res.data.unixtime + res.data.raw_offset;
        startClock(unixtime);
        localPlace.textContent = res.data.timezone;
    }
    catch (err) {
        console.log(`...ooops! There must've been an error. Try reloading the page :). Error: `, err);
    }
}

const getTimezone = async (lat, lng) => {
    try {
        const res = await axios.get('http://api.geonames.org/timezoneJSON?', {
            params: {
                lat: lat,
                lng: lng,
                username: 'ricardofrancoli'
            }
        });
        getClock(res.data.timezoneId);
    }
    catch (err) {
        console.log('Oops! There\'s been an error!');
    }
}

const townSearch = async (search) => {
    try {
        const res = await axios.get('http://api.geonames.org/searchJSON?', {
            params: {
                q: search,
                orderby: 'relevance',
                cities: 'cities1000',
                maxRows: 100,
                username: 'ricardofrancoli'
            },
        });
    
        console.log(search)
        console.dir(res.data.geonames);
    
        let towns = res.data.geonames;
        let searchedTowns = [];
        for(let town of towns) {
            if (town.toponymName.toLowerCase().includes(search)) {
                searchedTowns.push([town.toponymName, town.countryCode, town.lat, town.lng]);
            }
            // pauseClock(interval);
            // getTimezone(town.lat, town.lng)
        }
        console.log(searchedTowns)
        // return searchedTowns;
    }
    catch (err) {
        console.log('Oops! There\'s been an error!');
    }
}

let interval;
const startClock = (unixtime) => {
    const timeCount = () => {
        let date = new Date(unixtime * 1000);
        let time = date.toLocaleTimeString();
        localTime.textContent = time;
        unixtime += 1;
    }
    interval = setInterval(timeCount, 1000)
    timeCount();
}

const pauseClock = () => {
    clearInterval(interval);
}

searchBtn.addEventListener('click' || 'enter', event => {
    event.preventDefault();
    pauseClock(interval);
    townSearch(input.value);
    input.value = '';
});

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


// getLocalUnixtime();
getClock();
// getTimezone();