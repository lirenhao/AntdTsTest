import React from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button } from 'antd';
import { Dispatch } from 'redux';
import { Product, ProductPrice } from '@/pages/product/data';
import { ProductType } from '../../data';

import Create from './Create';
import Update from './Update';

interface ProductsProps {
  dispatch?: Dispatch<any>;
  loading?: boolean;
  products: ProductType[];
  handleNext: (products: ProductType[]) => void;
}

const Products: React.FC<ProductsProps> = props => {

  const [isCreateShow, setIsCreateShow] = React.useState<boolean>(false);
  const [isUpdateShow, setIsUpdateShow] = React.useState<boolean>(false);
  const [products, setProducts] = React.useState<ProductType[]>(props.products || []);
  const [info, setInfo] = React.useState<Partial<ProductType>>({});
  const [productInfo, setProductInfo] = React.useState<Partial<Product>>({});
  const [productPrice, setProductPrice] = React.useState<Partial<ProductPrice>>({});

  const { dispatch, handleNext, loading } = props;

  const handleAddModal = (visible: boolean) => {
    setIsCreateShow(visible);
  };

  const handleAddForm = (record: ProductType) => {
    setProducts([...products, record]);
    handleAddModal(false);
  };

  const handleUpdateModal = (visible: boolean) => {
    setIsUpdateShow(visible);
  };

  const handleUpdate = (record: ProductType) => {
    dispatch && dispatch({
      type: 'order/findProductPrice',
      payload: record.productId,
      callback: (resp: {
        productInfo: Product;
        productPrice: ProductPrice;
      }) => {
        if (resp) {
          setInfo(record);
          setProductInfo(resp.productInfo);
          setProductPrice(resp.productPrice);
          handleUpdateModal(true);
        }
      },
    });
  };

  const handleUpdateForm = (record: ProductType) => {
    setProducts(products.map((item: ProductType) =>
      item.productId === record.productId ? { ...item, ...record } : item
    ));
    handleUpdateModal(false);
  };

  const handleRemove = (record: ProductType) => {
    setProducts(products.filter((item: ProductType) => item.productId !== record.productId));
  };

  const expandedRowRender = (record: ProductType) => {
    const columns = [
      { title: '属性', dataIndex: 'featureName', key: 'featureId' },
      { title: '属性价格', dataIndex: 'featurePrice', key: 'featurePrice' },
    ];
    return (
      <Table columns={columns} rowKey="featureId" dataSource={record.features} pagination={false} />
    );
  };

  const columns = [
    { title: '产品', dataIndex: 'productName', key: 'productId' },
    { title: '产品金额', dataIndex: 'productPrice', key: 'productPrice' },
    { title: '区域', dataIndex: 'geoName', key: 'geoId' },
    { title: '区域价格', dataIndex: 'geoPrice', key: 'geoPrice' },
    { title: '优惠价格', dataIndex: 'discountPrice', key: 'discountPrice' },
    {
      title: '合计价格',
      render: (_: string, record: ProductType) => {
        const featurePrice = record.features
          .map(item => item.featurePrice)
          .reduce((a: number, b: number) => a + b, 0);
        return (record.productPrice + record.geoPrice + featurePrice - record.discountPrice);
      },
    },
    {
      title: '操作',
      render: (_: string, record: ProductType) => (
        <React.Fragment>
          <a onClick={() => handleRemove(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdate(record)}>修改</a>
        </React.Fragment>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div
        style={{
          marginTop: '16px',
          border: '1px dashed #e9e9e9',
          borderRadius: '6px',
          backgroundColor: '#fafafa',
          minHeight: '200px',
          textAlign: 'center',
        }}
      >
        <Card
          title="已选服务"
          bordered={false}
          extra={<a onClick={() => handleAddModal(true)}>添加</a>}
        >
          <Table
            loading={loading}
            columns={columns}
            dataSource={products}
            rowKey="productId"
            pagination={false}
            expandedRowRender={expandedRowRender}
          />
          <Create
            visible={isCreateShow}
            hideModal={() => handleAddModal(false)}
            handleFormSubmit={handleAddForm}
            info={{}}
          />
          <Update
            visible={isUpdateShow}
            hideModal={() => handleUpdateModal(false)}
            handleFormSubmit={handleUpdateForm}
            info={info || {}}
            productInfo={productInfo || {}}
            productPrice={productPrice || {}}
          />
        </Card>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Button type="primary" onClick={() => handleNext(products)}>
          下一步
        </Button>
      </div>
    </React.Fragment>
  );
}

export default connect(({ loading }: {
  loading: { effects: { [key: string]: boolean } };
}) => ({
  loading: loading.effects['order/findProductPrice'],
}))(Products);
