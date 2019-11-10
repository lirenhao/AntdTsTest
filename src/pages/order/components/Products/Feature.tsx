import React from 'react';
import { Radio, Checkbox } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { ProductFeature } from '@/pages/product/data';

interface FeatureProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  feature: ProductFeature;
  getFeatureName(id: string): string;
}

class Feature extends React.Component<FeatureProps> {
  handleRadio = (e: RadioChangeEvent) => {
    const { onChange } = this.props;
    const { value } = e.target;
    if (onChange) onChange([value]);
  };

  handleCheckbox = (values: any[]) => {
    const { onChange } = this.props;
    if (onChange) onChange(values);
  }

  render() {
    const { feature, getFeatureName, value } = this.props;

    if (feature.isExclusive === '0') {
      const ids = (value || [])
        .filter(item => feature.featureIds.indexOf(item) > -1) || [];
      return (
        <Radio.Group defaultValue={ids.length > 0 && ids[0]} onChange={this.handleRadio}>
          {feature.featureIds.map(featureId => (
            <Radio key={featureId} value={featureId}>
              {getFeatureName(featureId)}
            </Radio>
          ))}
        </Radio.Group>
      );
    }
    if (feature.isExclusive === '1')
      return (
        <Checkbox.Group defaultValue={value} onChange={this.handleCheckbox}>
          {feature.featureIds.map(featureId => (
            <Checkbox key={featureId} value={featureId}>
              {getFeatureName(featureId)}
            </Checkbox>
          ))}
        </Checkbox.Group>
      );
    return <div>没有该类型属性</div>;
  }
}

export default Feature;
