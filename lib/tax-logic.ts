// lib/tax-logic.ts

export function formatChineseUnits(num: number) {
  if (!num || isNaN(num) || num === 0) return "0 元";
  
  const yi = Math.floor(num / 100000000);
  const remainderYi = num % 100000000;
  const wan = Math.floor(remainderYi / 10000);
  const yuan = remainderYi % 10000;

  let result = "";
  if (yi > 0) result += `${yi} 億 `;
  if (wan > 0) result += `${wan} 萬 `;
  if (yuan > 0) result += `${yuan} 元`;
  return result.trim();
}

export function calculateDetailedTax(type: 'ESTATE' | 'GIFT', incomingData: any) {
  const amount = Number(incomingData.amount) || 0;
  const children = Number(incomingData.children) || 0;
  const parents = Number(incomingData.parents) || 0;
  const hasSpouse = !!incomingData.hasSpouse;

  const isEstate = type === 'ESTATE';
  
  const EXEMPTION = isEstate ? 13330000 : 2440000;
  const FUNERAL = isEstate ? 1380000 : 0;
  const SPOUSE = (isEstate && hasSpouse) ? 5530000 : 0;
  const CHILDREN = isEstate ? (children * 560000) : 0;
  const PARENTS = isEstate ? (parents * 1380000) : 0;

  const totalDeductions = EXEMPTION + FUNERAL + SPOUSE + CHILDREN + PARENTS;
  const net = Math.max(0, amount - totalDeductions);

  let tax = 0;
  let rate = "10%";
  const tiers = isEstate 
    ? [{ l: 56210000, r: 0.1, d: 0 }, { l: 112420000, r: 0.15, d: 2810500 }, { l: Infinity, r: 0.2, d: 8431500 }]
    : [{ l: 28110000, r: 0.1, d: 0 }, { l: 56210000, r: 0.15, d: 1405500 }, { l: Infinity, r: 0.2, d: 4215750 }];

  const tier = tiers.find(t => net <= t.l) || tiers[0];
  tax = Math.max(0, net * tier.r - tier.d);
  rate = (tier.r * 100) + "%";

  return {
    net, tax, rate, totalDeductions,
    details: { EXEMPTION, FUNERAL, SPOUSE, CHILDREN, PARENTS }
  };
}