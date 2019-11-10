import React from 'react';
import { connect } from 'dva';
import { Form, TreeSelect, Button, message } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { Dispatch } from 'redux';
import { ProductTypeDict, ProductCategotyDict, DictStateType } from '@/models/dict';
import { QueryType } from '@/pages/order/data';
import { Product } from '@/pages/product/data';
import { objToTree } from '@/utils/utils';
import styles from '@/pages/order/styles.less';

interface QueryProps extends FormComponentProps {
  dispatch?: Dispatch<any>;
  productType?: ProductTypeDict[];
  productCategoty?: ProductCategotyDict[];
  loading?: boolean;
  info: Partial<QueryType>;
  handleNext: (info: QueryType, products: Product[]) => void;
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
  productType: dict.productType,
  productCategoty: dict.productCategoty,
  loading: loading.effects['order/findProduct'],
}))
class Query extends React.Component<QueryProps> {

  handleSubmit = (e: any) => {
    const { handleNext, form, info } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        dispatch && dispatch({
          type: 'order/findProduct',
          payload: values,
          callback: (products: Product[]) => {
            if (products && products.length > 0) {
              handleNext({ ...info, ...values }, products);
            } else {
              message.error('没有查询到产品信息!');
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
      productType,
      productCategoty,
      loading,
    } = this.props;

    const typeTree = objToTree(
      { productTypeId: '', productTypeName: '父级节点' },
      (productType || [])
        .map(item => (item.parentTypeId ? item : { ...item, parentTypeId: '' })),
      'productTypeId',
      'parentTypeId',
      'productTypeName'
    ).children;

    const categotyTree = objToTree(
      { productCategoryId: '', productCategoryName: '父级节点' },
      (productCategoty || [])
        .map(item => item.parentCategoryId ? item : { ...item, parentCategoryId: '' }),
      'productCategoryId',
      'parentCategoryId',
      'productCategoryName'
    ).children;

    return (
      <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
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
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<QueryProps>()(Query);