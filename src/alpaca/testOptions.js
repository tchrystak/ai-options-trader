import { findNvdaPut } from "../trading/findNvdaPut.js";

const selectedOption = await findNvdaPut();

console.log("Selected option:", selectedOption);