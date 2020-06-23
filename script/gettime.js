const time = document.querySelector('.time');
const timezoneLocal = document.querySelector('.timezone-local');
const timezoneText = document.querySelector('.timezone-text');
const clockText = document.querySelector('.clock-text');

// Gets the current time (ip) or user's input time. Raw offset compared to UTC needs to be considered depending if the place is in DST or not
const getClock = async (timezone) => {
    try {
        let res;
        if(!timezone) {
            res = await axios.get('http://worldtimeapi.org/api/ip');
            localOffset = res.data.raw_offset + res.data.dst_offset;
        } else {
            res = await axios.get('http://worldtimeapi.org/api/timezone/' + timezone);
        }

        let unixtime = res.data.unixtime;
        let searchOffset = res.data.raw_offset + res.data.dst_offset;

        startClock(unixtime, searchOffset);
        timezoneLocal.textContent = `${res.data.timezone} ${getLocationEmoji(res.data.timezone)}`;
    }
    catch (err) {
        console.log(`...ooops! There must've been an error. Error: ${err}`);
    }
}

// Gets timezone name and the population of a given town to add to the facts below
const getTimezone = async (lat, lng, population) => {
    try {
        const res = await axios.get('http://secure.geonames.org/timezoneJSON?', {
            params: {
                lat: lat,
                lng: lng,
                username: 'ricardofrancoli'
            }
        });
        console.log(res);
        getClock(res.data.timezoneId);
        getFactsList(res.data.timezoneId, res.data.sunrise, res.data.sunset, res.data.lat, res.data.lng, population)
    }
    catch (err) {
        console.log('Oops! There\'s been an error!' + err);
    }
}

// Function that shows the time getting Unix epoch time + the offset, adds a second every second
// let localOffset;
// let interval;
// const startClock = (unixtime, searchOffset) => {
//     console.log(unixtime)
//     console.log(localOffset);
//     const timeCount = () => {
//         let currentTime;
//         // if(!unixtime) {
//         //     currentTime = Date.now();
//         //     time.textContent = new Date(currentTime).toLocaleTimeString();
//         // } else {
//         //     console.log('Time dif: ' + (searchOffset - localOffset));
//             currentTime = new Date((unixtime + (searchOffset - localOffset)) * 1000).toLocaleTimeString();
//             time.textContent = currentTime;
//             unixtime += 1;
//         // }
//     }
//     interval = setInterval(timeCount, 1000)
//     timeCount();
// }

let localOffset;
let interval;
const startClock = (unixtime, searchOffset) => {
    console.log(unixtime)
    console.log(localOffset);
    const timeCount = () => {
        let currentTime;
            currentTime = new Date((unixtime + (searchOffset - localOffset)) * 1000).toLocaleTimeString();
            time.textContent = currentTime;
            unixtime += 1;
    }
    interval = setInterval(timeCount, 1000)
    timeCount();
}

const pauseClock = () => {
    clearInterval(interval);
}

const getLocationEmoji = (timezone) => {
    if(timezone.includes('Canary')) { // This is here just cos I'm from the Canary Islands and we're really proud of our land!
        return '🇮🇨';
    } else if(timezone.includes('Africa') || timezone.includes('Atlantic') || timezone.includes('Europe')) {
        return '🌍';
    } else if(timezone.includes('America') || timezone.includes('Pacific')) {
        return '🌎';
    } else if(timezone.includes('Asia') || timezone.includes('Australia') || timezone.includes('Indian')) {
        return '🌏';
    } else {
        return '🏴‍☠️';
    }
}

const getFactsList = (timezoneId, sunrise, sunset, lat, lng, population) => {
    sunrise = parseDateToHHMM(sunrise);
    sunset = parseDateToHHMM(sunset);
    searchFactsList.innerHTML = `
        <li>It's in the <b>${timezoneId} ${getLocationEmoji(timezoneId)}</b> timezone</li>
        <li>Population: <b>${new Intl.NumberFormat().format(population)}</b></li>
        <li>Sunrise's at <b>${sunrise}h</b></li>
        <li>And sunset's at <b>${sunset}h</b></li>
        <li>Here are the coordinates – <i>Latitude:</i> <b>${lat}</b> | <i>Longitude:</i> <b>${lng}</b></li>
    `;
}

const parseDateToHHMM = (date) => {
    return date.slice(11,16);
}

getClock();