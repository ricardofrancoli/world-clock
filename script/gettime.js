const time = document.querySelector('.time');
const timezoneLocal = document.querySelector('.timezone-local');
const timezoneText = document.querySelector('.timezone-text');
const clockText = document.querySelector('.clock-text');

const getClock = async (timezone) => {
    console.log(timezone);
    let res;
    try {
        if(!timezone) {
            res = await axios.get('http://worldtimeapi.org/api/ip');
        } else {
            res = await axios.get('http://worldtimeapi.org/api/timezone/' + timezone);
        }

        let unixtime = res.data.unixtime - res.data.raw_offset;

        // if(!timezone) {
        //     res = await axios.get('http://worldtimeapi.org/api/ip');
        //     unixtime = res.data.unixtime;
        // } else {
        //     res = await axios.get('http://worldtimeapi.org/api/timezone/' + timezone);
        //     unixtime = res.data.unixtime + res.data.raw_offset;
        // }

        console.log(res)

        // !timezone ? 
        //     res = await axios.get('http://worldtimeapi.org/api/ip') :
        //     res = await axios.get('http://worldtimeapi.org/api/timezone/' + timezone);

        // console.log(res)

        // const unixtime = res.data.unixtime + res.data.raw_offset;
        startClock(unixtime);
        timezoneLocal.textContent = `${res.data.timezone} ${getLocationEmoji(res.data.timezone)}`;
    }
    catch (err) {
        console.log(`...ooops! There must've been an error. Try reloading the page :). Error: ${err}`);
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
const startClock = (unixtime) => {
    // console.log('1st unixtime: ' + unixtime);
    // unixtime = Date.parse(unixtime);
    // console.log('2nd unixtime: ' + unixtime);
    const timeCount = () => {
        let date = new Date(unixtime * 1000);
        let currentTime = date.toLocaleTimeString();
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
    return date = new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

getClock();