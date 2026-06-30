/**
 * Bangladesh-specific seasonal agriculture data, keyed by the six Bengali
 * seasons (ঋতু). Curated for Bangladesh growing conditions (India excluded).
 * Content is a sensible first pass to review with the user; structure is stable.
 */

export type SeasonAgri = {
  key: string;
  crops: string[];
  fruits: string[];
  flowers: string[];
  note: string;
};

export const AGRICULTURE: Record<string, SeasonAgri> = {
  grishmo: {
    key: 'grishmo',
    crops: ['Aus rice (sowing)', 'Jute', 'Maize', 'Chilli', 'Patol (pointed gourd)'],
    fruits: ['Mango', 'Jackfruit', 'Litchi', 'Watermelon', 'Blackberry (Jaam)'],
    flowers: ['Krishnachura', 'Radhachura', 'Jasmine (Beli)', 'Champa'],
    note: 'Hot, dry pre-monsoon. Prepare land and nurseries; irrigate young crops.',
  },
  borsha: {
    key: 'borsha',
    crops: ['Aman rice (transplanting)', 'Jute (harvest)', 'Okra', 'Brinjal', 'Kochu (taro)'],
    fruits: ['Jaam', 'Amra (hog plum)', 'Pineapple', 'Banana', 'Guava'],
    flowers: ['Kadam', 'Jui', 'Kethki', 'Water lily (Shapla)'],
    note: 'Monsoon rains. Main Aman planting season; watch for flooding and drainage.',
  },
  sharat: {
    key: 'sharat',
    crops: ['Aman rice (growth)', 'Early winter vegetables (nursery)', 'Sweet gourd', 'Bean'],
    fruits: ['Guava', 'Star fruit (Kamranga)', 'Pomelo (Jambura)', 'Coconut'],
    flowers: ['Shiuli (Shefali)', 'Kashful', 'Padma (lotus)', 'Joba (hibiscus)'],
    note: 'Clear skies, kashful blooms. Sow winter vegetable nurseries.',
  },
  hemanto: {
    key: 'hemanto',
    crops: ['Aman rice (harvest — Nabanna)', 'Potato', 'Mustard', 'Winter vegetables'],
    fruits: ['Orange', 'Olive (Jolpai)', 'Custard apple (Ata)', 'Date palm sap (Khejur ras)'],
    flowers: ['Gada (marigold)', 'Chandramallika', 'Dahlia', 'Shiuli'],
    note: 'Harvest season. Nabanna celebrates new rice; begin Rabi/winter crops.',
  },
  sheet: {
    key: 'sheet',
    crops: ['Boro rice (seedbed)', 'Potato', 'Tomato', 'Cauliflower', 'Cabbage', 'Radish'],
    fruits: ['Date palm sap & gur', 'Orange', 'Plum (Kul/Boroi)', 'Amla'],
    flowers: ['Marigold', 'Rose', 'Dahlia', 'Sweet pea', 'Chrysanthemum'],
    note: 'Cool, dry winter. Peak vegetable season; protect seedbeds from cold fog.',
  },
  boshonto: {
    key: 'boshonto',
    crops: ['Boro rice (transplant/growth)', 'Sunflower', 'Watermelon', 'Sesame', 'Cucumber'],
    fruits: ['Wood apple (Bel)', 'Early mango (blossom)', 'Mulberry', 'Sapodilla (Sofeda)'],
    flowers: ['Polash', 'Shimul', 'Krishnachura (early)', 'Marigold'],
    note: 'Spring. Mango & lychee flowering; irrigate Boro rice as heat rises.',
  },
};
