export enum Selectors {
  ALL_PLAYERS = '.players>.playerGroup',
  OFFER = '.playerOffer>.price',
  MARKET_VALUE = '.playerPoints>.price>strong',
  NAME = '.playerName>.lastName',
  EXPIRED = '.playerOffer > .price.expired',
  REMOVE_PLAYER = '.offerWidget>.cancelButton',
  ADD_PLAYERS = '#pageContentWrapper > div > div.TransferMarket.inner > div.leftContainer > div > div > div > div.statusBar > div > button',
  SET_LISTING_PRICE = '.offerWidget > .sellPlayerButton',
  LIST_PLAYERS = '.buttonContainer > .btn.highlighted',
  LASTNAME = '.playerName>.lastName',
  FIRSTNAME = '.playerName>.firstName',
  BALANCE = '.active > .leagueBudget > .content'
}
