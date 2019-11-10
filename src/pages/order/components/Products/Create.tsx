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

interface CreateState {
  current: number;
  query: Partial<QueryType>;
  productInfos: Product[];
  details: Partial<DetailsType>;
  productPrice: Partial<ProductPrice>;
}

@connect(({ loading }: {
  loading: { models: { [key: string]: boolean; } }
}) => ({
  loading: loading.models.order,
}))
class Create extends React.Component<CreateProps, CreateState> {
  state = {
    current: 0,
    query: {},
    productInfos: [],
    details: {
      productId: undefined
    },
    productPrice: {},
  }

  handleNext = () => {
    const { current } = this.state;
    this.setState({ current: current + 1 });
  };

  handlePrev = () => {
    const { current } = this.state;
    this.setState({ current: current - 1 });
  };

  handleQuery = (query: QueryType, productInfos: Product[]) => {
    this.setState({
      query,
      productInfos,
    });
    this.handleNext();
  };

  handleDetails = (details: DetailsType, productPrice: ProductPrice) => {
    this.setState({
      details,
      productPrice,
    });
    this.handleNext();
  };

  handleSubmit = (value: ProductType) => {
    const { handleFormSubmit } = this.props;
    this.setState({ current: 0 });
    handleFormSubmit(value);
  };

  render() {
    const { visible, hideModal } = this.props;
    const { current, query, productInfos, details, productPrice } = this.state;

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
        {current === 0 && <Query info={query} handleNext={this.handleQuery} />}
        {current === 1 && (
          <Details
            info={details}
            productInfos={productInfos}
            handleNext={this.handleDetails}
            handlePrev={this.handlePrev}
          />
        )}
        {current === 2 && (
          <Price
            details={details}
            productInfos={productInfos}
            productPrice={productPrice}
            handleNext={this.handleSubmit}
            handlePrev={this.handlePrev}
          />
        )}
      </Modal>
    );
  }
}

export default Create;
