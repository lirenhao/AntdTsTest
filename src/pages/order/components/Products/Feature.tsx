import React from 'react';
import { Radio, Checkbox } from 'antd';
import { RadioChangeEvent } from 'antd/es/radio';
import { ProductFeature } from '@/pages/product/data';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

interface FeatureProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  feature: ProductFeature;
  getFeatureName(id: string): string;
}

const Feature: React.SFC<FeatureProps> = props => {
  const { value, onChange, feature, getFeatureName } = props;

  const handleRadio = (e: RadioChangeEvent) => {
    const { value } = e.target;
    if (onChange) onChange([value]);
  };

  const handleCheckbox = (values: CheckboxValueType[]) => {
    if (onChange) onChange(values.map(item => item.toString()));
  }

  if (feature.isExclusive === '0') {
    const ids = (value || [])
      .filter(item => feature.featureIds.indexOf(item) > -1) || [];
    return (
      <Radio.Group defaultValue={ids.length > 0 && ids[0]} onChange={handleRadio}>
        {feature.featureIds.map(featureId => (
          <Radio key={featureId} value={featureId}>
            {getFeatureName(featureId)}
          </Radio>
        ))}
      </Radio.Group>
    );
  }
  if (feature.isExclusive === '1') {
    return (
      <Checkbox.Group defaultValue={value} onChange={handleCheckbox}>
        {feature.featureIds.map(featureId => (
          <Checkbox key={featureId} value={featureId}>
            {getFeatureName(featureId)}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  }
  return <div>没有该类型属性</div>;
}

export default Feature;
