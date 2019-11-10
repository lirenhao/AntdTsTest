import { Effect } from 'dva';
import { Reducer } from 'redux';

import { OrderListData } from './data';
import {
  queryProduct,
  queryPrice,
  findProductPrice,
  findOrder,
  save,
  update,
  remove,
} from './service';

export interface StateType {
  data: OrderListData
}

export interface OrderModelType {
  namespace: string;
  state: StateType;
  effects: {
    findProduct: Effect;
    findPrice: Effect;
    findProductPrice: Effect;
    find: Effect;
    save: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    setData: Reducer<StateType>;
  };
}

const Model: OrderModelType = {
  namespace: 'order',

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
    *findProduct({ payload, callback }, { call }) {
      const response = yield call(queryProduct, payload);
      if (callback) callback(response);
    },
    *findPrice({ payload, callback }, { call }) {
      const response = yield call(queryPrice, payload);
      if (callback) callback(response);
    },
    *findProductPrice({ payload, callback }, { call }) {
      const response = yield call(findProductPrice, payload);
      if (callback) callback(response);
    },
    *find({ payload }, { call, put }) {
      const response = yield call(findOrder, payload);
      yield put({
        type: 'setData',
        payload: response,
      });
    },
    *save({ payload, callback }, { call, put }) {
      const response = yield call(save, payload);
      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { key, payload: params } = payload;
      const response = yield call(update, key, params);
      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(remove, payload);
      const response = yield call(findOrder, payload);
      yield put({
        type: 'setData',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    setData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;