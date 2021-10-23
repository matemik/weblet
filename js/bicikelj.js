const initMap = () => {
    // Initial info to define map
    initLat = 46.051367;
    initLng = 14.506542;
    initZoom = 13;

     // Create map
    const map = L.map('map').setView([initLat, initLng], initZoom)

    // Add tiles and icon
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    const tiles = L.tileLayer(tileUrl, { attr })
    tiles.addTo(map)
    return map
}

const getData = (L) => {
    // Create map
    const map = initMap(L);
    
    // Create bike icon
    const bikeIcon = L.icon({
        iconUrl: "https://img.icons8.com/ios-glyphs/30/000000/bicycle.png",
        iconSize: [30, 30]
    });

    let xhr = new XMLHttpRequest();

    xhr.open('GET', 'https://opendata.si/promet/bicikelj/list/', true);
    xhr.onload = () => {
        if (xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
            markers = data['markers']
            Object.keys(markers).forEach((key, i) => {
                L.marker(
                    [markers[key].lat, markers[key].lng], 
                    {icon: bikeIcon}).addTo(map)
            });
        } else {
            console.log("Could not fetch the data")
        }
    }
    xhr.send();
};