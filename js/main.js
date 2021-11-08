const mapSettings = (L, lat, lng, zoom) => {
  // Create map
  const map = L.map("map").setView([lat, lng], zoom);

  // Add tiles and icon
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attr =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tiles = L.tileLayer(tileUrl, { attr });
  tiles.addTo(map);
  return map;
};
