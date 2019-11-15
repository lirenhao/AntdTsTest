import React from 'react';
import { connect } from 'dva';
import { List, Button } from 'antd';
import { DictStateType, ProductFeatureTypeDict, ProductFeatureDict } from '@/models/dict'
import { ProductFeature } from '../../data';
import Create from './Create';

interface FeatureProps {
  productFeatureType?: ProductFeatureTypeDict[];
  productFeature?: ProductFeatureDict[];
  value: ProductFeature[];
  onChange?: (value: ProductFeature[]) => void;
  title: string;
  label: string;
  limit: {
    featureTypeIds: string[];
    featureIds: string[];
  };
  setLimit: (e: any) => void;
}

const Feature: React.FC<FeatureProps> = props => {
  const [state, setState] = React.useState({
    isCreateShow: false,
    isUpdateShow: false,
    info: {},
  });

  const {
    productFeatureType, productFeature, title, label, value, onChange, limit, setLimit
  } = props;

  const handleAddModal = (visible: boolean) => {
    setState({
      ...state,
      isCreateShow: visible
    });
  };

  const handleAddForm = (record: ProductFeature) => {
    if (onChange) {
      onChange([...value, record]);
    }
    setLimit({
      featureTypeIds: [...limit.featureTypeIds, record.featureTypeId],
      featureIds: [...limit.featureIds, ...record.featureIds],
    });
    handleAddModal(false);
  };

  const handleUpdateModal = (visible: boolean) => {
    setState({
      ...state,
      isUpdateShow: visible
    });
  };

  const handleUpdate = (record: ProductFeature) => {
    setState({
      ...state,
      isUpdateShow: true,
      info: record
    });
  };

  const handleUpdateForm = (record: ProductFeature, info: Partial<ProductFeature>) => {
    const newValue = value
      .map((item: ProductFeature) => (info.featureTypeId === item.featureTypeId ? record : item));
    if (onChange) onChange(newValue);
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
    handleUpdateModal(false);
  };

  const handleRemove = (record: ProductFeature) => {
    if (onChange) onChange(value.filter((item: ProductFeature) => record.featureTypeId !== item.featureTypeId));
    setLimit({
      featureTypeIds: [...limit.featureTypeIds.filter((id: string) => id !== record.featureTypeId)],
      featureIds: [...limit.featureIds.filter((id: string) => record.featureIds.indexOf(id) < 0)],
    });
  };

  const getFeatureTypeName = (featureTypeId: string) => {
    const data = (productFeatureType || [])
      .filter((item: ProductFeatureTypeDict) => item.productFeatureTypeId === featureTypeId);
    return data && data[0] ? data[0].productFeatureTypeName : featureTypeId;
  }

  const getFeatureName = (featureId: string) => {
    const data = (productFeature || [])
      .filter((item: ProductFeatureDict) => item.productFeatureId === featureId);
    return data && data[0] ? data[0].productFeatureName : featureId;
  }

  return (
    <div>
      <Button onClick={() => handleAddModal(true)}>添加</Button>
      {value && value.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={value}
          renderItem={(item: ProductFeature) => (
            <List.Item
              actions={[
                <a onClick={() => handleUpdate(item)}>修改</a>,
                <a onClick={() => handleRemove(item)}>删除</a>,
              ]}
            >
              <List.Item.Meta
                title={getFeatureTypeName(item.featureTypeId)}
                description={item.featureIds
                  .map((id: string) => getFeatureName(id))
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
        visible={state.isCreateShow}
        hideModal={() => handleAddModal(false)}
        handleFormSubmit={handleAddForm}
        title={`添加${title}`}
        label={label}
        limit={limit}
        value={value || []}
        info={{}}
      />
      <Create
        visible={state.isUpdateShow}
        hideModal={() => handleUpdateModal(false)}
        handleFormSubmit={handleUpdateForm}
        title={`修改${title}`}
        label={label}
        limit={limit}
        value={value || []}
        info={state.info}
      />
    </div>
  );
}

export default connect(({ dict }: {
  dict: DictStateType;
}) => ({
  productFeatureType: dict.productFeatureType,
  productFeature: dict.productFeature,
}))(Feature);
