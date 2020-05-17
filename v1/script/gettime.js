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

getUnixTime();
getTimeZone();