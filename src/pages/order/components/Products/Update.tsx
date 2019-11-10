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

@connect(({ dict, loading }: {
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
}))
class Update extends React.Component<UpdateProps> {

  getGeoName = (geoId: string) => {
    const { geo } = this.props;
    const geos = (geo || [])
      .filter(item => item.geoId === geoId);
    return geos.length > 0 ? geos[0].geoName : geoId;
  };

  getGeoPrice = (geoId: string) => {
    const { productPrice } = this.props;
    const geoPrices = (productPrice.geoPrices || []).filter(item => item.geoId === geoId);
    return geoPrices.length > 0 ? geoPrices[0] : { geoPrice: '', featurePrices: [] };
  };

  getFeatureTypeName = (featureTypeId: string) => {
    const { productFeatureType } = this.props;
    const featureTypes = (productFeatureType || [])
      .filter(item => item.productFeatureTypeId === featureTypeId);
    return featureTypes.length > 0 ? featureTypes[0].productFeatureTypeName : featureTypeId;
  };

  getFeatureName = (featureId: string) => {
    const { productFeature } = this.props;
    const features = (productFeature || [])
      .filter(item => item.productFeatureId === featureId);
    const featureName = features.length > 0 ? features[0].productFeatureName : featureId;
    return featureName;
  };

  getFeaturePrice = (featureId: string) => {
    const { info, productPrice } = this.props;
    const geoPrices = (productPrice.geoPrices || [])
      .filter(item => item.geoId === info.geoId);
    const featurePrices = geoPrices.length > 0 ? geoPrices[0].featurePrices : [];
    const featurePrice = featurePrices.filter((item: FeaturePrice) => item.featureId === featureId)[0] || {};

    return featurePrice.featurePrice;
  };

  handleSubmit = (e: any) => {
    const { handleFormSubmit, form, info, productInfo } = this.props;
    const { featurePrices } = this.getGeoPrice(info.geoId || '');
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
          geoName: this.getGeoName(info.geoId || ''),
          geoPrice: info.geoPrice,
          discountPrice: values.discountPrice,
          features: featurePrices
            .filter(item => featureIds.indexOf(item.featureId) > -1)
            .map(item => ({
              ...item,
              featureName: this.getFeatureName(item.featureId),
            })),
        };
        handleFormSubmit(result);
        form.resetFields();
      }
    });
  };

  render() {
    const {
      visible,
      hideModal,
      form: { getFieldDecorator },
      info,
      productInfo,
      productPrice,
    } = this.props;
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

    return (
      <Modal
        width="60%"
        bodyStyle={{ padding: '32px 40px 48px' }}
        title="修改服务"
        maskClosable={false}
        visible={visible}
        okText="提交"
        onOk={this.handleSubmit}
        onCancel={hideModal}
      >
        <Form layout="horizontal">
          <Form.Item {...formItemLayout} label="产品">
            {`${productInfo.productName}[${productPrice.productPrice}]`}
          </Form.Item>
          <Form.Item {...formItemLayout} label="区域">
            {`${this.getGeoName(info.geoId || '')}[${this.getGeoPrice(info.geoId || '').geoPrice}]`}
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
              label={this.getFeatureTypeName(feature.featureTypeId)}
            >
              {getFieldDecorator(`featureType#${index}#${feature.featureTypeId}`, {
                initialValue: (info.features || [])
                  .map((item: FeatureType) => item.featureId)
                  .filter((id: string) => feature.featureIds.indexOf(id) > -1),
              })(
                <Feature
                  feature={feature}
                  getFeatureName={featureId =>
                    `${this.getFeatureName(featureId)}[${this.getFeaturePrice(featureId)}]`
                  }
                />
              )}
            </Form.Item>
          ))}
        </Form>
      </Modal>
    );
  }
}

export default Form.create<UpdateProps>()(Update);
