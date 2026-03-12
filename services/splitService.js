async function computeSplits(bill, items, roommates) {
  const totals = {};
  // Calculate total owed per roommate
  for (const rm of roommates) totals[rm._id.toString()] = 0;

  for (const it of items) {
    const assigned = it.assignedTo ? it.assignedTo.toString() : null;
    if (assigned && totals.hasOwnProperty(assigned)) {
      totals[assigned] += it.priceCents;
    }
  }
  // Calculate amounts paid by each roommate
  const payerId = bill.paidBy.toString();
  const paidBy = {};
  for (const rm of roommates) paidBy[rm._id.toString()] = 0;
  paidBy[payerId] = bill.totalAmountCents;

  const balances = {};
  for (const id of Object.keys(paidBy)) {
    balances[id] = paidBy[id] - (totals[id] || 0);
  }
  // Generate payment instructions
  const creditors = [];
  const debtors = [];
  for (const [id, bal] of Object.entries(balances)) {
    const amount = bal;
    if (amount > 0) creditors.push({ id, amount });
    else if (amount < 0) debtors.push({ id, amount: -amount });
  }
  
  const payments = [];
  let cIdx = 0;
  let dIdx = 0;
  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const pay = Math.min(debtor.amount, creditor.amount);
    payments.push({ from: debtor.id, to: creditor.id, amountCents: pay });
    debtor.amount -= pay;
    creditor.amount -= pay;
    if (Math.abs(debtor.amount) < 1) dIdx++;
    if (Math.abs(creditor.amount) < 1) cIdx++;
  }
  // Prepare detailed breakdown
  const details = {
    totalsPerRoommate: totals,
    paidBy: { [payerId]: bill.totalAmountCents },
  };

  return { balances, payments, details };
}

module.exports = { computeSplits };
