import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { DictStateType, GeoDict, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict';
import { ProductPrice, FeaturePrice, Product } from '@/pages/product/data';
import { ProductType, FeatureType } from '@/pages/order/data';
import Feature from './Feature';

interface UpdateProps extends FormComponentProps {
  geo?: GeoDict[];
  productFeatureType?: ProductFeatureTypeDict[];
  productFeature?: ProductFeatureDict[];
  productInfo: Partial<Product>;
  productPrice: Partial<ProductPrice>;
  visible: boolean;
  hideModal(e: any): void;
  info: Partial<ProductType>;
  handleFormSubmit(value: Partial<ProductType>): void;
}

const Update: React.SFC<UpdateProps> = props => {
  const { geo, productFeatureType, productFeature, productPrice,
    handleFormSubmit, form, info, productInfo, visible, hideModal } = props;

  const getGeoName = (geoId: string) => {
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  const getGeoPrice = (geoId: string) => {
    const geoPrices = (productPrice.geoPrices || []).filter(item => item.geoId === geoId);
    return geoPrices.length > 0 ? geoPrices[0] : { geoPrice: '', featurePrices: [] };
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
      .filter(item => item.geoId === info.geoId);
    const featurePrices = geoPrices.length > 0 ? geoPrices[0].featurePrices : [];
    const featurePrice = featurePrices.filter((item: FeaturePrice) => item.featureId === featureId)[0] || {};

    return featurePrice.featurePrice;
  };

  const handleSubmit = (e: any) => {
    const { featurePrices } = getGeoPrice(info.geoId || '');
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const featureIds = Object.keys(values)
          .filter(key => key.indexOf('featureType') > -1)
          .map(key => values[key])
          .reduce((a, b) => (b ? [...a, ...b] : a), []);
        const result = {
          productId: info.productId,
          productName: productInfo.productName,
          productPrice: info.productPrice,
          geoId: info.geoId,
          geoName: getGeoName(info.geoId || ''),
          geoPrice: info.geoPrice,
          discountPrice: parseFloat(values.discountPrice),
          features: featurePrices
            .filter(item => featureIds.indexOf(item.featureId) > -1)
            .map(item => ({
              ...item,
              featureName: getFeatureName(item.featureId),
            })),
        };
        handleFormSubmit(result);
        form.resetFields();
      }
    });
  };

  const features = [
    ...(productInfo.fixFeatures || []),
    ...(productInfo.mustFeatures || []),
    ...(productInfo.optionFeatures || []),
  ];

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

  const { getFieldDecorator } = form;

  return (
    <Modal
      width="60%"
      bodyStyle={{ padding: '32px 40px 48px' }}
      title="修改服务"
      maskClosable={false}
      visible={visible}
      okText="提交"
      onOk={handleSubmit}
      onCancel={hideModal}
    >
      <Form layout="horizontal">
        <Form.Item {...formItemLayout} label="产品">
          {`${productInfo.productName}[${productPrice.productPrice}]`}
        </Form.Item>
        <Form.Item {...formItemLayout} label="区域">
          {`${getGeoName(info.geoId || '')}[${getGeoPrice(info.geoId || '').geoPrice}]`}
        </Form.Item>
        <Form.Item {...formItemLayout} label="优惠金额">
          {getFieldDecorator('discountPrice', {
            initialValue: info.discountPrice,
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
            {getFieldDecorator(`featureType#${index}#${feature.featureTypeId}`, {
              initialValue: (info.features || [])
                .map((item: FeatureType) => item.featureId)
                .filter((id: string) => feature.featureIds.indexOf(id) > -1),
            })(
              <Feature
                feature={feature}
                getFeatureName={featureId =>
                  `${getFeatureName(featureId)}[${getFeaturePrice(featureId)}]`
                }
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
}

export default Form.create<UpdateProps>()(
  connect(({ dict, loading }: {
    dict: DictStateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    geo: dict.geo,
    productFeatureType: dict.productFeatureType,
    productFeature: dict.productFeature,
    loading: loading.models.order,
  }))(Update)
);
