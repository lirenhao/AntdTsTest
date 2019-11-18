import React from 'react';
import { connect } from 'dva';
import { Modal, Steps } from 'antd';
import { Product, ProductPrice } from '@/pages/product/data';
import { QueryType, ProductType, DetailsType } from '../../data';
import Query from './Query';
import Details from './Details';
import Price from './Price';

interface CreateProps {
  loading?: boolean;
  visible: boolean;
  hideModal(e: any): void;
  info: Partial<ProductType>;
  handleFormSubmit(value: Partial<ProductType>): void;
}

const Create: React.FC<CreateProps> = props => {

  const [current, setCurrent] = React.useState<number>(0);
  const [query, setQuery] = React.useState<Partial<QueryType>>({});
  const [productInfos, setProductInfos] = React.useState<Product[]>([]);
  const [details, setDetails] = React.useState<Partial<DetailsType>>({});
  const [productPrice, setProductPrice] = React.useState<Partial<ProductPrice>>({});

  const { visible, hideModal, handleFormSubmit } = props;

  const handleNext = () => {
    setCurrent(current + 1);
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleQuery = (query: QueryType, productInfos: Product[]) => {
    setQuery(query);
    setProductInfos(productInfos);
    handleNext();
  };

  const handleDetails = (details: DetailsType, productPrice: ProductPrice) => {
    setDetails(details);
    setProductPrice(productPrice);
    handleNext();
  };

  const handleSubmit = (value: ProductType) => {
    setCurrent(0);
    handleFormSubmit(value);
  };

  return (
    <Modal
      width="60%"
      bodyStyle={{ padding: '32px 40px 48px' }}
      title="添加服务"
      maskClosable={false}
      visible={visible}
      onCancel={hideModal}
      footer={null}
    >
      <Steps current={current}>
        <Steps.Step title="选择服务类型" />
        <Steps.Step title="选择服务" />
        <Steps.Step title="选择服务属性" />
      </Steps>
      {current === 0 && <Query info={query} handleNext={handleQuery} />}
      {current === 1 && (
        <Details
          info={details}
          productInfos={productInfos}
          handleNext={handleDetails}
          handlePrev={handlePrev}
        />
      )}
      {current === 2 && (
        <Price
          details={details}
          productInfos={productInfos}
          productPrice={productPrice}
          handleNext={handleSubmit}
          handlePrev={handlePrev}
        />
      )}
    </Modal>
  );
}

export default connect(({ loading }: {
  loading: { models: { [key: string]: boolean; } }
}) => ({
  loading: loading.models.order,
}))(Create);
