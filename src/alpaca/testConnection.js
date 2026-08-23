import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

const account = await alpaca.trading.account.getAccount();

console.log("Account status:", account.status);
console.log("Cash:", account.cash);
console.log("Options buying power:", account.options_buying_power);
console.log("Options trading level:", account.options_trading_level);