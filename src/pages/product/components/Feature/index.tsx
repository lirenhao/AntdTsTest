import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { List, Button } from 'antd';
import { DictStateType, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict'
import { ProductFeature } from '../../data';
import Create from './Create';

interface FeatureProps {
  productFeatureType: ProductFeatureTypeDict[];
  productFeature: ProductFeatureDict[];
  value: ProductFeature[];
  onChange: (value: ProductFeature[]) => void;
  title: string;
  label: string;
  limit: {
    featureTypeIds: string[];
    featureIds: string[];
  };
  setLimit: (e: any) => void;
}

interface FeatureState {
  isCreateShow: boolean;
  isUpdateShow: boolean;
  info: ProductFeature | Object;
}

@connect(({ dict }: {
  dict: DictStateType;
}) => ({
  productFeatureType: dict.productFeatureType,
  productFeature: dict.productFeature,
}))
class Feature extends React.Component<FeatureProps, FeatureState> {
  static propTypes = {
    value: PropTypes.array,
    limit: PropTypes.object.isRequired,
  };

  static defaultProps = {
    value: [],
  };

  constructor(props: FeatureProps) {
    super(props);
    this.state = {
      isCreateShow: false,
      isUpdateShow: false,
      info: {},
    };
  }

  handleAddModal = (visible: boolean) => {
    this.setState({ isCreateShow: visible });
  };

  handleAddForm = (record: ProductFeature) => {
    const { value, limit, setLimit } = this.props;
    const { onChange } = this.props;
    if (onChange) {
      onChange([...value, record]);
    }
    setLimit({
      featureTypeIds: [...limit.featureTypeIds, record.featureTypeId],
      featureIds: [...limit.featureIds, ...record.featureIds],
    });
    this.handleAddModal(false);
  };

  handleUpdateModal = (visible: boolean) => {
    this.setState({ isUpdateShow: visible });
  };

  handleUpdate = (record: ProductFeature) => {
    this.setState({ info: record });
    this.handleUpdateModal(true);
  };

  handleUpdateForm = (record: ProductFeature, info: ProductFeature) => {
    const { value, onChange, limit, setLimit } = this.props;
    const newValue = value
      .map((item: ProductFeature) => (info.featureTypeId === item.featureTypeId ? record : item));
    onChange(newValue);
    setLimit({
      featureTypeIds: [
        ...limit.featureTypeIds.filter((id: string) => id !== info.featureTypeId),
        record.featureTypeId,
      ],
      featureIds: [
        ...limit.featureIds.filter((id: string) => (info.featureIds || []).indexOf(id) < 0),
        ...record.featureIds,
      ],
    });
    this.handleUpdateModal(false);
  };

  handleRemove = (record: ProductFeature) => {
    const { value, onChange, limit, setLimit } = this.props;
    onChange(value.filter((item: ProductFeature) => record.featureTypeId !== item.featureTypeId));
    setLimit({
      featureTypeIds: [...limit.featureTypeIds.filter((id: string) => id !== record.featureTypeId)],
      featureIds: [...limit.featureIds.filter((id: string) => record.featureIds.indexOf(id) < 0)],
    });
  };

  getFeatureTypeName = (featureTypeId: string) => {
    const { productFeatureType } = this.props;
    const data = productFeatureType
      .filter((item: ProductFeatureTypeDict) => item.productFeatureTypeId === featureTypeId);
    return data && data[0] ? data[0].productFeatureTypeName : featureTypeId;
  }

  getFeatureName = (featureId: string) => {
    const { productFeature } = this.props;
    const data = productFeature
      .filter((item: ProductFeatureDict) => item.productFeatureId === featureId);
    return data && data[0] ? data[0].productFeatureName : featureId;
  }

  render() {
    const { title, label, value, limit } = this.props;
    const { isCreateShow, isUpdateShow, info } = this.state;

    return (
      <div>
        <Button onClick={() => this.handleAddModal(true)}>添加</Button>
        {value && value.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={value}
            renderItem={(item: ProductFeature) => (
              <List.Item
                actions={[
                  <a onClick={() => this.handleUpdate(item)}>修改</a>,
                  <a onClick={() => this.handleRemove(item)}>删除</a>,
                ]}
              >
                <List.Item.Meta
                  title={this.getFeatureTypeName(item.featureTypeId)}
                  description={item.featureIds
                    .map((id: string) => this.getFeatureName(id))
                    .join('  ')}
                />
                <div>{item.isExclusive === '0' ? '单选' : '多选'}</div>
              </List.Item>
            )}
          />
        ) : (
            <div />
          )}
        <Create
          visible={isCreateShow}
          hideModal={() => this.handleAddModal(false)}
          handleFormSubmit={this.handleAddForm}
          title={`添加${title}`}
          label={label}
          limit={limit}
          value={value || []}
          info={{}}
        />
        <Create
          visible={isUpdateShow}
          hideModal={() => this.handleUpdateModal(false)}
          handleFormSubmit={this.handleUpdateForm}
          title={`修改${title}`}
          label={label}
          limit={limit}
          value={value || []}
          info={info}
        />
      </div>
    );
  }
}

export default Feature;
