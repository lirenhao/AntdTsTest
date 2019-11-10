export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface ProductFeature {
  featureTypeId: string;
  featureIds: string[];
  isExclusive: '0' | '1';
}

export interface Product {
  productId: string;
  productName: string;
  productTypeId: string;
  productCategotyId: string;
  statusId: 'enable' | 'disable';
  geoIds: string[];
  fixFeatures: ProductFeature[];
  mustFeatures: ProductFeature[];
  optionFeatures: ProductFeature[];
  releaseDate: Date;
  salesDiscontinuationDate: Date
}

export interface ProductListData {
  list: Product[];
  pagination: Partial<Pagination>;
}

export interface ProductListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface FeaturePrice {
  featureId: string;
  featurePrice: number;
}

export interface GeoPrice {
  geoId: string;
  geoPrice: number;
  featurePrices: FeaturePrice[];
}

export interface ProductPrice {
  productId: string;
  statusId: 'enable' | 'disable';
  productPrice: number;
  geoPrices: GeoPrice[];
}
