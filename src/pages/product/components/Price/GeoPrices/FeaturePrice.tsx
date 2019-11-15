import React from 'react';
import { connect } from 'dva';
import { Input, Form } from 'antd';
import { DictStateType, ProductFeatureDict } from '@/models/dict'
import { FeaturePrice } from '@/pages/product/data';

interface FeaturePriceCompProps {
  productFeature?: ProductFeatureDict[];
  value: FeaturePrice;
  onChange: (value: FeaturePrice) => void;
}

const FeaturePriceComp: React.SFC<FeaturePriceCompProps> = props => {
  const { productFeature, value, onChange } = props;

  const getFeatureName = (id: string) => {
    const list = (productFeature || [])
      .filter(item => item.productFeatureId === id);
    return list.length > 0 ? list[0].productFeatureName : id;
  };

  const featurePriceChange = (e: {
    target: {
      value: string
    }
  }) => {
    const featurePrice = e.target.value;
    const pattern = /^(\d+)((?:\.\d{1,2})?)$/;
    if (pattern.test(featurePrice)) {
      if (onChange) {
        onChange({ ...value, featurePrice: parseFloat(featurePrice) });
      }
    }
  };

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

  return (
    <React.Fragment>
      <Form.Item
        {...formItemLayout}
        label={`${getFeatureName(value.featureId)}价格`}
        help={() => { }}
      >
        <Input
          style={{ width: 200 }}
          prefix="￥"
          suffix="RMB"
          onChange={featurePriceChange}
          value={value.featurePrice}
        />
      </Form.Item>
    </React.Fragment>
  );
}

export default connect(({ dict }: { dict: DictStateType }) => ({
  productFeature: dict.productFeature,
}))(FeaturePriceComp);
