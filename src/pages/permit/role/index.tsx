import React from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Row, Col, Input, Button, Divider, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { RoleListData, RoleData, Pagination, QueryData } from './data';
import { ModelState } from './model';
import Create from './Create';

import styles from './style.less';

interface RoleProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  data: RoleListData;
  query: QueryData;
  loading: boolean;
}

const Role: React.FC<RoleProps> = props => {

  const [isCreateShow, setIsCreateShow] = React.useState<boolean>(false);
  const [isUpdateShow, setIsUpdateShow] = React.useState<boolean>(false);
  const [info, setInfo] = React.useState<Partial<RoleData>>({});

  React.useEffect(() => {
    props.dispatch({ type: 'role/find' });
  }, []);

  const handleQuery = (e: any) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        props.dispatch({
          type: 'role/find',
          payload: value,
        });
      }
    });
  };

  const handleTable = (pagination: Partial<Pagination>,
    filters: Record<keyof RoleData, string[]>, sorter: SorterResult<RoleData>) => {
    props.dispatch({
      type: 'role/find',
      payload: {
        ...props.query,
        ...pagination,
      },
    });
  };

  const handleCreateForm = (record: RoleData) => {
    props.dispatch({
      type: 'role/save',
      payload: record,
      callback: () => setIsCreateShow(false),
    });
  };

  const handleUpdate = (record: RoleData) => {
    setInfo(record);
    setIsUpdateShow(true);
  };

  const handleUpdateForm = (record: RoleData) => {
    props.dispatch({
      type: 'role/update',
      payload: {
        id: record.id,
        payload: record,
      },
      callback: () => setIsUpdateShow(false),
    });
  };

  const handleRemove = (record: RoleData) => {
    props.dispatch({
      type: 'role/remove',
      payload: record.id,
      callback: () => message.success('删除成功'),
    });
  };

  const columns = [
    {
      title: formatMessage({ id: 'role.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'role.columns.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'role.columns.remark' }),
      dataIndex: 'remark',
    },
    {
      title: formatMessage({ id: 'role.options' }),
      render: (_: any, record: RoleData) => (
        <React.Fragment>
          <a onClick={() => handleRemove(record)}>
            <FormattedMessage id='role.options.remove' />
          </a>
          <Divider type='vertical' />
          <a onClick={() => handleUpdate(record)}>
            <FormattedMessage id='role.options.update' />
          </a>
        </React.Fragment>
      ),
    },
  ]

  const { form, query, data, loading } = props;
  const { getFieldDecorator } = form;

  return (
    <PageHeaderWrapper title={formatMessage({ id: 'role.title' })}>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Form layout="inline" onSubmit={handleQuery}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <Form.Item label={formatMessage({ id: 'role.query.id.label' })}>
                    {getFieldDecorator('id', {
                      initialValue: query.id,
                    })(
                      <Input placeholder={formatMessage({ id: 'role.query.id.label' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label={formatMessage({ id: 'role.query.name.label' })}>
                    {getFieldDecorator('name', {
                      initialValue: query.name,
                    })(
                      <Input placeholder={formatMessage({ id: 'role.query.name.label' })} />
                    )}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">
                      <FormattedMessage id='role.button.query' />
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
                      <FormattedMessage id='role.button.reset' />
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => setIsCreateShow(true)}>
              <FormattedMessage id='role.button.create' />
            </Button>
          </div>
          <Table
            loading={loading}
            dataSource={data.list}
            pagination={data.pagination}
            onChange={handleTable}
            columns={columns}
            rowKey={record => record.id}
          />
        </div>
      </Card>
      <Create
        title={formatMessage({ id: 'role.create.title' })}
        visible={isCreateShow}
        hideModal={() => setIsCreateShow(false)}
        handleFormSubmit={handleCreateForm}
        info={{}}
      />
      <Create
        title={formatMessage({ id: 'role.update.title' })}
        visible={isUpdateShow}
        hideModal={() => setIsUpdateShow(false)}
        handleFormSubmit={handleUpdateForm}
        info={info}
      />
    </PageHeaderWrapper>
  );
}

export default Form.create<RoleProps>()(
  connect(({ role, loading }: {
    role: ModelState,
    loading: { models: { [key: string]: boolean; }; };
  }) => ({
    data: role.data,
    query: role.query,
    loading: loading.models.role,
  }))(Role)
);
