import React from 'react';
import { connect } from 'dva';
import { Input, Form } from 'antd';
import { DictStateType, ProductFeatureDict } from '@/models/dict'
import { FeaturePrice } from '@/pages/product/data';

interface PriceProps {
  productFeature?: ProductFeatureDict[];
  value: FeaturePrice;
  onChange: (value: FeaturePrice) => void;
}

interface PriceState { }

@connect(({ dict }: { dict: DictStateType }) => ({
  productFeature: dict.productFeature,
}))
class Price extends React.Component<PriceProps, PriceState> {

  getFeatureName = (id: string) => {
    const { productFeature } = this.props;
    const list = (productFeature || [])
      .filter(item => item.productFeatureId === id);
    return list.length > 0 ? list[0].productFeatureName : id;
  };

  featurePriceChange = (e: {
    target: {
      value: string
    }
  }) => {
    const featurePrice = e.target.value;
    const pattern = /^(\d+)((?:\.\d{1,2})?)$/;
    if (pattern.test(featurePrice)) {
      const { value, onChange } = this.props;
      if (onChange) {
        onChange({ ...value, featurePrice: parseFloat(featurePrice) });
      }
    }
  };

  render() {
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
    const { value } = this.props;

    return (
      <React.Fragment>
        <Form.Item
          {...formItemLayout}
          label={`${this.getFeatureName(value.featureId)}价格`}
          help={() => { }}
        >
          <Input
            style={{ width: 200 }}
            prefix="￥"
            suffix="RMB"
            onChange={this.featurePriceChange}
            value={value.featurePrice}
          />
        </Form.Item>
      </React.Fragment>
    );
  }
}

export default Price;