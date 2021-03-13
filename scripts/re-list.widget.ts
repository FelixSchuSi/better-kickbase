import { html } from "lit-html";

export function reListWidget() {
  return html`
    <div class="b-kb-re-list" @click=${reListButtonClick}>re-list</div>
  `;
}

enum Selectors {
  ALL_PLAYERS = ".players>.playerGroup",
  PRICE = ".playerOffer>.price",
  MARKET_VALUE = ".playerPoints>.price>strong",
  NAME = ".playerName>.lastName",
  EXPIRED = ".playerOffer > .price.expired",
  REMOVE_PLAYER = ".offerWidget>.cancelButton",
  ADD_PLAYERS = "#pageContentWrapper > div > div.TransferMarket.inner > div.leftContainer > div > div > div > div.statusBar > div > button",
  SET_LISTING_PRICE = ".offerWidget > .sellPlayerButton",
  LIST_PLAYERS = ".buttonContainer > .btn.highlighted",
}

function reListButtonClick() {
  const players: NodeListOf<HTMLElement> = document.querySelectorAll(
    Selectors.ALL_PLAYERS
  );

  let removedCount: number = 0;

  // Take a player off the market when the offer is below
  // the market value or when the offer is expired
  players.forEach((p) => removePlayerForRelist(p, removedCount));

  if (removedCount > 0) {
    listAllPlayers();
  }
}

function interpretPrice(str: string): number {
  const trimmed: string = str.split("\n")[0];
  const splitted: string[] = trimmed.split(".");
  const joined: number = Number(splitted.join("").replace("€ ", ""));
  return joined;
}

function removePlayerForRelist(player: HTMLElement, removedCount) {
  const selectors: string[] = [Selectors.PRICE, Selectors.MARKET_VALUE];

  const [angebot, mw]: number[] = selectors.map((selector) => {
    const element: HTMLElement | null = player.querySelector(selector);
    const value: number = element ? interpretPrice(element.innerText) : 0;
    return value;
  });

  const isOfferExpired: boolean = !!player.querySelector(Selectors.EXPIRED);

  if (isOfferExpired || mw > angebot) {
    // Take a player off the market
    const removePlayerButton: HTMLElement | null = player.querySelector(
      Selectors.REMOVE_PLAYER
    );
    removePlayerButton?.click();
    removedCount++;
  }
}

function listAllPlayers() {
  const addPlayersButton: HTMLElement | null = document.querySelector(
    Selectors.ADD_PLAYERS
  );
  addPlayersButton?.click();
  setTimeout(() => {
    const setPriceFields: NodeListOf<HTMLElement> = document.querySelectorAll(
      Selectors.SET_LISTING_PRICE
    );
    setPriceFields.forEach((setPriceField) => {
      setPriceField.click();
    });

    const listPlayersButton: HTMLElement | null = document.querySelector(
      Selectors.LIST_PLAYERS
    );
    listPlayersButton?.click();
  }, 500);
}

// function toCsv(arr) {
//   let result = "sep=,\n";
//   // debugger;
//   for (const [name, value] of arr) {
//     result += `${name},${value}\n`;
//   }
//   return result;
// }

// function extractPlayerData() {
//   const players = Array.from(
//     document.querySelectorAll(".players>.playerGroup")
//   );
//   const playerData = players.map((player) => {
//     console.log(player);
//     try {
//       debugger;
//       const offerElement = player.querySelector(".playerOffer>.price");
//       const offer = offerElement ? interpretPrice(offerElement.innerText) : -1;
//       const mw = interpretPrice(
//         player.querySelector(".playerPoints>.price>strong").innerText
//       );
//       const name = player.querySelector(".playerName>.lastName").innerText;
//       return offer > 0 ? [name, offer] : [name, mw];
//     } catch (e) {}
//   });
//   const csv = toCsv(playerData);
//   console.log(csv);
//   a = document.createElement("a");
//   a.download = "better-kb.csv";
//   a.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
//   a.click();
//   console.log(csv);
// }

// console.log("v008");
// document.addEventListener(
//   "keydown",
//   function(e) {
//     if (
//       (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
//       e.keyCode == 83
//     ) {
//       e.preventDefault();
//       console.log("export started");
//       extractPlayerData();
//     }
//   },
//   false
// );
