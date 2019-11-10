import React from 'react';
import { connect } from 'dva';
import { Form, Button, Select, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { DictStateType, GeoDict } from '@/models/dict';
import { Product, ProductPrice } from '@/pages/product/data';
import { ProductType } from '../../data';
import styles from '@/pages/order/styles.less';

interface DetailsProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  geo?: GeoDict[];
  loading?: boolean;
  productInfos: Product[];
  info: Partial<ProductType>;
  handleNext(v: any, productPrice: ProductPrice): void;
  handlePrev(): void;
}

interface DetailsState {
  product: Product
}

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ dict, loading }: {
  dict: DictStateType;
  loading: { effects: { [key: string]: boolean; } }
}) => ({
  geo: dict.geo,
  loading: loading.effects['order/findPrice'],
}))
class Details extends React.PureComponent<DetailsProps, DetailsState> {
  constructor(props: DetailsProps) {
    super(props);
    const product = props.productInfos
      .filter((item: Product) => item.productId === props.info.productId)[0] || {};
    this.state = {
      product,
    };
  }

  productChange = (productId: string) => {
    const { form, productInfos } = this.props;
    form.setFieldsValue({
      geoId: undefined,
    });
    this.setState({
      product: productInfos.filter(item => item.productId === productId)[0] || {},
    });
  };

  getGeoName = (geoId: string) => {
    const { geo } = this.props;
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  handleSubmit = (e: any) => {
    const { handleNext, form } = this.props;
    const { product } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch && dispatch({
          type: 'order/findPrice',
          payload: values,
          callback: (productPrice: ProductPrice) => {
            if (productPrice) {
              handleNext(
                {
                  productId: values.productId,
                  productName: product.productName,
                  geoId: values.geoId,
                  geoName: this.getGeoName(values.geoId),
                },
                productPrice
              );
            } else {
              message.error('没有查询到产品价格!');
            }
          },
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      info,
      productInfos,
      handlePrev,
      loading,
    } = this.props;
    const { product } = this.state;

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Form.Item {...formItemLayout} label="产品">
          {getFieldDecorator('productId', {
            initialValue: info.productId,
            rules: [
              {
                required: true,
                message: '请选择产品',
              },
            ],
          })(
            <Select
              placeholder="请选择产品"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              dropdownMatchSelectWidth={false}
              onChange={this.productChange}
            >
              {productInfos.map(item => (
                <Select.Option key={item.productId} value={item.productId}>
                  {item.productName}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区域">
          {getFieldDecorator('geoId', {
            initialValue: info.geoId,
            rules: [
              {
                required: true,
                message: '请选择区域',
              },
            ],
          })(
            <Select
              placeholder="请选择区域"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              dropdownMatchSelectWidth={false}
            >
              {product.geoIds &&
                product.geoIds.map(id => (
                  <Select.Option key={id} value={id}>
                    {this.getGeoName(id)}
                  </Select.Option>
                ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="primary" onClick={this.handleSubmit} loading={loading}>
            下一步
          </Button>
          <Button onClick={handlePrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<DetailsProps>()(Details);
