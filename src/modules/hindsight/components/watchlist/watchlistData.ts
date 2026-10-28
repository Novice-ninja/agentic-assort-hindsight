export interface WatchlistRow {
  productId: string;
  description: string;
  priority: 'CRITICAL';
  sales: string;
  growthVsLy: string;
  gm: string;
  dos: string;
  why: string;
}

/** Static sample data from full_product_data.csv, until the watchlist API exists. */
export const WATCHLIST_ROWS: WatchlistRow[] = [
  {
    productId: '100819150',
    description: 'Maverick Red Oak Wire-Brushed Solid Hardwood',
    priority: 'CRITICAL',
    sales: '$3.5K',
    growthVsLy: '↓ 97.4% vs LY',
    gm: '-76.0%',
    dos: '246d',
    why: 'Velocity; GM floor; GM trend; DOS; Returns',
  },
  {
    productId: '100840875',
    description: 'Northport White Oak Distressed Water Resistant Engineered Hardwood',
    priority: 'CRITICAL',
    sales: '$1.6M',
    growthVsLy: '↓ 29.3% vs LY',
    gm: '4.4%',
    dos: '17d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100499763',
    description: 'Seashell Long Leaf Acacia Solid Hardwood',
    priority: 'CRITICAL',
    sales: '$914.9K',
    growthVsLy: '↓ 29.5% vs LY',
    gm: '9.2%',
    dos: '1d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100503218',
    description:
      'Ceruse Blonde White Oak Wire Brushed Water Resistant Engineered Hardwood',
    priority: 'CRITICAL',
    sales: '$469.9K',
    growthVsLy: '↓ 64.2% vs LY',
    gm: '7.4%',
    dos: '0d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100987734',
    description: 'Hillside White Oak Wire-Brushed Solid Hardwood',
    priority: 'CRITICAL',
    sales: '$450K',
    growthVsLy: '↓ 69.6% vs LY',
    gm: '-9.9%',
    dos: '0d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100963313',
    description: 'Legacy Wire Brushed Locking Engineered Stranded Bamboo',
    priority: 'CRITICAL',
    sales: '$300K',
    growthVsLy: '↓ 28.0% vs LY',
    gm: '-1.1%',
    dos: '19d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100912583',
    description: 'Chantrelle Maple Handscraped Engineered Hardwood',
    priority: 'CRITICAL',
    sales: '$270.2K',
    growthVsLy: '↓ 20.7% vs LY',
    gm: '8.1%',
    dos: '0d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100898691',
    description: 'Allendale Hickory Wire-Brushed Solid Hardwood',
    priority: 'CRITICAL',
    sales: '$218.8K',
    growthVsLy: '↓ 43.6% vs LY',
    gm: '-12.6%',
    dos: '9d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100704337',
    description: 'Arlington Hickory Hand Scraped Engineered Hardwood',
    priority: 'CRITICAL',
    sales: '$151K',
    growthVsLy: '↓ 36.4% vs LY',
    gm: '11.5%',
    dos: '9d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100898931',
    description: 'Drummond Hard Maple Smooth Solid Hardwood',
    priority: 'CRITICAL',
    sales: '$100.9K',
    growthVsLy: '↓ 36.8% vs LY',
    gm: '-9.5%',
    dos: '0d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100963354',
    description: 'Atrium Wire Brushed Solid Stranded Bamboo',
    priority: 'CRITICAL',
    sales: '$91.7K',
    growthVsLy: '↓ 59.5% vs LY',
    gm: '2.7%',
    dos: '6d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
  {
    productId: '100898832',
    description: 'Serafina Hard Maple Distressed Solid Hardwood',
    priority: 'CRITICAL',
    sales: '$91.1K',
    growthVsLy: '↓ 76.1% vs LY',
    gm: '6.3%',
    dos: '0d',
    why: 'Velocity; GM floor; GM trend; Returns',
  },
];
