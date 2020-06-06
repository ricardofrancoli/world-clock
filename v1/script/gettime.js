async function getUnixTime() {
    const res = await axios.get('http://worldtimeapi.org/api/ip/');
    let unixtime = res.data.unixtime;
    try {
        function timeCount() {
            const date = new Date(unixtime * 1000);
            const h = date.getHours();
            const m = '0' + date.getMinutes();
            const s = '0' + date.getSeconds();
            const localTime = document.querySelector('#local-time');
            localTime.textContent = `${h}:${m.substr(-2)}:${s.substr(-2)}`;
            unixtime += 1;
        };
        timeCount();
        setInterval(timeCount, 1000);
    } catch(err) {
        localTime.textContent = `...ooops! There must've been an error. Try reloading the page :). Error: `, err;
    }
};

async function getTimeZone() {
    const res = await axios.get('http://worldtimeapi.org/api/ip/');
    const localPlace = document.querySelector('#local-place');
    return localPlace.textContent = res.data.timezone;
}

async function townSearch(search) {
    const res = await axios.get('http://api.geonames.org/searchJSON?', {
        params: {
            q: search,
            orderby: 'relevance',
            cities: 'cities1000',
            maxRows: 500,
            username: 'ricardofrancoli'
        },
    });

    console.log(search)
    console.dir(res.data.geonames);

    let towns = res.data.geonames;
    let searchedTowns = [];
    for(let town of towns) {
        if (town.toponymName.toLowerCase().includes(search)) {
            searchedTowns.push(`${town.toponymName}, ${town.countryCode}`);
        }
    }
    console.log(searchedTowns);
    const filteredTowns = searchedTowns.filter( (town, index) => {
        return searchedTowns.indexOf(town) === index;
    });
    console.log(filteredTowns)
}

const input = document.querySelector('input');
const searchBtn = document.querySelector('button');

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

searchBtn.addEventListener('click', event => {
    event.preventDefault();
    townSearch(input.value);
});


getUnixTime();
getTimeZone();