import React from 'react';
import { connect } from 'dva';
import { Card, List, Input, Form } from 'antd';
import { DictStateType, GeoDict, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict'
import { GeoPrice, FeaturePrice, Product, ProductFeature } from '@/pages/product/data';
import FeaPrice from './FeaturePrice';

interface PriceProps {
  geo?: GeoDict[];
  productFeatureType?: ProductFeatureTypeDict[];
  productFeature?: ProductFeatureDict[];
  product: Partial<Product>;
  value: GeoPrice;
  onChange: (geoPrice: GeoPrice) => void;
}

const Price: React.SFC<PriceProps> = props => {
  const { geo, productFeatureType, product, value, onChange } = props;

  const getGeoName = (geoId: string) => {
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  const getFeatureTypeName = (typeId: string) => {
    const types = (productFeatureType || [])
      .filter(item => item.productFeatureTypeId === typeId);
    return types.length > 0 ? types[0].productFeatureTypeName : typeId;
  };

  const geoPriceChange = (e: {
    target: {
      value: string
    }
  }) => {
    const geoPrice = e.target.value;
    const pattern = /^(\d+)((?:\.\d{1,2})?)$/;
    if (pattern.test(geoPrice)) {
      if (onChange) {
        onChange({ ...value, geoPrice: parseFloat(geoPrice) });
      }
    }
  };

  const featurePriceChange = (featurePrice: FeaturePrice) => {
    const featurePrices = (value.featurePrices || []).map((fp: FeaturePrice) =>
      fp.featureId === featurePrice.featureId ? featurePrice : fp
    );
    if (onChange) {
      onChange({ ...value, featurePrices });
    }
  };

  return (
    <React.Fragment>
      <Form.Item label={`${getGeoName(value.geoId)}价格`} colon={false}>
        <Input
          placeholder="请输入区域价格"
          style={{ width: 200 }}
          prefix="￥"
          suffix="RMB"
          onChange={geoPriceChange}
          value={value.geoPrice}
        />
      </Form.Item>
      <Card size="small" type="inner" title="固定属性">
        <List
          itemLayout="horizontal"
          dataSource={product.fixFeatures}
          renderItem={(item: ProductFeature) => (
            <List.Item key={item.featureTypeId}>
              <List.Item.Meta
                title={getFeatureTypeName(item.featureTypeId)}
                description={item.featureIds.map((id: string) => (
                  <FeaPrice
                    value={value.featurePrices.filter(fp => fp.featureId === id)[0] || {}}
                    onChange={featurePriceChange}
                  />
                ))}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card size="small" type="inner" title="必须属性">
        <List
          itemLayout="horizontal"
          dataSource={product.mustFeatures}
          renderItem={item => (
            <List.Item key={item.featureTypeId}>
              <List.Item.Meta
                title={getFeatureTypeName(item.featureTypeId)}
                description={item.featureIds.map(id => (
                  <FeaPrice
                    value={(value.featurePrices || []).filter(fp => fp.featureId === id)[0] || {}}
                    onChange={featurePriceChange}
                  />
                ))}
              />
            </List.Item>
          )}
        />
      </Card>
      <Card size="small" type="inner" title="可选属性">
        <List
          itemLayout="horizontal"
          dataSource={product.optionFeatures}
          renderItem={item => (
            <List.Item key={item.featureTypeId}>
              <List.Item.Meta
                title={getFeatureTypeName(item.featureTypeId)}
                description={item.featureIds.map(id => (
                  <FeaPrice
                    value={value.featurePrices.filter(fp => fp.featureId === id)[0] || {}}
                    onChange={featurePriceChange}
                  />
                ))}
              />
            </List.Item>
          )}
        />
      </Card>
    </React.Fragment>
  );
}

export default connect(({ dict }: { dict: DictStateType }) => ({
  geo: dict.geo,
  productFeatureType: dict.productFeatureType,
  productFeature: dict.productFeature,
}))(Price);
