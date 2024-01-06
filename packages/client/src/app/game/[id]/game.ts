import io from "socket.io-client"

export function start() {

  const websocketUrl = 'http://localhost:8000'


  const socket = io(websocketUrl, {
    transports: ["websocket"],
    upgrade: false,
  });

  



  



  // const websocketUrl = `${USE_LOCAL_WS ? "ws://" : "wss://"}${
  //   connectionInfo.exposedPort?.host
  // }:${
  //   connectionInfo.exposedPort?.port
  // }?roomId=${roomId}&nickname=${getNickname()}&santa=${getSantaColor()}`;
}