const socket = io();
let user;

Swal.fire({
  title: "Hola",
  text: "Ingresa tu nombre para continuar",
  input: "text",
  inputValidator: (value) => {
    return !value && "¡Ingresa tu nombre!";
  },
  allowOutsideClick: false,
}).then((value) => {
  user = value.value;
  socket.emit("newUser", user);
});

socket.on("userConnected", (username) => {
  Swal.fire({
    position:"top-right",
    toast:true,
    title: "Nuevo usuario",
    text: `${username} se ha conectado al chat`,
  });
});

chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    socket.emit("message", {
      user,
      message: e.target.value,
    });
    chatbox.value = "";
  }
});

socket.on("messages", (data) => {
  const log = document.querySelector("#messages");
  let messages = "";

  data.forEach((message) => {
    messages += `<strong>${message.user}</strong>: ${message.message} <br/>`;
  });
  log.innerHTML = messages;
});
