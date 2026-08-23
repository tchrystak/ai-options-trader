import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

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

  console.log(
    response.optionContracts[i].strikePrice,
    response.optionContracts[i].expirationDate
  );
}

console.log("Highest strike:", highestStrike);

let selectedContract = null;

for (let i = 0; i < response.optionContracts.length; i++) {
  const strike = Number(response.optionContracts[i].strikePrice);

  if (strike === highestStrike) {
    if (
      selectedContract === null ||
      response.optionContracts[i].expirationDate > selectedContract.expirationDate
    ) {
      selectedContract = response.optionContracts[i];
    }
  }
}
console.log("Selected contract:", selectedContract.symbol);
console.log("Selected expiration:", selectedContract.expirationDate);

console.log("NVDA latest price:", nvdaPrice);
console.log("Lowest strike:", lowestStrike);
console.log("Number of contracts:", response.optionContracts.length);
console.log("More contracts available:", response.nextPageToken !== undefined);