import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { DictStateType, GeoDict } from '@/models/dict'
import { GeoPrice, Product } from '@/pages/product/data';
import Header from './Header';
import Price from './GeoPrice';

const { Panel } = Collapse;

interface GeoPricesProps {
  geo: GeoDict[];
  product: Product;
  value: GeoPrice[];
  onChange: (value: GeoPrice[]) => void;
}

interface GeoPricesState { }

@connect(({ dict }: { dict: DictStateType; }) => ({
  geo: dict.geo,
}))
class GeoPrices extends React.Component<GeoPricesProps, GeoPricesState> {
  constructor(props: GeoPricesProps) {
    super(props);
    this.state = {
      value: props.value || [],
    };
  }

  getGeoName = (geoId: string) => {
    const { geo } = this.props;
    const geos = geo.filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  handleChange = (geoId: string) => (geoPrice: GeoPrice) => {
    const { value, onChange } = this.props;
    const newValue = value.map((item: GeoPrice) => (item.geoId === geoId ? geoPrice : item));
    if (onChange) {
      onChange(newValue);
    }
  };

  handleCopy = (geoIds: string[], geoPrices: GeoPrice[]) => {
    const { value, onChange } = this.props;
    const newValue = value.map(item =>
      geoIds.indexOf(item.geoId) < 0
        ? item
        : {
          ...item,
          ...(geoPrices.filter(gp => item.geoId === gp.geoId)[0] || {}),
        }
    );
    if (onChange) {
      onChange(newValue);
    }
  };

  render() {
    const { product, value } = this.props;

    return (
      <Collapse accordion>
        {product.geoIds.map((geoId: string) => (
          <Panel
            key={geoId}
            header={
              <Header
                title={this.getGeoName(geoId)}
                value={value.filter(item => item.geoId === geoId)[0] || {}}
                geoId={geoId}
                onCopy={this.handleCopy}
                options={product.geoIds.map(id => ({ value: id, title: this.getGeoName(id) }))}
              />
            }
          >
            <Price
              product={product}
              value={value.filter(item => item.geoId === geoId)[0] || {}}
              onChange={this.handleChange(geoId)}
            />
          </Panel>
        ))}
      </Collapse>
    );
  }
}

export default GeoPrices;
