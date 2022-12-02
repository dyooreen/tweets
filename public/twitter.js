const socket = io.connect();
socket.on("accepted", (data) => {
  if (data.status === "ok") {
    console.log("Connected!!");
  } else {
    console.log("Rejected!!");
  }
});

function sendGeocode(lat, lng) {
  socket.emit("geocode", { lat, lng });
  socket.on(`${lat},${lng}`, (data) => {
    if (data.statuses.length > 0) {
      changeMarkerIcon(lat, lng);
    }
    $("#main").html("");
    data.statuses.map((status) => {
      console.log(status);
      const text = status.text;
      const screen_name = status.user.screen_name;
      const name = status.user.name;
      const img_url = status.user.profile_image_url;
      $("#main").append(`<div>
                <h1> ${name}</h1>
                <a href="https://twitter.com/${screen_name}" target="_blank">
                <img src="${img_url}"/>
                </a>
                <p>${text}</p>
            </div>`);
    });
  });
}
