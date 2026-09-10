import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

async function findNvdaPut() {
  const nvdaPrice = await alpaca.marketData.getLatestPrice("NVDA");

  // Search for PUT strikes up to $10 ABOVE NVDA.
  // For a PUT, strikes above the stock price are ITM.
  const highestStrike = nvdaPrice + 10;

  const response = await alpaca.trading.assets.getOptionsContracts({
    underlyingSymbols: "NVDA",
    type: "put",
    strikePriceGte: nvdaPrice,
    strikePriceLte: highestStrike,
  });

  // Find the LOWEST strike that is still above NVDA.
  // This gives us the closest ITM PUT.
  let lowestStrike = Infinity;

  for (let i = 0; i < response.optionContracts.length; i++) {
    const strike = Number(response.optionContracts[i].strikePrice);

    if (strike > nvdaPrice && strike < lowestStrike) {
      lowestStrike = strike;
    }
  }

  let selectedContract = null;

  for (let i = 0; i < response.optionContracts.length; i++) {
    const contract = response.optionContracts[i];
    const strike = Number(contract.strikePrice);

    if (strike === lowestStrike) {
      if (
        selectedContract === null ||
        contract.expirationDate > selectedContract.expirationDate
      ) {
        selectedContract = contract;
      }
    }
  }

  const optionQuotes = await alpaca.marketData.options.optionLatestQuotes({
    symbols: selectedContract.symbol,
  });

  const selectedQuote = optionQuotes.quotes[selectedContract.symbol];

  const entryPrice = Math.ceil(Number(selectedQuote.ap) * 100) / 100;

  return {
    symbol: selectedContract.symbol,
    optionType: "PUT",
    strikePrice: lowestStrike,
    expirationDate: selectedContract.expirationDate,
    quantity: 1,
    entryPrice: entryPrice,
  };
}

export { findNvdaPut };
