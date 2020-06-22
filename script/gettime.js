const time = document.querySelector('.time');
const timezoneLocal = document.querySelector('.timezone-local');
const timezoneText = document.querySelector('.timezone-text');
const clockText = document.querySelector('.clock-text');

const getClock = async (timezone) => {
    try {
        let res;
        if(!timezone) {
            res = await axios.get('http://worldtimeapi.org/api/ip');
        } else {
            res = await axios.get('http://worldtimeapi.org/api/timezone/' + timezone);
        }

        let rawOffset;
        if(res.data.dst == true) {
            rawOffset = res.data.raw_offset * 1000;
        } else if (res.data.dst == false) {
            rawOffset = (res.data.raw_offset - 3600) * 1000;
        }

        let unixtime = res.data.unixtime * 1000;

        console.log(res)

        startClock(unixtime, rawOffset);
        timezoneLocal.textContent = `${res.data.timezone} ${getLocationEmoji(res.data.timezone)}`;
    }
    catch (err) {
        console.log(`...ooops! There must've been an error. Error: ${err}`);
    }
}

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

let interval;
const startClock = (unixtime, rawOffset) => {
    const timeCount = () => {
        let currentTime = new Date(unixtime + rawOffset).toLocaleTimeString();
        time.textContent = currentTime;
        unixtime += 1000;
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
    console.log(sunset)
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