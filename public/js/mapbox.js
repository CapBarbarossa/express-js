/* eslint-disable no-undef */
/* eslint-disable prefer-destructuring */

// console.log('Hello from the client side');

// console.log(locations);

export const displayMap = (locations) => {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiY2FwYmFyYmFyb3NzYSIsImEiOiJja3FtZ3VhbW4wbjVoMnBwMnptNDRibW9wIn0.pfnZ5-JJkuFVP27jK7Paww';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/capbarbarossa/ckqoldyua075r18mklde2rwzw',
        scrollZoom: false,
        // center: [-118.113491, 34.111745],
        // zoom: 8,
        // interactive: false,
    });

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
        // Add marker
        const el = document.createElement('div');
        el.className = 'marker';

        // Add Marker
        new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
        })
            .setLngLat(loc.coordinates)
            .addTo(map);

        // Add Popup
        new mapboxgl.Popup({
            offset: 30,
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);

        // Extend map bounds to include current location
        bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100,
        },
    });
};
