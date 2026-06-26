// Strategic Elements — tracked universe
// Each company is tied to a real periodic-table element it actually produces
// or is most associated with, which powers the badge motif throughout the UI.

export const COMPANIES = [
  {
    ticker: 'MP',
    name: 'MP Materials',
    element: { symbol: 'Nd', name: 'Neodymium', number: 60 },
    segment: 'Rare Earths',
    blurb: 'Owns Mountain Pass, the only integrated rare-earth mine-to-magnet operation in the US.',
    isNew: false,
  },
  {
    ticker: 'LYSCF',
    name: 'Lynas Rare Earths',
    element: { symbol: 'Tb', name: 'Terbium', number: 65 },
    segment: 'Rare Earths',
    blurb: 'Largest rare-earth producer outside China, separating heavy rare earths in Malaysia.',
    isNew: false,
  },
  {
    ticker: 'UUUU',
    name: 'Energy Fuels',
    element: { symbol: 'U', name: 'Uranium', number: 92 },
    segment: 'Rare Earths / Uranium',
    blurb: 'America\u2019s largest uranium producer, now also separating rare earths from monazite.',
    isNew: false,
  },
  {
    ticker: 'ALB',
    name: 'Albemarle',
    element: { symbol: 'Li', name: 'Lithium', number: 3 },
    segment: 'Lithium',
    blurb: 'World\u2019s largest lithium producer, supplying cathode chemistry for EV batteries.',
    isNew: false,
  },
  {
    ticker: 'LAC',
    name: 'Lithium Americas',
    element: { symbol: 'Li', name: 'Lithium', number: 3 },
    segment: 'Lithium',
    blurb: 'Developing Thacker Pass in Nevada, one of the largest known lithium deposits in the US.',
    isNew: false,
  },
  {
    ticker: 'USAR',
    name: 'USA Rare Earth',
    element: { symbol: 'Pr', name: 'Praseodymium', number: 59 },
    segment: 'Rare Earths',
    blurb: 'Building a full mine-to-magnet chain in Oklahoma; recently agreed to acquire Brazil\u2019s Serra Verde.',
    isNew: true,
  },
  {
    ticker: 'NB',
    name: 'NioCorp Developments',
    element: { symbol: 'Nb', name: 'Niobium', number: 41 },
    segment: 'Niobium / Rare Earths',
    blurb: 'Developing Elk Creek in Nebraska for niobium and scandium, with rare earths as a potential by-product.',
    isNew: true,
  },
  {
    ticker: 'CRML',
    name: 'Critical Metals Corp',
    element: { symbol: 'Dy', name: 'Dysprosium', number: 66 },
    segment: 'Rare Earths',
    blurb: 'Advancing a heavy rare-earth project in Greenland aimed at the magnet supply chain.',
    isNew: true,
  },
  {
    ticker: 'METC',
    name: 'Ramaco Resources',
    element: { symbol: 'Sc', name: 'Scandium', number: 21 },
    segment: 'Coal / Rare Earths',
    blurb: 'Metallurgical coal producer developing the Brook Mine in Wyoming for scandium and magnet rare earths.',
    isNew: true,
  },
];

export const ETFS = [
  {
    ticker: 'REMX',
    name: 'VanEck Rare Earth & Strategic Metals ETF',
    blurb: 'Broad benchmark for rare-earth and strategic-metals producers worldwide.',
  },
  {
    ticker: 'SETM',
    name: 'Sprott Critical Materials ETF',
    blurb: 'Pure-play exposure to miners across nine essential critical-materials metals.',
  },
];

export const ALL_TICKERS = [...COMPANIES.map((c) => c.ticker), ...ETFS.map((e) => e.ticker)];

// Static, factual one-liners for the element hover cards (no API dependency).
export const ELEMENT_FACTS = {
  Nd: 'Neodymium magnets are the strongest permanent magnets made — one EV motor uses about a kilogram.',
  Tb: 'Terbium is added in small amounts to neodymium magnets so they keep working at engine temperatures.',
  U: 'Uranium fuels nuclear reactors that produce about a fifth of US electricity.',
  Li: 'Lithium-ion chemistry is what lets a battery hold charge densely enough to move a car.',
  Pr: 'Praseodymium is alloyed with neodymium to make magnets easier to manufacture at scale.',
  Nb: 'Niobium makes steel stronger without making it heavier — it\u2019s in most modern car bodies.',
  Dy: 'Dysprosium keeps magnets from losing their pull as they heat up inside a spinning motor.',
  Sc: 'Scandium-aluminum alloys are nearly as strong as titanium at a fraction of the weight.',
};
