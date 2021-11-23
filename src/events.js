class Events {
    constructor(lat, lon) {
        this.lat = lat;
        this.lon = lon;
        this.eventId = 'MjQ1MTgwODh8MTYzNzI2NTk4OS4wODk3ODg';
        this.clientSecret = '8fd98486b0b4659cd1af37d374d7830c1e0bd7f90f615cad937ff1210fa893a1';
        this.eventUrl = `https://api.seatgeek.com/2/events?client_id=${this.eventId}&client_secret=${this.clientSecret}&lat=${this.lat}&lon=${this.lon}&range=50mi`
        this.events = null;
        this.eventContainer = document.getElementById('events');
    }

    getEvents(url = this.eventUrl) {
        this.eventContainer.innerHTML = '';

        
        fetch(url)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);
            this.events = response.events;
            const filter = document.getElementById('filter');
            const dateFilter = document.getElementById('date-filter');
            
            const filterListener = (event) => {
                dateFilter.style.visibility === 'visible' 
                    ? dateFilter.style.visibility = 'hidden' 
                    : dateFilter.style.visibility = 'visible'; 
            }
            const dateFilterClick = (event) => {
                const filteredUrl = this.eventUrl + `&datetime_local.gte=${event.target.value}T00:00:00&datetime_local.lte=${event.target.value}T23:59:59`
                this.getEvents(filteredUrl);
                dateFilter.style.visibility = 'hidden';
            }
            const dateFilterKeyDown = (event) => {
                event.preventDefault();
                
                return false;
            }
            
            filter.removeEventListener('click', filterListener);
            dateFilter.removeEventListener('click', dateFilterClick);
            dateFilter.removeEventListener('keydown', dateFilterKeyDown);

                filter.addEventListener('click', filterListener)
                dateFilter.addEventListener('change', dateFilterClick)
                dateFilter.addEventListener('keydown', dateFilterKeyDown);
                if (this.events.length) {
                    this.events.forEach(event => {
                        const current = document.createElement('div');
                        current.setAttribute('class', 'event');
                        current.innerHTML = `<p>${new Date(event.datetime_local).getMonth() + 1}/${new Date(event.datetime_local).getDate()}</p>
                            <p>${event.short_title}</p><p>${event.type.toUpperCase().split('_').join(' ')}</p><p>${event.venue.name}</p>`;
                        this.eventContainer.appendChild(current);
                    })
                    
                } else {
                    const message = document.createElement('p');
                    message.innerHTML = 'Sorry, no events for the chosen date';
                    this.eventContainer.appendChild(message);
                }
            })
    }
    
    render() {
        this.getEvents(this.eventUrl);
    }
}

export default Events;