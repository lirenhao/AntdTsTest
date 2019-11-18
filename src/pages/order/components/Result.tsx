import React from 'react';
import { connect } from 'dva';
import { Card, Descriptions, Button } from 'antd';
import { DictStateType, GeoDict, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict';
import { OrderType } from '../data';

interface ResultProps {
  geo?: GeoDict[];
  productFeatureType?: ProductFeatureTypeDict[];
  productFeature?: ProductFeatureDict[];
  loading?: boolean;
  info: Partial<OrderType>;
  handleNext(info: Partial<OrderType>): void;
  handlePrev(): void;
}

const Result: React.SFC<ResultProps> = props => {
  const { info, handlePrev, handleNext, loading } = props;

  const handleSubmit = () => {
    handleNext({ ...info, grandTotal: handleTotal() });
  };

  const handleTotal = () => {
    const productPrice = (info.products || [])
      .map(record => {
        const featurePrice = record.features
          .map(item => item.featurePrice)
          .reduce((a, b) => (a + b), 0);
        return (record.productPrice + record.geoPrice + featurePrice - record.discountPrice);
      })
      .reduce((a, b) => (a + b), 0);
    console.log(productPrice)
    return (info.serviceCommission || 0) + productPrice;
  };

  return (
    <React.Fragment>
      <div
        style={{
          marginTop: '16px',
          border: '1px dashed #e9e9e9',
          borderRadius: '6px',
          backgroundColor: '#fafafa',
          minHeight: '200px',
          textAlign: 'center',
        }}
      >
        <Card title="订单信息" bordered={false}>
          <Descriptions bordered>
            <Descriptions.Item label="客户分期">{info.instalmentTypeEnumId}</Descriptions.Item>
            <Descriptions.Item label="续费状态">{info.renewalFeeStatusId}</Descriptions.Item>
            <Descriptions.Item label="公司法人">{info.legalPartyGroupName}</Descriptions.Item>
            <Descriptions.Item label="公司名称">{info.corpName}</Descriptions.Item>
            <Descriptions.Item label="合同类型">{info.agreementTypeId}</Descriptions.Item>
            <Descriptions.Item label="合同编号">{info.agreementCode}</Descriptions.Item>
            <Descriptions.Item label="订单日期">{info.orderDate}</Descriptions.Item>
            <Descriptions.Item label="服务佣金">{info.serviceCommission}</Descriptions.Item>
            <Descriptions.Item label="订单总金额">{handleTotal()}</Descriptions.Item>
            <Descriptions.Item label="服务产品" span={3}>
              {(info.products || [])
                .map(item => (
                  <React.Fragment>
                    <Descriptions bordered>
                      <Descriptions.Item label={item.productName}>
                        {item.productPrice}
                      </Descriptions.Item>
                      <Descriptions.Item label="优惠价格">{item.discountPrice}</Descriptions.Item>
                      <Descriptions.Item label={item.geoName}>{item.geoPrice}</Descriptions.Item>
                      {item.features.map(feature => (
                        <Descriptions.Item key={feature.featureId} label={feature.featureName}>
                          {feature.featurePrice}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                    <br />
                  </React.Fragment>
                ))}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          提 交
        </Button>
        <Button onClick={handlePrev} style={{ marginLeft: 8 }} loading={loading}>
          上一步
        </Button>
      </div>
    </React.Fragment>
  );
}

export default connect(({ dict, loading }: {
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
}))(Result);
