const socket = io();
// const admin = io("/admin");

socket.on("connect", () => {
  console.log("connected on /");
});

// admin.on("connect", () => {
//   console.log("connected on admin");
//   admin.emit("message", hello);
// });
