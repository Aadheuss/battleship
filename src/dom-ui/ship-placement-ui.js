import { addAttributesToEl, createElWithClassAndText } from "./dom-method";
import { populateBoard, setUpPlayerBoard } from "./dom-ui";
import {
  dragoverHandler,
  dragstartHandler,
  dropHandler,
} from "./drag-and-drop";
import Ship from "../ship";
import { changeOrientation } from "./ship-orientation-control";

const createRowsFromBoard = (board, rowLength) => {
  const rows = [];

  for (let i = 0; i < board.length / rowLength; i += 1) {
    const row = [];
    for (let j = 0; j < board.length / rowLength; j += 1) {
      row.push(board[Number(i.toString() + j.toString())]);
    }
    rows.push(row);
  }

  return rows;
};

const createGameboardRowDom = (rowDom, rowArr) => {
  rowArr.forEach((square) => {
    const squareDom = createElWithClassAndText("td", "square");
    addAttributesToEl(
      squareDom,
      ["data-coordinates", "data-info"],
      [`${square.coordinates}`, "free"],
    );
    squareDom.addEventListener("drop", dropHandler);
    squareDom.addEventListener("dragover", dragoverHandler);
    rowDom.appendChild(squareDom);
  });
};

const createRowDom = (rowDom, rowArr) => {
  rowArr.forEach((item) => {
    const dom = createElWithClassAndText("th", "", item);
    dom.setAttribute("scope", "column");
    rowDom.appendChild(dom);
  });
};

const createColumnHeader = () => {
  const row = document.createElement("tr");
  row.appendChild(createElWithClassAndText("td"));
  createRowDom(row, ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);

  return row;
};

const createGameboardTable = (player) => {
  const boardDom = createElWithClassAndText("table", "gameboard");
  boardDom.setAttribute("data-name", `${player.player.name}`);
  boardDom.appendChild(createColumnHeader());
  const rows = createRowsFromBoard(player.board.board, 10);
  rows.forEach((row, index) => {
    const rowDom = document.createElement("tr");
    const rowHead = createElWithClassAndText("th", "", index + 1);
    rowHead.setAttribute("scope", "row");
    rowDom.appendChild(rowHead);
    createGameboardRowDom(rowDom, row);
    boardDom.appendChild(rowDom);
  });
  return boardDom;
};

const createGreetingDom = () => {
  const greeting = createElWithClassAndText(
    "h2",
    "greeting",
    "It's time to place your battleships Commander!",
  );

  return greeting;
};

const styleShipByItsLength = (dom, length, orientation) => {
  const el = dom;

  if (orientation === "row") {
    el.style.width = `calc(${length * 100}% + ${length - 1}px)`;
  } else {
    el.style.height = `calc(${length * 100}% + ${length - 1}px)`;
  }
};

const setDataInfoAttr = (ship, board, boardDom) => {
  const { coordinates } = ship;
  const { orientation } = ship;
  const coordinatesList = board.getAllCoordinatesListByIndex(
    coordinates,
    ship.ship,
    orientation,
  );

  coordinatesList.forEach((coord) => {
    const dom = boardDom.querySelector(`[data-coordinates="${coord}"]`);
    addAttributesToEl(dom, ["data-info"], ["occupied"]);
  });
};

const createDraggableItem = (index, orientation, length, head) => {
  const draggable = createElWithClassAndText("div", "draggable");
  addAttributesToEl(
    draggable,
    ["id", "draggable", "data-orientation", "data-length", "data-head"],
    [`${index}`, true, orientation, `${length}`, `${head}`],
  );

  styleShipByItsLength(draggable, length, orientation);
  draggable.addEventListener("dragstart", dragstartHandler);
  draggable.addEventListener("dblclick", changeOrientation);

  return draggable;
};

const createShipDom = (board, boardDom) => {
  board.ships.forEach((ship, index) => {
    const dom = boardDom.querySelector(
      `[data-coordinates="${ship.coordinates}"]`,
    );
    setDataInfoAttr(ship, board, boardDom);
    dom.appendChild(
      createDraggableItem(
        index,
        ship.orientation,
        ship.ship.length,
        ship.coordinates,
      ),
    );
  });
};

const shipPlacementDom = () => {
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
  mainLobbyContainer.appendChild(greeting);
  gameboardContainer.appendChild(playerDom);
  mainLobbyContainer.appendChild(gameboardContainer);
  lobbyContainer.appendChild(mainLobbyContainer);
  lobby.appendChild(lobbyContainer);

  return lobby;
};

export { shipPlacementDom };
