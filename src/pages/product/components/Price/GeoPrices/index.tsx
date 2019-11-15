import React from 'react';
import { connect } from 'dva';
import { Collapse } from 'antd';
import { DictStateType, GeoDict } from '@/models/dict'
import { GeoPrice, Product } from '@/pages/product/data';
import Header from './Header';
import Price from './GeoPrice';

const { Panel } = Collapse;

interface GeoPricesProps {
  geo?: GeoDict[];
  product: Partial<Product>;
  value?: GeoPrice[];
  onChange?: (value: GeoPrice[]) => void;
}

const GeoPrices: React.SFC<GeoPricesProps> = props => {
  const { geo, product, value, onChange } = props;

  const getGeoName = (geoId: string) => {
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  const handleChange = (geoId: string) => (geoPrice: GeoPrice) => {
    const newValue = (value || [])
      .map((item: GeoPrice) => (item.geoId === geoId ? geoPrice : item));
    if (onChange) onChange(newValue);
  };

  const handleCopy = (geoIds: string[], geoPrices: GeoPrice[]) => {
    const newValue = (value || [])
      .map(item =>
        geoIds.indexOf(item.geoId) < 0
          ? item
          : {
            ...item,
            ...(geoPrices.filter(gp => item.geoId === gp.geoId)[0] || {}),
          }
      );
    if (onChange) onChange(newValue);
  };

  return (
    <Collapse accordion>
      {(product.geoIds || []).map((geoId: string) => (
        <Panel
          key={geoId}
          header={
            <Header
              title={getGeoName(geoId)}
              value={(value || []).filter(item => item.geoId === geoId)[0] || {}}
              geoId={geoId}
              onCopy={handleCopy}
              options={(product.geoIds || []).map(id => ({ value: id, title: getGeoName(id) }))}
            />
          }
        >
          <Price
            product={product}
            value={(value || []).filter(item => item.geoId === geoId)[0] || {}}
            onChange={handleChange(geoId)}
          />
        </Panel>
      ))}
    </Collapse>
  );
}

export default connect(({ dict }: { dict: DictStateType; }) => ({
  geo: dict.geo,
}))(GeoPrices);
