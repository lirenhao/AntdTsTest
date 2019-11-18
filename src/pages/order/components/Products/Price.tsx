import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button } from 'antd';
import { DictStateType, GeoDict, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict';
import { FormComponentProps } from 'antd/lib/form';
import { ProductPrice, Product } from '@/pages/product/data';
import { DetailsType } from '../../data';
import Feature from './Feature';
import styles from '@/pages/order/styles.less';

interface PriceProps extends FormComponentProps {
  geo?: GeoDict[];
  productFeatureType?: ProductFeatureTypeDict[];
  productFeature?: ProductFeatureDict[];
  loading?: boolean;
  productInfos: Product[];
  productPrice: Partial<ProductPrice>;
  details: Partial<DetailsType>;
  handleNext(v: any): void;
  handlePrev(): void;
}

const Price: React.SFC<PriceProps> = props => {

  const { geo, productFeatureType, productFeature, form,
    details, productInfos, productPrice, handlePrev, handleNext, loading } = props;

  const getGeoName = (geoId: string) => {
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  const getGeoPrice = (geoId: string) => {
    const geoPrices = (productPrice.geoPrices || [])
      .filter(item => item.geoId === geoId);
    return geoPrices.length > 0 ? geoPrices[0] : { geoPrice: 0, featurePrices: [] };
  };

  const getFeatureTypeName = (featureTypeId: string) => {
    const featureTypes = (productFeatureType || [])
      .filter(item => item.productFeatureTypeId === featureTypeId);
    return featureTypes.length > 0 ? featureTypes[0].productFeatureTypeName : featureTypeId;
  };

  const getFeatureName = (featureId: string) => {
    const features = (productFeature || [])
      .filter(item => item.productFeatureId === featureId);
    const featureName = features.length > 0 ? features[0].productFeatureName : featureId;
    return featureName;
  };

  const getFeaturePrice = (featureId: string) => {
    const geoPrices = (productPrice.geoPrices || [])
      .filter(item => item.geoId === details.geoId);
    const featurePrices = geoPrices.length > 0 ? geoPrices[0].featurePrices : [];
    const featurePrice = featurePrices.filter(item => item.featureId === featureId)[0] || {};
    return featurePrice.featurePrice;
  };

  const handleSubmit = (e: any) => {
    const { featurePrices } = getGeoPrice(details.geoId || '');
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const featureIds = Object.keys(values)
          .filter(key => key.indexOf('featureType') > -1)
          .map(key => values[key])
          .reduce((a, b) => (b ? [...a, ...b] : a), []);
        const geoPrices = (productPrice.geoPrices || [])
          .filter(gp => gp.geoId === details.geoId);
        const geoPrice = geoPrices.length > 0 ? geoPrices[0].geoPrice : 0;
        const result = {
          productId: details.productId,
          productName: details.productName,
          productPrice: productPrice.productPrice,
          geoId: details.geoId,
          geoName: details.geoName,
          geoPrice,
          discountPrice: parseFloat(values.discountPrice),
          features: featurePrices
            .filter(item => featureIds.indexOf(item.featureId) > -1)
            .map(item => ({
              ...item,
              featureName: getFeatureName(item.featureId),
            })),
        };
        handleNext(result);
      }
    });
  };

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };

  const productInfo = productInfos
    .filter((item: Product) => item.productId === details.productId)[0] || {}
  const features = [
    ...(productInfo.fixFeatures || []),
    ...(productInfo.mustFeatures || []),
    ...(productInfo.optionFeatures || []),
  ];
  const { getFieldDecorator } = form;

  return (
    <Form layout="horizontal" className={styles.stepForm}>
      <Form.Item {...formItemLayout} className={styles.stepFormText} label="产品">
        {`${productInfo.productName}[${productPrice.productPrice}]`}
      </Form.Item>
      <Form.Item {...formItemLayout} className={styles.stepFormText} label="区域">
        {`${getGeoName(details.geoId || '')}[${getGeoPrice(details.geoId || '').geoPrice}]`}
      </Form.Item>
      <Form.Item {...formItemLayout} label="优惠金额">
        {getFieldDecorator('discountPrice', {
          initialValue: 0,
          rules: [
            {
              required: true,
              message: '请输入优惠金额',
            },
            {
              pattern: /^(\d+)((?:\.\d{1,2})?)$/,
              message: '请输入合法金额数字',
            },
          ],
        })(<Input placeholder="请输入" />)}
      </Form.Item>
      {features.map((feature, index) => (
        <Form.Item
          {...formItemLayout}
          key={`${feature.featureTypeId}-${index}`}
          label={getFeatureTypeName(feature.featureTypeId)}
        >
          {getFieldDecorator(`featureType#${index}#${feature.featureTypeId}`)(
            <Feature
              feature={feature}
              getFeatureName={featureId =>
                `${getFeatureName(featureId)}[${getFeaturePrice(featureId)}]`
              }
            />
          )}
        </Form.Item>
      ))}
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
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          提 交
      </Button>
        <Button onClick={handlePrev} style={{ marginLeft: 8 }}>
          上一步
      </Button>
      </Form.Item>
    </Form>
  );
}

export default Form.create<PriceProps>()(
  connect(({ dict, loading }: {
    dict: DictStateType;
    loading: { models: { [key: string]: boolean; } }
  }) => ({
    geo: dict.geo,
    productFeatureType: dict.productFeatureType,
    productFeature: dict.productFeature,
    loading: loading.models.order,
  }))(Price)
);
