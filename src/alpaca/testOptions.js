import { findNvdaPut } from "../trading/findNvdaPut.js";
import { placePaperTrade } from "../trading/paperTrade.js";

const selectedOption = await findNvdaPut();

const paperTrade = await placePaperTrade(selectedOption);

console.log("Selected option:", selectedOption);
console.log("Paper trade:", paperTrade);
