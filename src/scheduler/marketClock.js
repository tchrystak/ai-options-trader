import { placePaperTrade } from "../trading/paperTrade.js";
import { findNvdaPut } from "../trading/findNvdaPut.js";

let lastTradeDate = null; // The starting state is nothing is executed

setInterval(async () => {
  const now = new Date();
  console.log("Checking the market clock...");

  // Get the date
  const tradingDate = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  // Get the current hour in Central Time using a 24-hour clock
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

  // convert the hour and minute from strings to numbers
  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);

  // Is it 8:45?
  const isTradeTime = hourNumber === 8 && minuteNumber === 45;

  // Should we execute today's trade yet?
  if (isTradeTime && tradingDate !== lastTradeDate) {
    console.log("It's 8:45 AM — finding NVDA PUT...");

  const selectedOption = await findNvdaPut();

  const paperTrade = placePaperTrade(selectedOption);

  console.log("Paper trade:", paperTrade);

    lastTradeDate = tradingDate;
  }
}, 1000);
