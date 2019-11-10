import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query } from '@/services/dict';

export interface ProductTypeDict {
  productTypeId: string;
  productTypeName: string;
  parentTypeId?: string;
}

export interface ProductCategotyDict {
  productCategoryId: string;
  productCategoryName: string;
  parentCategoryId?: string;
}

export interface GeoDict {
  geoId: string;
  geoName: string;
}

export interface ProductFeatureTypeDict {
  productFeatureTypeId: string;
  productFeatureTypeName: string;
}

export interface ProductFeatureDict {
  productFeatureId: string;
  productFeatureTypeId: string;
  productFeatureName: string;
}

export interface DictStateType {
  productType: ProductTypeDict[];
  productCategoty: ProductCategotyDict[];
  geo: GeoDict[];
  productFeatureType: ProductFeatureTypeDict[];
  productFeature: ProductFeatureDict[];
}

export interface DictModelType {
  namespace: string;
  state: DictStateType;
  effects: {
    getDict: Effect;
  };
  reducers: {
    initDict: Reducer<DictStateType>;
  };
}

const Model: DictModelType = {
  namespace: 'dict',

  state: {
    productType: [],
    productCategoty: [],
    geo: [],
    productFeatureType: [],
    productFeature: [],
  },

  effects: {
    *getDict({ payload }, { call, put }) {
      const response = yield call(query);
      yield put({
        type: 'initDict',
        payload: response,
      });
    },
  },

  reducers: {
    initDict(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;