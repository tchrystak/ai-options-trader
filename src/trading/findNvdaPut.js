import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

async function findNvdaPut() {
  const nvdaPrice = await alpaca.marketData.getLatestPrice("NVDA");

  const lowestStrike = nvdaPrice - 10;

  const response = await alpaca.trading.assets.getOptionsContracts({
    underlyingSymbols: "NVDA",
    type: "put",
    strikePriceGte: lowestStrike,
    strikePriceLte: nvdaPrice,
  });

  let highestStrike = 0;

  for (let i = 0; i < response.optionContracts.length; i++) {
    const strike = Number(response.optionContracts[i].strikePrice);

    if (strike > highestStrike) {
      highestStrike = strike;
    }
  }

  let selectedContract = null;

  for (let i = 0; i < response.optionContracts.length; i++) {
    const contract = response.optionContracts[i];
    const strike = Number(contract.strikePrice);

    if (strike === highestStrike) {
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
    strikePrice: highestStrike,
    expirationDate: selectedContract.expirationDate,
    quantity: 1,
    entryPrice: entryPrice,
  };
}

export { findNvdaPut };
