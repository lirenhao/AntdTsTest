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

interface PrdouctsState {
  isCreateShow: boolean;
  isUpdateShow: boolean;
  products: ProductType[];
  info: Partial<ProductType>;
  productInfo: Partial<Product>;
  productPrice: Partial<ProductPrice>;
}

@connect(({ loading }: {
  loading: { effects: { [key: string]: boolean } };
}) => ({
  loading: loading.effects['order/findProductPrice'],
}))
class Products extends React.Component<ProductsProps, PrdouctsState> {
  columns = [
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
          <a onClick={() => this.handleRemove(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdate(record)}>修改</a>
        </React.Fragment>
      ),
    },
  ];

  constructor(props: ProductsProps) {
    super(props);
    this.state = {
      isCreateShow: false,
      isUpdateShow: false,
      products: props.products || [],
      info: {},
      productInfo: {},
      productPrice: {},
    };
  }

  handleAddModal = (visible: boolean) => {
    this.setState({ isCreateShow: visible });
  };

  handleAddForm = (record: ProductType) => {
    const { products } = this.state;
    this.setState({ products: [...products, record] });
    this.handleAddModal(false);
  };

  handleUpdateModal = (visible: boolean) => {
    this.setState({ isUpdateShow: visible });
  };

  handleUpdate = (record: ProductType) => {
    const { dispatch } = this.props;
    dispatch && dispatch({
      type: 'order/findProductPrice',
      payload: record.productId,
      callback: (resp: {
        productInfo: Product;
        productPrice: ProductPrice;
      }) => {
        if (resp) {
          this.setState({
            info: record,
            productInfo: resp.productInfo,
            productPrice: resp.productPrice,
          });
          this.handleUpdateModal(true);
        }
      },
    });
  };

  handleUpdateForm = (record: ProductType) => {
    const { products } = this.state;
    this.setState({
      products: products.map((item: ProductType) =>
        item.productId === record.productId ? { ...item, ...record } : item
      ),
    });
    this.handleUpdateModal(false);
  };

  handleRemove = (record: ProductType) => {
    const { products } = this.state;
    this.setState({
      products: products.filter((item: ProductType) => item.productId !== record.productId),
    });
  };

  expandedRowRender = (record: ProductType) => {
    const columns = [
      { title: '属性', dataIndex: 'featureName', key: 'featureId' },
      { title: '属性价格', dataIndex: 'featurePrice', key: 'featurePrice' },
    ];
    return (
      <Table columns={columns} rowKey="featureId" dataSource={record.features} pagination={false} />
    );
  };

  render() {
    const { loading, handleNext } = this.props;
    const { isCreateShow, isUpdateShow, products, info, productInfo, productPrice } = this.state;

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
            extra={<a onClick={() => this.handleAddModal(true)}>添加</a>}
          >
            <Table
              loading={loading}
              columns={this.columns}
              dataSource={products}
              rowKey="productId"
              pagination={false}
              expandedRowRender={this.expandedRowRender}
            />
            <Create
              visible={isCreateShow}
              hideModal={() => this.handleAddModal(false)}
              handleFormSubmit={this.handleAddForm}
              info={{}}
            />
            <Update
              visible={isUpdateShow}
              hideModal={() => this.handleUpdateModal(false)}
              handleFormSubmit={this.handleUpdateForm}
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
}

export default Products;
