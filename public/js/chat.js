const socket = io();

//elements
const $messageForm = document.querySelector("#msgForm");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormBtn = $messageForm.querySelector("button");
const $sendLocationBtn = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#msg-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

//options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const oneHour = 60 * 60 * 1000;

const timeStamp = (time) => {
  return new Date() - time < oneHour
    ? moment(time).fromNow()
    : moment(time).format("h:mm a");
};

socket.on("message", ({ txt, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    message: txt,
    createdAt: timeStamp(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", ({ url, createdAt }) => {
  const html = Mustache.render(locationTemplate, {
    url,
    createdAt: timeStamp(createdAt),
  });
  $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  $messageFormBtn.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (err) => {
    $messageFormBtn.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if (err) {
      return console.log(err);
    }
    console.log("This message was delivered");
  });
});

$sendLocationBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  $sendLocationBtn.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    const location = {
      lat: coords.latitude,
      lng: coords.longitude,
    };

    socket.emit("sendLocation", location, () => {
      $sendLocationBtn.removeAttribute("disabled");
      console.log("Location shared");
    });
  });
});

socket.emit("join", { username, room });
