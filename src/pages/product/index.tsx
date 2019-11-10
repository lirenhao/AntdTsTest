import React from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Row, Col, Input, TreeSelect, Button, Divider, message } from 'antd';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { StateType } from './model';
import { DictStateType, ProductTypeDict } from '@/models/dict'
import { Product, ProductPrice, ProductListData } from './data';
import { objToTree } from '@/utils/utils';
import Create from './components/Create';
import Price from './components/Price';

import styles from './style.less';

interface ProductListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  productType: ProductTypeDict[];
  data: ProductListData;
  loading: boolean;
}

interface ProductListState {
  isCreateShow: boolean;
  isUpdateShow: boolean;
  isPriceShow: boolean;
  info: Partial<Product>;
  price: Partial<ProductPrice>;
}

@connect(({ product, dict, loading }: {
  product: StateType;
  dict: DictStateType;
  loading: {
    models: {
      [key: string]: boolean;
    };
  };
}) => ({
  data: product.data,
  productType: dict.productType,
  loading: loading.models.product,
}))
class ProductList extends React.Component<ProductListProps, ProductListState> {
  state: ProductListState = {
    isCreateShow: false,
    isUpdateShow: false,
    isPriceShow: false,
    info: {},
    price: {},
  };

  columns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
    },
    {
      title: '产品类型',
      dataIndex: 'productTypeId',
      render: (typeId: string) => {
        const { productType } = this.props;
        const data = productType
          .filter((item: ProductTypeDict) => item.productTypeId === typeId);
        return data && data[0] ? data[0].productTypeName : typeId;
      },
    },
    {
      title: '发布日期',
      dataIndex: 'releaseDate',
    },
    {
      title: '销售终止日期',
      dataIndex: 'salesDiscontinuationDate',
    },
    {
      title: '状态',
      dataIndex: 'statusId',
      render: (id: string) => (id === 'enable' ? '启用' : '暂停'),
    },
    {
      title: '操作',
      render: (_: any, record: Product) => (
        <React.Fragment>
          <a onClick={() => this.handleRemove(record)}>删除</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdate(record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handlePrice(record)}>价格</a>
        </React.Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'dict/getDict' });
    dispatch({
      type: 'product/find',
      payload: {},
    });
  }

  handleAddModal = (visible: boolean) => {
    this.setState({ isCreateShow: visible });
  };

  handleAddForm = (record: Product) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/save',
      payload: record,
      callback: () => this.handleAddModal(false),
    });
  };

  handleUpdateModal = (visible: boolean) => {
    this.setState({ isUpdateShow: visible });
  };

  handleUpdate = (record: Product) => {
    this.setState({ info: record });
    this.handleUpdateModal(true);
  };

  handleUpdateForm = (record: Product) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/update',
      payload: {
        id: record.productId,
        payload: record,
      },
      callback: () => this.handleUpdateModal(false),
    });
  };

  handleRemove = (record: Product) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/remove',
      payload: record.productId,
      callback: () => message.success('删除成功'),
    });
  };

  handlePriceModal = (visible: boolean) => {
    this.setState({ isPriceShow: visible });
  };

  handlePrice = (record: Product) => {
    const { dispatch } = this.props;
    const price = {
      productId: record.productId,
      statusId: 'enable',
      productPrice: 0.0,
      geoPrices: record.geoIds.map(geoId => ({
        geoId,
        geoPrice: 0.0,
        featurePrices: [
          ...record.fixFeatures.map(item => item.featureIds).reduce((a, b) => [...a, ...b], []),
          ...record.mustFeatures.map(item => item.featureIds).reduce((a, b) => [...a, ...b], []),
          ...record.optionFeatures.map(item => item.featureIds).reduce((a, b) => [...a, ...b], []),
        ].map(featureId => ({ featureId, featurePrice: 0.0 })),
      })),
    };
    dispatch({
      type: 'product/findPrice',
      payload: record.productId,
      callback: (productPrice: ProductPrice) => {
        this.setState({
          info: record,
          price: {
            ...price,
            ...productPrice,
          },
        });
        this.handlePriceModal(true);
      },
    });
  };

  handlePriceForm = (record: ProductPrice) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/savePrice',
      payload: { ...record },
      callback: (result: any) => {
        if (result) {
          message.success('保存成功');
          this.handlePriceModal(false);
        } else {
          message.success('保存失败');
        }
      },
    });
  };


  render() {
    const {
      loading,
      data: { list, pagination },
      form: { getFieldDecorator },
      productType,
    } = this.props;

    const { isCreateShow, isUpdateShow, isPriceShow, info, price } = this.state;

    const typeTree = objToTree(
      { productTypeId: '', productTypeName: '父级节点' },
      productType,
      'productTypeId',
      'parentTypeId',
      'productTypeName'
    ).children;

    return (
      <PageHeaderWrapper title="产品">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <Form.Item label="产品类型">
                      {getFieldDecorator('productTypeId')(
                        <TreeSelect
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          placeholder="请选择"
                          treeDefaultExpandAll
                          treeData={typeTree}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <Form.Item label="产品名称">
                      {getFieldDecorator('productName')(<Input placeholder="请输入" />)}
                    </Form.Item>
                  </Col>
                  <Col md={8} sm={24}>
                    <span className={styles.submitButtons}>
                      <Button type="primary" htmlType="submit">
                        查询
                      </Button>
                      <Button style={{ marginLeft: 8 }}>
                        重置
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleAddModal(true)}>
                新建
              </Button>
            </div>
            <Table
              loading={loading}
              dataSource={list}
              pagination={pagination}
              columns={this.columns}
              rowKey={record => record.productId}
            />
          </div>
        </Card>
        <Create
          title="新建产品"
          visible={isCreateShow}
          hideModal={() => this.handleAddModal(false)}
          handleFormSubmit={this.handleAddForm}
          info={{}}
        />
        <Create
          title="编辑产品"
          visible={isUpdateShow}
          hideModal={() => this.handleUpdateModal(false)}
          handleFormSubmit={this.handleUpdateForm}
          info={info}
        />
        <Price
          title="产品价格"
          visible={isPriceShow}
          hideModal={() => this.handlePriceModal(false)}
          handleFormSubmit={this.handlePriceForm}
          product={info}
          info={price}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<ProductListProps>()(ProductList);
