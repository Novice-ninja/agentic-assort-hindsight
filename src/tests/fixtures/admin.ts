import type {
  AdminFilterContext,
  AdminLocation,
  AdminProduct,
  FilterFacetOption,
  GlobalException,
  ModuleStatusSummary,
} from '@modules/admin/types';

export const defaultFilterContext: AdminFilterContext = {
  departments: ['apparel', 'footwear'],
  seasons: ['spring-2026'],
  regions: ['north-america', 'emea'],
};

export const moduleStatusFixtures: ModuleStatusSummary[] = [
  { module: 'products', status: 'active' },
  { module: 'locations', status: 'done' },
  { module: 'calendar', status: 'inProgress' },
  { module: 'exceptions', status: 'active' },
];

export const facetFixtures: FilterFacetOption[] = [
  { id: 'dept-apparel', labelKey: 'admin.facets.dept.apparel', facet: 'department' },
  { id: 'dept-footwear', labelKey: 'admin.facets.dept.footwear', facet: 'department' },
  { id: 'sub-mens-tops', labelKey: 'admin.facets.subDept.mensTops', facet: 'subDepartment', parentId: 'dept-apparel' },
  { id: 'sub-womens-tops', labelKey: 'admin.facets.subDept.womensTops', facet: 'subDepartment', parentId: 'dept-apparel' },
  { id: 'cat-tops', labelKey: 'admin.facets.category.tops', facet: 'category', parentId: 'sub-womens-tops' },
  { id: 'subcat-tees', labelKey: 'admin.facets.subCategory.tees', facet: 'subCategory', parentId: 'cat-tops' },
  { id: 'class-tees', labelKey: 'admin.facets.class.tees', facet: 'class', parentId: 'subcat-tees' },
  { id: 'subclass-basic', labelKey: 'admin.facets.subClass.basic', facet: 'subClass', parentId: 'class-tees' },
  { id: 'brand-own', labelKey: 'admin.facets.brand.ownLabel', facet: 'brand' },
  { id: 'season-spring-2026', labelKey: 'admin.facets.season.spring2026', facet: 'season' },
  { id: 'region-na', labelKey: 'admin.facets.region.northAmerica', facet: 'region' },
  { id: 'region-emea', labelKey: 'admin.facets.region.emea', facet: 'region' },
  { id: 'pg-all', labelKey: 'admin.facets.productGroup.all', facet: 'productGroup' },
];

export const productFixtures: AdminProduct[] = [
  { styleColourId: 'WT001', name: 'Essential Slim Tee', dept: 'W. Tops', class: 'T-Shirts', brand: 'Own Label', colour: { label: 'Black', hex: '#1a1a1a' }, collar: 'Round Neck', fit: 'Slim', sleeve: 'Short', lengthCode: 'REG' },
  { styleColourId: 'WT002', name: 'Essential Slim Tee', dept: 'W. Tops', class: 'T-Shirts', brand: 'Own Label', colour: { label: 'White', hex: '#f5f5f5' }, collar: 'Round Neck', fit: 'Slim', sleeve: 'Short', lengthCode: 'REG' },
  { styleColourId: 'BL002', name: 'Silk Blend Blouse', dept: 'W. Tops', class: 'Blouses', brand: 'Own Label', colour: { label: 'Camel', hex: '#c19a6b' }, collar: 'Collar', fit: 'Relaxed', sleeve: 'Long', lengthCode: 'REG' },
  { styleColourId: 'JN003', name: 'High Rise Jean', dept: 'W. Bottoms', class: 'Jeans', brand: 'Own Label', colour: { label: 'Indigo', hex: '#3d5a80' }, collar: null, fit: 'Wide Leg', sleeve: undefined, lengthCode: 'L32' },
  { styleColourId: 'TR004', name: 'Tailored Trouser', dept: 'W. Bottoms', class: 'Trousers', brand: 'Own Label', colour: { label: 'Black', hex: '#1a1a1a' }, collar: null, fit: 'Tailored', sleeve: undefined, lengthCode: 'L30' },
  { styleColourId: 'DR005', name: 'Midi Shirt Dress', dept: 'W. Dresses', class: 'Shirt Dresses', brand: 'Own Label', colour: { label: 'Burgundy', hex: '#800020' }, collar: 'Collar', fit: 'Relaxed', sleeve: 'Short', lengthCode: 'MID' },
  { styleColourId: 'KN006', name: 'Cashmere Crew', dept: 'W. Tops', class: 'Knitwear', brand: 'Own Label', colour: { label: 'Forest Green', hex: '#228b22' }, collar: 'Round Neck', fit: 'Relaxed', sleeve: 'Long', lengthCode: 'REG' },
  { styleColourId: 'MB007', name: 'Chino Short', dept: 'M. Bottoms', class: 'Shorts', brand: 'Own Label', colour: { label: 'Camel', hex: '#c19a6b' }, collar: null, fit: 'Straight', sleeve: undefined, lengthCode: 'S8' },
];

