import { USE_LOCAL_WS } from "@/config";
import { getConnectionInfo } from "./room";
import { hathoraClient } from "@/lib/hathora";

import { LobbyVisibility, Region } from "@hathora/cloud-sdk-typescript/dist/sdk/models/shared";

async function isReadyForConnect(roomId: string) {
  if (USE_LOCAL_WS) return;
  const MAX_CONNECT_ATTEMPTS = 50;
  const TRY_CONNECT_INTERVAL_MS = 1000;

  for (let i = 0; i < MAX_CONNECT_ATTEMPTS; i++) {
    const connetionInfo = await getConnectionInfo(roomId);
    if (connetionInfo.status === "active") {
      return;
    }
    await new Promise((resolve) =>
      setTimeout(resolve, TRY_CONNECT_INTERVAL_MS)
    );
  }
  throw new Error("Polling timed out");
}

export const createHathoraLobby = async () => {
  const loginResponse = await hathoraClient.authV1.loginAnonymous();
  const loginInfo = loginResponse.loginResponse;
  if (!loginInfo) {
    throw new Error(`could not log in to hathora`);
  }

  const roomConfig = {
    name: "hello-world"
  };

  const response = await hathoraClient.lobbyV3.createLobby(
    {
      createLobbyV3Params: {
        visibility: (USE_LOCAL_WS ? LobbyVisibility.Local : LobbyVisibility.Private),
        region: Region.WashingtonDC,
        roomConfig: JSON.stringify(roomConfig),
      },
    },
    {
      playerAuth: loginInfo.token,
    }
  );

  const lobbyInfo = response.lobbyV3;
  if (!lobbyInfo) {
    throw new Error(`could not create a lobby`);
  }
  await isReadyForConnect(lobbyInfo.roomId);
  return lobbyInfo;
}