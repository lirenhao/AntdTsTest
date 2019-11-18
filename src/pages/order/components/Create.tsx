import React from 'react';
import { connect } from 'dva';
import { Drawer, Steps } from 'antd';
import { DictStateType, ProductTypeDict, ProductCategotyDict, GeoDict } from '@/models/dict'
import { OrderType, ProductType } from '../data';

import Products from './Products';
import BasicInfo from './BasicInfo';
import Result from './Result';

interface CreateProps {
  productType?: ProductTypeDict[];
  productCategoty?: ProductCategotyDict[];
  geo?: GeoDict[];
  title: string;
  visible: boolean;
  hideModal(e: any): void;
  hideModal(e: any): void;
  info: Partial<OrderType>;
  handleFormSubmit(value: OrderType): void;
}

const Create: React.FC<CreateProps> = props => {

  const [current, setCurrent] = React.useState<number>(0);
  const [info, setInfo] = React.useState<Partial<OrderType>>({});

  const { title, visible, hideModal, handleFormSubmit } = props;

  if (info.orderId !== props.info.orderId) setInfo(props.info);

  const handleNext = () => {
    setCurrent(current + 1);
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleProducts = (products: ProductType[]) => {
    setInfo({
      ...info,
      products,
    });
    handleNext();
  };

  const handleBasicInfo = (basicInfo: Partial<OrderType>) => {
    setInfo({
      ...info,
      ...basicInfo,
    });
    handleNext();
  };

  const handleSubmit = (value: OrderType) => {
    handleFormSubmit(value);
  };

  return (
    <Drawer
      title={title}
      width="70%"
      destroyOnClose
      maskClosable={false}
      visible={visible}
      onClose={hideModal}
    >
      <Steps current={current}>
        <Steps.Step title="选择订单服务" />
        <Steps.Step title="输入订单信息" />
        <Steps.Step title="完成" />
      </Steps>
      {current === 0 && (
        <Products products={info.products || []} handleNext={handleProducts} />
      )}
      {current === 1 && (
        <BasicInfo info={info} handleNext={handleBasicInfo} handlePrev={handlePrev} />
      )}
      {current === 2 && (
        <Result info={info} handleNext={handleSubmit} handlePrev={handlePrev} />
      )}
    </Drawer>
  );
}

export default connect(({ dict }: { dict: DictStateType; }) => ({
  productType: dict.productType,
  productCategoty: dict.productCategoty,
  geo: dict.geo,
}))(Create);
