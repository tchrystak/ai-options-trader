import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

function calculateExitPrices(fillPrice) {
  // Hard stop-loss at 15% below the actual fill price
  // Round UP so the stop does not exceed a 15% loss
  const stopPrice = Math.ceil(fillPrice * 0.85 * 100) / 100;

  // Profit target at 45% above the actual fill price
  const targetPrice = Number((fillPrice * 1.45).toFixed(2));

  return {
    stopPrice: stopPrice,
    targetPrice: targetPrice,
  };
}

// Monitor an open option position and manage its exit
async function manageExit(symbol, fillPrice, quantity) {
  // Calculate the stop-loss and profit target from the actual fill price
  const exitPrices = calculateExitPrices(fillPrice);

  console.log("Managing exit for:", symbol);
  console.log("Stop price:", exitPrices.stopPrice);
  console.log("Target price:", exitPrices.targetPrice);

  // Keep monitoring the option until an exit condition is reached
  while (true) {
    // Get the latest bid and ask for the option we are managing
    const optionQuotes = await alpaca.marketData.options.optionLatestQuotes({
      symbols: symbol,
    });

    // Get this specific option's quote from the response
    const selectedQuote = optionQuotes.quotes[symbol];

    // Use the bid because we would be selling the option to exit
    const bidPrice = selectedQuote.bp;

    console.log("Current bid:", bidPrice);

    // Prepare the order we will use to close the option position
    const exitOrderRequest = {
      symbol: symbol,
      qty: quantity,
      side: "sell",
      timeInForce: "day",
      positionIntent: "sell_to_close",
    };

    // Check if the 15% stop-loss has been reached
    if (bidPrice <= exitPrices.stopPrice) {
      console.log("STOP LOSS HIT");

      // Sell the option to close the position
      const exitOrder = await alpaca.trading.orders.market(exitOrderRequest);

      return exitOrder;
    }

    // Check if the 45% profit target has been reached
    if (bidPrice >= exitPrices.targetPrice) {
      console.log("PROFIT TARGET HIT");

      // Sell the option to close the position
      const exitOrder = await alpaca.trading.orders.market(exitOrderRequest);

      return exitOrder;
    }

    // Wait 1 second before checking the bid again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

export { calculateExitPrices, manageExit };
