const socket = io.connect();
socket.on('accepted', data => {
    if (data.status === 'ok') {
        console.log('Connected!!');
    } else {
        console.log('Rejected!!');
    }
});

function sendGeocode(lat, lng) {
    socket.emit('geocode', { lat, lng });
    socket.on(`${lat},${lng}`, data => {
        if (data.statuses.length > 0) {
            changeMarkerIcon(lat, lng);
        }
        $('#main').html('');
        data.statuses.map(status =>  {
            console.log(status);
            const text = status.text;
            const name = status.user.name;
            const img_url = status.user.profile_image_url;
            const img = `<img src="${img_url}"/>`;
            $('#main').append("<div><h1>" + name + "</h1>" + img + "<p>" + text + "</p>" + "</div>")
        });
    });
}
