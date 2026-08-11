// Each company is mapped to the element it actually pulls out of the ground.
// That mapping drives the periodic tiles in the UI.

export const WATCHLIST = [
  {
    symbol: 'MP',
    name: 'MP Materials',
    element: { symbol: 'Nd', number: 60, name: 'Neodymium' },
    role: 'Miner + refiner',
    note: 'Only active rare earth mine in North America (Mountain Pass, CA)',
  },
  {
    symbol: 'LYSCF',
    name: 'Lynas Rare Earths',
    element: { symbol: 'Dy', number: 66, name: 'Dysprosium' },
    role: 'Miner + refiner',
    note: 'Largest rare earth separation capacity outside China',
  },
  {
    symbol: 'UUUU',
    name: 'Energy Fuels',
    element: { symbol: 'U', number: 92, name: 'Uranium' },
    role: 'Miner + processor',
    note: 'Uranium producer now separating rare earths at White Mesa',
  },
  {
    symbol: 'ALB',
    name: 'Albemarle',
    element: { symbol: 'Li', number: 3, name: 'Lithium' },
    role: 'Refiner',
    note: 'One of the largest lithium chemical producers worldwide',
  },
  {
    symbol: 'LAC',
    name: 'Lithium Americas',
    element: { symbol: 'Li', number: 3, name: 'Lithium' },
    role: 'Developer',
    note: 'Thacker Pass, the largest known lithium resource in the US',
  },
];

export const FUNDS = [
  {
    symbol: 'REMX',
    name: 'VanEck Rare Earth & Strategic Metals',
    element: { symbol: 'ETF', number: null, name: 'Basket' },
    role: 'Fund',
    note: 'Bundles miners and refiners across the rare earth complex',
  },
  {
    symbol: 'SETM',
    name: 'Sprott Critical Materials',
    element: { symbol: 'ETF', number: null, name: 'Basket' },
    role: 'Fund',
    note: 'Broader critical materials exposure, including battery metals',
  },
];

export const ALL = [...WATCHLIST, ...FUNDS];

export const GLOSSARY = [
  ['Beta', 'Volatility against the S&P 500. Above 1.0 means it swings harder than the market.'],
  ['52-week range', 'The lowest and highest price over the past year. Shows where today sits in that band.'],
  ['Market cap', 'Share price times shares outstanding, in millions of dollars.'],
  ['Return by window', 'Price change over a trailing period. 13W means the last thirteen weeks.'],
  ['Separation', 'The chemical step that splits mixed rare earth ore into individual elements. The bottleneck in the supply chain.'],
];
