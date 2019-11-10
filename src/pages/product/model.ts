import { Effect } from 'dva';
import { Reducer } from 'redux';

import { ProductListData } from './data';
import * as service from './service';

export interface StateType {
  data: ProductListData
}

export interface ProductModelType {
  namespace: string;
  state: StateType;
  effects: {
    find: Effect;
    save: Effect;
    update: Effect;
    remove: Effect;
    findPrice: Effect;
    savePrice: Effect;
  };
  reducers: {
    setData: Reducer<StateType>;
  };
}

const Model: ProductModelType = {
  namespace: 'product',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 0,
        current: 0
      }
    },
  },

  effects: {
    *find({ payload }, { call, put }) {
      const response = yield call(service.queryProduct, payload);
      yield put({
        type: 'setData',
        payload: response,
      });
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(service.saveProduct, payload);
      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { id, payload: params } = payload;
      const response = yield call(service.updateProduct, id, params);
      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(service.removeProduct, payload);
      const response = yield call(service.queryProduct, {});
      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback();
    },
    *findPrice({ payload, callback }, { call }) {
      const response = yield call(service.queryPrice, payload);
      if (callback) callback(response);
    },
    *savePrice({ payload, callback }, { call }) {
      const response = yield call(service.savePrice, payload.productId, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
  },
};

export default Model;