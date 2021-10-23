function initMap() {
    let options = {
        zoom: 14,
        center: {
            lat: 46.051093,
            lng: 14.507186
        }
    }

    let map = new google.maps.Map(document.getElementById('map'), options) 
}