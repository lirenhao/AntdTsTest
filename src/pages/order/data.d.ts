import { string } from "prop-types"

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface FeatureType {
  featureId: string;
  featurePrice: number;
  featureName: string;
}

export interface ProductType {
  productId: string;
  productName: string;
  productPrice: number;
  geoId: string;
  geoName: string;
  geoPrice: number;
  discountPrice: number;
  features: FeatureType[];
}

export interface OrderType {
  orderId: string;
  orderDate: string;
  instalmentTypeEnumId: string;
  renewalFeeStatusId: string;
  legalPartyGroupName: string;
  corpName: string;
  agreementTypeId: string;
  agreementCode: string;
  serviceCommission: number;
  grandTotal: number;
  products: ProductType[];
}

export interface OrderListData {
  list: OrderType[];
  pagination: Partial<Pagination>;
}

export interface OrderListParams {

}

export interface QueryType {
  productTypeId: string;
  productCategotyId: string
}

export interface DetailsType {
  productId: string;
  productName: string;
  geoId: string;
  geoName: string;
}