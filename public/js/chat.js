const socket = io();

socket.on("message", (msg) => {
  console.log(msg);
});

document.querySelector("#msgForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log("This message was delivered");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const location = {
      lat: coords.latitude,
      lng: coords.longitude,
    };

    socket.emit("sendLocation", location, () => {
      console.log("Location shared");
    });
  });
});
