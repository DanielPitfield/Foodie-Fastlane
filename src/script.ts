import { ALL_TAKEAWAYS, TakeawayOrder } from "./data";

let hasPlacedOrder = false;

async function checkOrder() {
  // Don't place another order (if an order is currently/already being placed)
  if (hasPlacedOrder) {
    return;
  }

  const matchingTakeaways = ALL_TAKEAWAYS.filter(({ url }) => window.location.href.startsWith(url));

  if (matchingTakeaways.length <= 0) {
    return;
  }

  if (matchingTakeaways.length !== 1) {
    throw new Error(`Found more than 1 takeaway info for this URL`);
  }

  const matchingTakeaway = matchingTakeaways[0];

  const order: TakeawayOrder = {
    type: "delivery",
    address: {
      street1: "Bournemouth School",
      street2: "East Way",
      postCode: "BH8 9PY",
      townCity: "Bournemouth",
    },
    time: "ASAP",
  };

  
  await matchingTakeaway.placeOrder(order);
  hasPlacedOrder = true;
}

const CHECK_INTERVAL_MS = 1000;
setInterval(checkOrder, CHECK_INTERVAL_MS);
