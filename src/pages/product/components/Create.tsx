import React from 'react';
import { connect } from 'dva';
import { Drawer, Form, Input, TreeSelect, DatePicker, Radio, Checkbox, Row, Col, Button } from 'antd';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { DictStateType, ProductTypeDict, ProductCategotyDict, GeoDict } from '@/models/dict'
import { Product } from '../data';
import { objToTree } from '@/utils/utils';
import moment from 'moment';
import Feature from './Feature';

interface CreateProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  productType?: ProductTypeDict[];
  productCategoty?: ProductCategotyDict[];
  geo?: GeoDict[];
  loading?: boolean;
  title: string;
  info: Partial<Product>;
  visible: boolean;
  hideModal(e: any): void;
  handleFormSubmit(e: any): void;
}

interface CreateState {
  productId?: string;
  limit: {
    featureTypeIds: string[];
    featureIds: string[];
  };
}

@connect(({ dict, loading }: {
  dict: DictStateType;
  loading: {
    models: {
      [key: string]: boolean;
    };
  };
}) => ({
  productType: dict.productType,
  productCategoty: dict.productCategoty,
  geo: dict.geo,
  loading: loading.models.product,
}))
class Create extends React.Component<CreateProps, CreateState> {

  constructor(props: CreateProps) {
    super(props);
    this.state = {
      productId: props.info.productId,
      limit: {
        featureIds: [],
        featureTypeIds: [],
      }
    }
  }

  static getDerivedStateFromProps(nextProps: CreateProps, prevState: CreateState) {
    if (nextProps.info.productId === prevState.productId) {
      return null;
    }
    const fixFeatures = nextProps.info.fixFeatures || [];
    const mustFeatures = nextProps.info.mustFeatures || [];
    const optionFeatures = nextProps.info.optionFeatures || [];
    const featureTypeIds = [
      ...fixFeatures.map(item => item.featureTypeId),
      ...mustFeatures.map(item => item.featureTypeId),
      ...optionFeatures.map(item => item.featureTypeId),
    ];
    const featureIds = [
      ...fixFeatures.map(item => item.featureIds).reduce((a, b) => [...a, ...b], []),
      ...mustFeatures.map(item => item.featureIds).reduce((a, b) => [...a, ...b], []),
      ...optionFeatures.map(item => item.featureIds).reduce((a, b) => [...a, ...b], []),
    ];
    return {
      limit: {
        featureTypeIds,
        featureIds,
      },
      info: nextProps.info,
    };
  }

  handleSubmit = (e: any) => {
    const { handleFormSubmit, form, info } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleFormSubmit({
          ...info,
          ...values,
          releaseDate: values.releaseDate.format('YYYY-MM-DD'),
          salesDiscontinuationDate: values.salesDiscontinuationDate.format('YYYY-MM-DD'),
        });
        form.resetFields();
      }
    });
  };

  setLimit = (value: {
    featureTypeIds: string[];
    featureIds: string[];
  }) => {
    const { limit } = this.state;
    this.setState({
      limit: {
        ...limit,
        ...value,
      },
    });
  };

  render() {
    const {
      title,
      form: { getFieldDecorator },
      info,
      visible,
      hideModal,
      productType,
      productCategoty,
      geo,
      loading,
    } = this.props;

    const { limit } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const typeTree = objToTree(
      { productTypeId: '', productTypeName: '父级节点' },
      (productType || []).map(item => (item.parentTypeId ? item : { ...item, parentTypeId: '' })),
      'productTypeId',
      'parentTypeId',
      'productTypeName'
    ).children;

    const categotyTree = objToTree(
      { productCategoryId: '', productCategoryName: '父级节点' },
      (productCategoty || []).map(item =>
        item.parentCategoryId ? item : { ...item, parentCategoryId: '' }
      ),
      'productCategoryId',
      'parentCategoryId',
      'productCategoryName'
    ).children;

    return (
      <Drawer
        title={title}
        width="70%"
        destroyOnClose
        maskClosable={false}
        visible={visible}
        onClose={hideModal}
      >
        <Form>
          <Form.Item {...formItemLayout} label="产品名称">
            {getFieldDecorator('productName', {
              initialValue: info.productName,
              rules: [
                {
                  required: true,
                  message: '请输入产品名称',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="产品类型">
            {getFieldDecorator('productTypeId', {
              initialValue: info.productTypeId,
              rules: [
                {
                  required: true,
                  message: '请选择产品类型',
                },
              ],
            })(
              <TreeSelect
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                placeholder="请选择"
                treeDefaultExpandAll
                treeData={typeTree}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="发布日期">
            {getFieldDecorator('releaseDate', {
              initialValue: moment(info.releaseDate),
              rules: [
                {
                  required: true,
                  message: '请选择发布日期',
                },
              ],
            })(
              <DatePicker
                style={{
                  width: '100%',
                }}
                placeholder="选择发布日期"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="销售终止日期">
            {getFieldDecorator('salesDiscontinuationDate', {
              initialValue: moment(info.salesDiscontinuationDate),
              rules: [
                {
                  required: true,
                  message: '请选择销售终止日期',
                },
              ],
            })(
              <DatePicker
                style={{
                  width: '100%',
                }}
                placeholder="选择销售终止日期"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="产品状态">
            {getFieldDecorator('statusId', {
              initialValue: info.statusId,
              rules: [
                {
                  required: true,
                  message: '请选择产品状态',
                },
              ],
            })(
              <Radio.Group>
                <Radio value="enable">启用</Radio>
                <Radio value="disable">暂停</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="产品类别">
            {getFieldDecorator('productCategotyId', {
              initialValue: info.productCategotyId,
              rules: [{ required: true, message: '请选择产品类别' }],
            })(
              <TreeSelect
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                placeholder="请选择"
                treeDefaultExpandAll
                treeData={categotyTree}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="区域属性">
            {getFieldDecorator('geoIds', {
              initialValue: info.geoIds,
              rules: [{ required: true, message: '请选择区域属性' }],
            })(
              <Checkbox.Group>
                <Row>
                  {(geo || []).map(item => (
                    <Col span={8} key={item.geoId}>
                      <Checkbox value={item.geoId}>{item.geoName}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="固定属性">
            {getFieldDecorator('fixFeatures', {
              initialValue: info.fixFeatures,
              rules: [
                {
                  required: true,
                  message: '请添加固定属性',
                },
              ],
            })(
              <Feature
                title="固定属性"
                label="fixFeatures"
                limit={limit}
                setLimit={this.setLimit}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="必选属性">
            {getFieldDecorator('mustFeatures', {
              initialValue: info.mustFeatures,
              rules: [
                {
                  required: true,
                  message: '请添加必选属性',
                },
              ],
            })(
              <Feature
                title="必选属性"
                label="mustFeatures"
                limit={limit}
                setLimit={this.setLimit}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="可选属性">
            {getFieldDecorator('optionFeatures', {
              initialValue: info.optionFeatures,
              rules: [
                {
                  required: true,
                  message: '请添加可选属性',
                },
              ],
            })(
              <Feature
                title="可选属性"
                label="optionFeatures"
                limit={limit}
                setLimit={this.setLimit}
              />
            )}
          </Form.Item>
        </Form>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            textAlign: 'right',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button
            style={{
              marginRight: 8,
            }}
            onClick={hideModal}
          >
            取消
          </Button>
          <Button onClick={this.handleSubmit} type="primary" loading={loading}>
            提交
          </Button>
        </div>
      </Drawer>
    );
  }
}

export default Form.create<CreateProps>()(Create);
