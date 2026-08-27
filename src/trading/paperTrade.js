import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

async function placePaperTrade(optionData, submitOrder = false) {
  const trade = {
    symbol: optionData.symbol,
    optionType: optionData.optionType,
    strikePrice: optionData.strikePrice,
    expirationDate: optionData.expirationDate,
    quantity: optionData.quantity,
    entryPrice: optionData.entryPrice,
  };

  const orderRequest = {
    symbol: optionData.symbol,
    qty: optionData.quantity,
    side: "buy",
    limitPrice: optionData.entryPrice,
    timeInForce: "day",
  };

  console.log("Order request:", orderRequest);

  if (submitOrder) {
  const submittedOrder = await alpaca.trading.orders.limit(orderRequest);

  return submittedOrder;
}

return trade;
}

export { placePaperTrade };
