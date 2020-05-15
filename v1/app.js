async function getTime() {
    const res = await axios.get('http://worldtimeapi.org/api/ip/');

    let localPlace = document.querySelector('#local-place');
    let localTime = document.querySelector('#local-time');

    function timeCount() {
        const date = new Date(res.data.unixtime * 1000);
        let h = date.getHours();
        let m = '0' + date.getMinutes();
        let s = '0' + date.getSeconds();
        let formattedTime = `${h}:${m.substr(-2)}:${s.substr(-2)}`;
        return formattedTime;
    };

    return localPlace.textContent = res.data.timezone, localTime.textContent = timeCount();
}

setInterval(getTime, 50);