import "dotenv/config";
import { Alpaca } from "@alpacahq/alpaca-trade-api";

// Connect to the Alpaca paper trading account
const alpaca = new Alpaca({
  keyId: process.env.APCA_API_KEY_ID,
  secret: process.env.APCA_API_SECRET_KEY,
  paper: true,
});

async function waitForFill(orderId) {
  // Keep checking until the order is filled
  while (true) {
    const order = await alpaca.trading.orders.getOrderByOrderID({
      orderId: orderId,
    });

    // If the order has filled, return the full order details
    if (order.status === "filled") {
      return order;
    }

    // Stop checking if the order can no longer fill
    const stoppedStatuses = ["canceled", "expired", "rejected", "done_for_day"];

    if (stoppedStatuses.includes(order.status)) {
      throw new Error(`Order stopped with status: ${order.status}`);
    }

    // Wait 1 second before checking again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

// Export the function so other files can use it
export { waitForFill };
