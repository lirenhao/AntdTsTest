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

const Details: React.FC<DetailsProps> = props => {

  const [product, setProduct] = React.useState<Partial<Product>>({});

  const { dispatch, geo, form, productInfos, info, handlePrev, handleNext, loading } = props;

  if (product.productId !== info.productId)
    setProduct(productInfos
      .filter((item: Product) => item.productId === info.productId)[0] || {});

  const productChange = (productId: string) => {
    form.setFieldsValue({
      geoId: undefined,
    });
    setProduct(productInfos.filter(item => item.productId === productId)[0] || {});
  };

  const getGeoName = (geoId: string) => {
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
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
                  geoName: getGeoName(values.geoId),
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

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };
  const { getFieldDecorator } = form;

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
            onChange={productChange}
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
                  {getGeoName(id)}
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
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          下一步
        </Button>
        <Button onClick={handlePrev} style={{ marginLeft: 8 }}>
          上一步
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create<DetailsProps>()(
  connect(({ dict, loading }: {
    dict: DictStateType;
    loading: { effects: { [key: string]: boolean; } }
  }) => ({
    geo: dict.geo,
    loading: loading.effects['order/findPrice'],
  }))(Details)
);
