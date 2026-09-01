import { placePaperTrade, findOrderByClientId } from "../trading/paperTrade.js";

import { findNvdaPut } from "../trading/findNvdaPut.js";

// Remember whether today's 8:45 trade has already been triggered
let lastTradeDate = null;

// Prevent another trade from starting while one is already being processed
let tradeInProgress = false;

setInterval(async () => {
  const now = new Date();

  console.log("Checking the market clock...");

  // Get today's date in Central Time
  const tradingDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Get the current hour in Central Time
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    hour: "numeric",
    hour12: false,
  }).format(now);

  // Get the current minute in Central Time
  const minute = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    minute: "numeric",
  }).format(now);

  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);

  // Our strategy enters at exactly 8:45 AM Central
  const isTradeTime = hourNumber === 8 && minuteNumber === 45;

  if (isTradeTime && tradingDate !== lastTradeDate && !tradeInProgress) {
    // Lock today's trade BEFORE making any async calls
    lastTradeDate = tradingDate;
    tradeInProgress = true;

    // Create one unique Alpaca order ID for today's trade
    const clientOrderId = `nvda-845-${tradingDate.replaceAll("/", "-")}`;

    console.log("It's 8:45 AM — finding NVDA PUT...");

    try {
      // Check Alpaca in case today's order already exists
      const existingOrder = await findOrderByClientId(clientOrderId);

      if (existingOrder) {
        console.log(
          "Today's 8:45 order already exists. Skipping duplicate trade.",
        );

        return;
      }

      // Find the closest OTM NVDA PUT
      const selectedOption = await findNvdaPut();

      // Submit ONE paper trade
      const paperTrade = await placePaperTrade(
        selectedOption,
        true,
        clientOrderId,
      );

      console.log("Paper trade:", paperTrade);
    } catch (error) {
      console.error("8:45 trade error:", error.message);
    } finally {
      // Today's date stays locked even after the trade finishes
      tradeInProgress = false;
    }
  }
}, 1000);
