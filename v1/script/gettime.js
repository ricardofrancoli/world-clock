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

// async function getTimeZone() {
//     const res = await axios.get('http://worldtimeapi.org/api/ip/');
//     const localPlace = document.querySelector('#local-place');
//     return localPlace.textContent = res.data.timezone;
// }

// const search = document.querySelector('form').addEventListener('click', event => {
//     console.log(search)
// })

async function townSearch(search) {
    const res = await axios.get('http://api.geonames.org/postalCodeLookupJSON?', {
        params: {
            placename: search,
            maxRows: 10,
            username: 'ricardofrancoli'
        },
    });

    console.dir(res.data.postalcodes)
    // console.dir(search)

    // return res.data.postalcodes

    // const towns = res.data.postalcodes;
    // for (let town of towns) {
    //     console.dir(town)
    //     console.log(`lng: ${town.lng}, lat: ${town.lat}`);
    // }

    // const input = document.querySelector('input');
    // const searchBtn = document.querySelector('button');

    // const submit = searchBtn.addEventListener('click', event => {
    //     event.preventDefault();
    //     console.log(event)
    //     console.log(input.value)
    //     input.value = search;
    // })
    // console.log(input.value);
    // console.log(submit);
}

const input = document.querySelector('input');

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


getUnixTime();
// getTimeZone();
// townSearch();