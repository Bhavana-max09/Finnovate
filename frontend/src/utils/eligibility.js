/**
 * Eligibility Engine — Logic gates for banking products.
 */

export function checkLoanEligibility(loanProduct, profile) {
  const reasons = [];
  let eligible = true;

  if (profile.age < loanProduct.min_age) {
    eligible = false;
    reasons.push(`Minimum age is ${loanProduct.min_age}. You are ${profile.age}.`);
  }
  if (profile.age > loanProduct.max_age) {
    eligible = false;
    reasons.push(`Maximum age is ${loanProduct.max_age}. You are ${profile.age}.`);
  }
  if (loanProduct.min_income > 0 && profile.monthly_income < loanProduct.min_income) {
    eligible = false;
    reasons.push(`Minimum income ₹${loanProduct.min_income.toLocaleString()}/month required. Yours: ₹${profile.monthly_income.toLocaleString()}.`);
  }
  if (loanProduct.min_credit_score > 0 && profile.credit_score < loanProduct.min_credit_score) {
    eligible = false;
    reasons.push(`Minimum credit score ${loanProduct.min_credit_score} required. Yours: ${profile.credit_score}.`);
  }

  return { eligible, reasons };
}

export function checkCardEligibility(cardProduct, profile) {
  const reasons = [];
  let eligible = true;

  if (profile.age < 18) {
    eligible = false;
    reasons.push('Minimum age is 18 for credit/debit cards.');
  }
  if (cardProduct.min_income > 0 && profile.monthly_income < cardProduct.min_income) {
    eligible = false;
    reasons.push(`Minimum income ₹${cardProduct.min_income.toLocaleString()}/month required.`);
  }

  return { eligible, reasons };
}

export function filterProducts(products, profile, checkFn) {
  return products.map(p => ({
    ...p,
    eligibility: checkFn(p, profile),
  }));
}
