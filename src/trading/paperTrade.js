import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";
import { waitForFill } from "./waitForFill.js";
import { manageExit } from "./exitManager.js";

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
    // Submit the BUY order to Alpaca Paper
    const submittedOrder = await alpaca.trading.orders.limit(orderRequest);

    // Wait until Alpaca confirms the BUY order has filled
    const filledOrder = await waitForFill(submittedOrder.id);

    // Get the actual price Alpaca filled the BUY at
    const fillPrice = Number(filledOrder.filledAvgPrice);

    // Monitor the position and automatically sell at
    // either the 15% stop-loss or 45% profit target
    const exitOrder = await manageExit(
      filledOrder.symbol,
      fillPrice,
      Number(filledOrder.qty),
    );

    return exitOrder;
  }

  // Safe mode: return the trade without submitting it
  return trade;
}

export { placePaperTrade };
