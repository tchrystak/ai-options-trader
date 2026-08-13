// Creating a data collection of candles
const candlesArray = [
  {
    timestamp: "2026-08-09T10:31:00",
    open: 180.25,
    high: 181.1,
    low: 179.8,
    close: 180.95,
    volume: 123456,
  },
  {
    timestamp: "2026-08-09T10:32:00",
    open: 180.95,
    high: 181.35,
    low: 180.7,
    close: 181.2,
    volume: 135200,
  },
  {
    timestamp: "2026-08-09T10:33:00",
    open: 181.2,
    high: 181.6,
    low: 181.0,
    close: 181.5,
    volume: 148700,
  },
  {
    timestamp: "2026-08-09T10:34:00",
    open: 181.5,
    high: 181.75,
    low: 181.25,
    close: 181.4,
    volume: 152300,
  },
  {
    timestamp: "2026-08-09T10:35:00",
    open: 181.55,
    high: 181.6,
    low: 181.0,
    close: 181.1,
    volume: 148700,
  },
];

for (let i = 0; i < candlesArray.length; i++) {
  console.log(candlesArray[i].close); // For every candle in my collection, give me the closing price
}

const closingPrices = [];
for (let i = 0; i < candlesArray.length; i++) {
  // Iterate through each candle in this array
  closingPrices.push(candlesArray[i].close); // [i] changes every time the loop runs...starting from 0 - 2 and add it to this new array - closingPrices
}

console.log(closingPrices); // Expecting this result: [180.95, 181.20, 181.50]

/* Essentially doing 
First loop:
closingPrices.push(180.95)

Second loop:
closingPrices.push(181.20)

Third loop:
closingPrices.push(181.50)Expecting it to log */

let sum = 0;

for (let i = 0; i < closingPrices.length; i++) {
  sum = closingPrices[i] + sum;
} // iterate through closingPrices array, take each value in the array and add it to the sum

const movingAverage = sum / closingPrices.length; //divide the sum by the number of values in the closingPrice array

console.log(movingAverage);

function calculateMovingAverage(prices) {
  let sum = 0;

  for (let i = 0; i < prices.length; i++) {
    sum = prices[i] + sum;
  }

  const movingAverage = sum / prices.length;

  console.log(movingAverage);
  return movingAverage;
} // lets create a function that will take an array of prices and be iterated through. We're going to take each value in the prices array and add them to the sum. Then take the sum and divide it by the number of values in the prices array to get the moving average
