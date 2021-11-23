import days from './days.js';


class Weather {
    constructor(city) {
        this.city = city;
        this.apiKey = '6ba7ddab25b8409c97d164306211811';
        this.apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${this.city}&days=5&aqi=no`;
        this.forecast = document.getElementById('forecast');
        this.weatherInterval = null;
        this.weatherInfo = null;
        this.currentIndex = 0;
    }

    setCity(city) {
        clearInterval(this.weatherInterval);
        const currentUrl = `http://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=5&aqi=no`
        this.forecast.innerHTML = '';
        fetch(currentUrl)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                const cityName = document.getElementById('city');
                cityName.innerHTML = `${response.location.name}, ${response.location.region}`;
                this.weatherInfo = response;
                
                this.setWeather(this.weatherInfo, this.currentIndex);
                this.startInterval();
                
                cityName.removeAttribute('style');
                cityName.style.visibility = 'visible';
                localStorage.city = `${response.location.name}, ${response.location.region}`;
                localStorage.lat = response.location.lat;
                localStorage.lon = response.location.lon;
            })
    }

    startInterval = () => {
        this.weatherInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.weatherInfo.forecast.forecastday.length;
            this.setWeather(this.weatherInfo, this.currentIndex);
        }, 5000)
    }
    

    setWeather(response, index) {
        this.forecast.innerHTML = '';
        const day = response.forecast.forecastday[index];
        const current = document.createElement('div');
        const expand = document.createElement('p');
        const currentImage = document.createElement('img');
        const currentDate = document.createElement('p');
        const currentTemp = document.createElement('p');
        const currentWind = document.createElement('p');

        const expandListener = (event) => {
            this.expandWeather();
        }

        expand.removeEventListener('click', expandListener);
        expand.setAttribute('id', 'expand');
        expand.innerHTML = 'See 5-day forecast';
        expand.addEventListener('click', expandListener);
        currentImage.setAttribute('src', day.day.condition.icon);
        currentDate.innerHTML = index === 0 ? 'Today' : days[new Date(day.date).getUTCDay()];
        currentTemp.innerHTML = `${Math.floor(day.day.maxtemp_f)}&deg; F`;
        currentWind.innerHTML = `Wind: ${Math.floor(day.day.maxwind_mph)} mph`;
        current.appendChild(expand);
        current.appendChild(currentImage);
        current.appendChild(currentDate);
        current.appendChild(currentTemp);
        current.appendChild(currentWind);
        this.forecast.appendChild(current);
    }

    expandWeather() {
        clearInterval(this.weatherInterval);
        this.forecast.innerHTML = '';
        const back = document.createElement('p');
        const backListener = (event) => {
            this.currentIndex = 0;
            this.setWeather(this.weatherInfo, this.currentIndex);
            this.startInterval();
        }

        back.innerHTML = 'Back to 1-day';
        back.addEventListener('click', backListener)
        this.forecast.appendChild(back);
        this.weatherInfo.forecast.forecastday.forEach((day, i) => {
            const current = document.createElement('div');
            const currentImage = document.createElement('img');
            const currentDate = document.createElement('p');
            const currentTemp = document.createElement('p');
            const currentWind = document.createElement('p');

            currentImage.setAttribute('src', day.day.condition.icon);
            currentDate.innerHTML = i === 0 ? 'Today' : days[new Date(day.date).getUTCDay()];
            currentTemp.innerHTML = `${Math.floor(day.day.maxtemp_f)}&deg; F`;
            currentWind.innerHTML = `Wind: ${Math.floor(day.day.maxwind_mph)} mph`;
            current.appendChild(currentImage);
            current.appendChild(currentDate);
            current.appendChild(currentTemp);
            current.appendChild(currentWind);
            this.forecast.appendChild(current);
        })
    }
    
    render() {
        this.forecast.innerHTML = '';
        fetch(this.apiUrl)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                const cityName = document.getElementById('city');
                cityName.innerHTML = `${response.location.name}, ${response.location.region}`;
                this.weatherInfo = response;
                
                this.setWeather(this.weatherInfo, this.currentIndex);
                this.startInterval();
                return  [response.location.lat, response.location.lon];  
            })
    }
}

export default Weather;