import React from 'react';
import { Form, Radio, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Product, ProductPrice } from '../../data';
import GeoPrices from './GeoPrices';

interface CreateProps extends FormComponentProps {
  product: Product;
  info: ProductPrice;
}

interface CreateState { }

class Create extends React.PureComponent<CreateProps, CreateState> {
  render() {
    const { form: { getFieldDecorator }, product, info } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: { span: 22 },
      },
    };

    return (
      <React.Fragment>
        <Form.Item {...formItemLayout} label="价格状态">
          {getFieldDecorator('statusId', {
            initialValue: info.statusId,
            rules: [
              {
                required: true,
                message: '请选择价格状态',
              },
            ],
          })(
            <Radio.Group>
              <Radio value="enable">启用</Radio>
              <Radio value="disable">暂停</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="产品价格">
          {getFieldDecorator('productPrice', {
            initialValue: info.productPrice,
            rules: [
              {
                required: true,
                message: '请输入产品价格',
              },
              {
                pattern: /^(\d+)((?:\.\d{1,2})?)$/,
                message: '请输入合法金额数字',
              },
            ],
          })(
            <Input
              placeholder="请输入产品价格"
              style={{ width: 200 }}
              prefix="￥"
              suffix="RMB"
            />,
          )}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区域价格">
          {getFieldDecorator('geoPrices', {
            initialValue: info.geoPrices,
            rules: [
              {
                required: true,
                message: '请输入区域价格',
              },
            ],
          })(<GeoPrices product={product} />)}
        </Form.Item>
      </React.Fragment>
    );
  }
}

export default Create;
