import "dotenv/config";
import { Alpaca, NotFoundError } from "@alpacahq/alpaca-trade-api";
import { waitForFill } from "./waitForFill.js";
import { manageExit } from "./exitManager.js";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

// Check whether Alpaca already has today's 8:45 entry order
async function findOrderByClientId(clientOrderId) {
  try {
    const order = await alpaca.trading.orders.getOrderByClientOrderId({
      clientOrderId: clientOrderId,
    });

    return order;
  } catch (error) {
    // A 404 means today's order does not exist yet
    if (error instanceof NotFoundError) {
      return null;
    }

    // Any other error is unexpected, so do not hide it
    throw error;
  }
}

async function placePaperTrade(
  optionData,
  submitOrder = false,
  clientOrderId = null,
) {
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

    // Unique ID for today's 8:45 entry
    clientOrderId: clientOrderId,
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
    // either the 7% stop-loss or 5% quick scalp target
    const exitOrder = await manageExit(
      filledOrder.symbol,
      fillPrice,
      Number(filledOrder.qty),
    );

    // Get the actual SELL fill price
    const exitFillPrice = Number(exitOrder.filledAvgPrice);

    // Calculate the realized P/L
    const quantity = Number(filledOrder.qty);

    const profitLoss = (exitFillPrice - fillPrice) * 100 * quantity;

    // Calculate the realized percentage return
    const profitLossPercent = ((exitFillPrice - fillPrice) / fillPrice) * 100;

    console.log("-----------------------------------");
    console.log("TRADE COMPLETE");
    console.log("Entry fill:", fillPrice);
    console.log("Exit fill:", exitFillPrice);
    console.log("Quantity:", quantity);
    console.log("Realized P/L:", `$${profitLoss.toFixed(2)}`);
    console.log("Realized P/L %:", `${profitLossPercent.toFixed(2)}%`);
    console.log("-----------------------------------");

    return exitOrder;
  }

  // Safe mode: return the trade without submitting it
  return trade;
}

export { placePaperTrade, findOrderByClientId };
