import React from 'react';
import { connect } from 'dva';
import { Card, List, Input, Form } from 'antd';
import { DictStateType, GeoDict, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict'
import { GeoPrice, FeaturePrice, Product, ProductFeature } from '@/pages/product/data';
import FeaPrice from './FeaturePrice';

interface PriceProps {
  geo: GeoDict[];
  productFeatureType: ProductFeatureTypeDict[];
  productFeature: ProductFeatureDict[];
  product: Product;
  value: GeoPrice;
  onChange: (geoPrice: GeoPrice) => void;
}

interface PriceState { }

@connect(({ dict }: { dict: DictStateType }) => ({
  geo: dict.geo,
  productFeatureType: dict.productFeatureType,
  productFeature: dict.productFeature,
}))
class Price extends React.Component<PriceProps, PriceState> {

  getGeoName = (geoId: string) => {
    const { geo } = this.props;
    const geos = geo.filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  getFeatureTypeName = (typeId: string) => {
    const { productFeatureType } = this.props;
    const types = productFeatureType.filter(item => item.productFeatureTypeId === typeId);
    return types.length > 0 ? types[0].productFeatureTypeName : typeId;
  };

  geoPriceChange = (e: any) => {
    const geoPrice = e.target.value;
    const pattern = /^(\d+)((?:\.\d{1,2})?)$/;
    if (pattern.test(geoPrice)) {
      const { value, onChange } = this.props;
      if (onChange) {
        onChange({ ...value, geoPrice });
      }
    }
  };

  featurePriceChange = (featurePrice: FeaturePrice) => {
    const { value, onChange } = this.props;
    const featurePrices = value.featurePrices.map((fp: FeaturePrice) =>
      fp.featureId === featurePrice.featureId ? featurePrice : fp
    );
    if (onChange) {
      onChange({ ...value, featurePrices });
    }
  };

  render() {
    const { product, value } = this.props;

    return (
      <React.Fragment>
        <Form.Item label={`${this.getGeoName(value.geoId)}价格`} colon={false}>
          <Input
            placeholder="请输入区域价格"
            style={{ width: 200 }}
            prefix="￥"
            suffix="RMB"
            onChange={this.geoPriceChange}
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
                  title={this.getFeatureTypeName(item.featureTypeId)}
                  description={item.featureIds.map((id: string) => (
                    <FeaPrice
                      value={value.featurePrices.filter(fp => fp.featureId === id)[0] || {}}
                      onChange={this.featurePriceChange}
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
                  title={this.getFeatureTypeName(item.featureTypeId)}
                  description={item.featureIds.map(id => (
                    <FeaPrice
                      value={value.featurePrices.filter(fp => fp.featureId === id)[0] || {}}
                      onChange={this.featurePriceChange}
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
                  title={this.getFeatureTypeName(item.featureTypeId)}
                  description={item.featureIds.map(id => (
                    <FeaPrice
                      value={value.featurePrices.filter(fp => fp.featureId === id)[0] || {}}
                      onChange={this.featurePriceChange}
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
}

export default Price;
