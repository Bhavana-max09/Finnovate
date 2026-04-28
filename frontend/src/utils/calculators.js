/**
 * Financial calculators — EMI, FD maturity, RD maturity, Forex.
 */

export function calculateEMI(principal, annualRate, tenureMonths) {
  if (annualRate === 0) return principal / tenureMonths;
  const r = annualRate / 12 / 100;
  const emi = (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
  return Math.round(emi);
}

export function calculateFDMaturity(principal, annualRate, years, compoundingPerYear = 4) {
  const n = compoundingPerYear;
  const r = annualRate / 100;
  const maturity = principal * Math.pow(1 + r / n, n * years);
  return Math.round(maturity);
}

export function calculateRDMaturity(monthlyDeposit, annualRate, months) {
  const r = annualRate / 400; // quarterly rate
  const n = Math.floor(months / 3); // quarters
  let maturity = 0;
  for (let i = 1; i <= months; i++) {
    const remainingQuarters = (months - i + 1) / 3;
    maturity += monthlyDeposit * Math.pow(1 + r, remainingQuarters);
  }
  return Math.round(maturity);
}

export function convertForex(amount, fromRate, toRate) {
  // fromRate = value of 1 unit of fromCurrency in INR
  // toRate = value of 1 unit of toCurrency in INR
  if (fromRate === 0 || toRate === 0) return 0;
  const inrAmount = amount * fromRate;
  return (inrAmount / toRate).toFixed(2);
}
