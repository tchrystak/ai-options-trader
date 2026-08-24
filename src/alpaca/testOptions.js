import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";
import { placePaperTrade } from "../trading/paperTrade.js";

// Connect to Alpaca paper trading
const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

// Get the latest NVDA stock price
const nvdaPrice = await alpaca.marketData.getLatestPrice("NVDA");

// Search $10 below NVDA's current price
const lowestStrike = nvdaPrice - 10;

// Get active NVDA PUT contracts near the current stock price
const response = await alpaca.trading.assets.getOptionsContracts({
  underlyingSymbols: "NVDA",
  type: "put",
  strikePriceGte: lowestStrike,
  strikePriceLte: nvdaPrice,
});

let highestStrike = 0;

// Find the closest strike below NVDA's current price
for (let i = 0; i < response.optionContracts.length; i++) {
  const strike = Number(response.optionContracts[i].strikePrice);

  if (strike > highestStrike) {
    highestStrike = strike;
  }
}

let selectedContract = null;

// Find the contract with our selected strike
// and use the later expiration
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

// Get the latest bid and ask for the selected option
const optionQuotes =
  await alpaca.marketData.options.optionLatestQuotes({
    symbols: selectedContract.symbol,
  });

const selectedQuote = optionQuotes.quotes[selectedContract.symbol];

// Since we are buying the PUT, use the ask as our paper entry price
const entryPrice = selectedQuote.ap;

// Package the selected option into one clean object
const selectedOptionData = {
  symbol: selectedContract.symbol,
  optionType: "PUT",
  strikePrice: highestStrike,
  expirationDate: selectedContract.expirationDate,
  quantity: 1,
  entryPrice: entryPrice,
};

// Send the selected option into our paper trade function
const paperTrade = placePaperTrade(selectedOptionData);

// Display the important results
console.log("NVDA price:", nvdaPrice);
console.log("Paper trade:", paperTrade);