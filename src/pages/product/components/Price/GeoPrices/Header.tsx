import React from 'react';
import { Select, Divider, Button } from 'antd';
import { GeoPrice, FeaturePrice } from '@/pages/product/data';

interface HeaderProps {
  title: string;
  value: GeoPrice;
  geoId: string;
  onCopy: (geoIds: string[], values: GeoPrice[]) => void;
  options: {
    value: string;
    title: string;
  }[];
}

const Header: React.FC<HeaderProps> = props => {
  const [geoIds, setGeoIds] = React.useState<string[]>([]);

  const { title, value, options, geoId, onCopy } = props;

  const onClickHandler = (e: any) => {
    e.stopPropagation();
  };

  const handleChange = (geoIds: string[]) => {
    setGeoIds(geoIds);
  };

  const handleCopy = () => {
    onCopy(
      geoIds,
      geoIds.map(geoId => ({
        ...value,
        geoId,
      })),
    );
  };

  const amount = value.featurePrices
    .map((item: FeaturePrice) => item.featurePrice)
    .reduce((a: number, b: number) => a + b, value.geoPrice);

  return (
    <div onClick={onClickHandler}>
      {`${title}   总价格:${amount}`}
      <Select
        allowClear
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="请选择要拷贝的区域"
        defaultValue={geoIds}
        onChange={handleChange}
        dropdownRender={menu => (
          <div>
            {menu}
            <Divider style={{ margin: '4px 0' }} />
            <div style={{ padding: '4px 8px', cursor: 'pointer' }}>确定</div>
          </div>
        )}
      >
        {options
          .filter(option => option.value !== geoId)
          .map(option => (
            <Select.Option key={option.value}>{option.title}</Select.Option>
          ))}
      </Select>
      <Button onClick={handleCopy}>复制</Button>
    </div>
  );
}

export default Header;
