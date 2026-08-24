function placePaperTrade(optionData) {
  const trade = {
    symbol: optionData.symbol,
    optionType: optionData.optionType,
    strikePrice: optionData.strikePrice,
    expirationDate: optionData.expirationDate,
    quantity: optionData.quantity,
    entryPrice: optionData.entryPrice,
  };

  return trade;
}

export { placePaperTrade };