export const locationFixtures: AdminLocation[] = [
  { id: 'S001', name: 'Mayfair', city: 'London', lat: 51.5074, lon: -0.1527, climate: 'temperate', customerType: 'premium', fulfillmentType: 'storePickUp', incomeLevel: 'high', locationType: 'store' },
  { id: 'S002', name: 'Covent Garden', city: 'London', lat: 51.5123, lon: -0.1229, climate: 'temperate', customerType: 'mainstream', fulfillmentType: 'storePickUp', incomeLevel: 'middle', locationType: 'store' },
  { id: 'S003', name: 'Oxford Street', city: 'London', lat: 51.5154, lon: -0.1419, climate: 'temperate', customerType: 'conservative', fulfillmentType: 'storePickUp', incomeLevel: 'high', locationType: 'store' },
  { id: 'S004', name: 'Westfield London', city: 'London', lat: 51.5076, lon: -0.2201, climate: 'temperate', customerType: 'value', fulfillmentType: 'storePickUp', incomeLevel: 'middle', locationType: 'outlet' },
  { id: 'S005', name: 'Canary Wharf', city: 'London', lat: 51.5054, lon: -0.0235, climate: 'temperate', customerType: 'premium', fulfillmentType: 'storePickUp', incomeLevel: 'high', locationType: 'store' },
  { id: 'S006', name: 'Fifth Avenue', city: 'New York', lat: 40.7614, lon: -73.9776, climate: 'cold', customerType: 'premium', fulfillmentType: 'storePickUp', incomeLevel: 'high', locationType: 'store' },
  { id: 'S007', name: 'Michigan Ave', city: 'Chicago', lat: 41.8919, lon: -87.6244, climate: 'cold', customerType: 'mainstream', fulfillmentType: 'storePickUp', incomeLevel: 'middle', locationType: 'store' },
  { id: 'S008', name: 'Champs-Élysées', city: 'Paris', lat: 48.8698, lon: 2.3078, climate: 'temperate', customerType: 'premium', fulfillmentType: 'storePickUp', incomeLevel: 'high', locationType: 'store' },
];

export const exceptionFixtures: GlobalException[] = [
  {
    id: 'E001',
    title: 'India — material & category',
    geography: { name: 'India', lat: 20.5937, lon: 78.9629 },
    type: 'Rule',
    customerType: 'premium',
    rules: [
      { id: 'r1', attribute: 'Material', operator: 'equals', value: 'Leather' },
      { id: 'r2', attribute: 'Category', operator: 'equals', value: 'Beef & beef-derived' },
    ],
    addedOn: '2024-03-12',
    addedBy: 'Priya Mehta',
  },
  {
    id: 'E002',
    title: 'EU — vendor compliance',
    geography: { name: 'EU', lat: 50.8503, lon: 4.3517 },
    type: 'Rule',
    customerType: 'mainstream',
    rules: [{ id: 'r1', attribute: 'Vendor', operator: 'equals', value: 'Certified' }],
    addedOn: '2024-02-01',
    addedBy: 'Anna Schmidt',
  },
  {
    id: 'E003',
    title: 'USA — labor standards',
    geography: { name: 'USA', lat: 38.9072, lon: -77.0369 },
    type: 'Rule',
    customerType: 'conservative',
    rules: [{ id: 'r1', attribute: 'Labor', operator: 'equals', value: 'Fair Trade' }],
    addedOn: '2024-01-15',
    addedBy: 'John Smith',
  },
  {
    id: 'E004',
    title: 'China — IP protection',
    geography: { name: 'China', lat: 39.9042, lon: 116.4074 },
    type: 'Rule',
    customerType: 'value',
    rules: [{ id: 'r1', attribute: 'IP', operator: 'equals', value: 'Protected' }],
    addedOn: '2024-04-20',
    addedBy: 'Li Wei',
  },
  {
    id: 'E005',
    title: 'UK — health & safety',
    geography: { name: 'UK', lat: 51.5074, lon: -0.1278 },
    type: 'Rule',
    customerType: 'premium',
    rules: [{ id: 'r1', attribute: 'Safety', operator: 'equals', value: 'Compliant' }],
    addedOn: '2024-05-10',
    addedBy: 'James Brown',
  },
];
