import { createElWithClassAndText } from "./dom-method";
import { setUpPlayerBoard, populateBoard } from "./dom-ui";
import { createGameboardTable, createShipDom } from "./ship-placement-ui";

const createGreetingDom = () => {
  const greeting = createElWithClassAndText(
    "h2",
    "greeting",
    "It's time to place your battleships Commander!",
  );

  return greeting;
};

const createStartGameBtn = () => {
  const startGameBtn = createElWithClassAndText("button", "start-btn", "Start");
  return startGameBtn;
};
const createLobbyDom = () => {
  const lobby = createElWithClassAndText("div", "harbor");
  const player = setUpPlayerBoard("player1");
  populateBoard(player.board);
  const greeting = createGreetingDom();
  const lobbyContainer = createElWithClassAndText("div", "lobby-container");
  const mainLobbyContainer = createElWithClassAndText(
    "div",
    "main-lobby-container",
  );
  const gameboardContainer = createElWithClassAndText(
    "div",
    "gameboard-container",
  );

  const playerDom = createGameboardTable(player);
  createShipDom(player.board, playerDom);

  const startBtnContainer = createElWithClassAndText(
    "div",
    "start-btn-container",
  );
  const startGameBtn = createStartGameBtn();
  startBtnContainer.appendChild(startGameBtn);
  mainLobbyContainer.appendChild(greeting);
  gameboardContainer.appendChild(playerDom);
  mainLobbyContainer.appendChild(gameboardContainer);
  mainLobbyContainer.appendChild(startBtnContainer);
  lobbyContainer.appendChild(mainLobbyContainer);
  lobby.appendChild(lobbyContainer);

  return lobby;
};

export { createLobbyDom };