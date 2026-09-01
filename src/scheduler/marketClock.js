import { placePaperTrade } from "../trading/paperTrade.js";
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
    // IMPORTANT:
    // Lock today's trade BEFORE making any async calls.
    // This prevents the scheduler from submitting another
    // contract on the next 1-second interval.
    lastTradeDate = tradingDate;
    tradeInProgress = true;

    console.log("It's 8:45 AM — finding NVDA PUT...");

    try {
      // Find the closest OTM NVDA PUT
      const selectedOption = await findNvdaPut();

      // Submit ONE paper trade
      const paperTrade = await placePaperTrade(selectedOption, true);

      console.log("Paper trade:", paperTrade);
    } catch (error) {
      console.error("8:45 trade error:", error.message);
    } finally {
      // The trade workflow has finished,
      // but today's date remains locked.
      tradeInProgress = false;
    }
  }
}, 1000);
