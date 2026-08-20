
function placePaperTrade(
  symbol,
  optionType,
  strikePrice,
  expirationDate,
  quantity,
  entryPrice,
) {
  const trade = {
    symbol: symbol,
    optionType: optionType,
    strikePrice: strikePrice,
    expirationDate: expirationDate,
    quantity: quantity,
    entryPrice: entryPrice,
  };

  return trade;
}

export { placePaperTrade };