import React from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Row, Col, Input, Button, Divider, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { ActionListData, ActionData, Pagination, QueryData } from './data';
import { ModelState } from './model';
import Create from './Create';

import styles from './style.less';

interface ActionProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  data: ActionListData;
  query: QueryData;
  loading: boolean;
}

const Action: React.FC<ActionProps> = props => {
  const [isCreateShow, setIsCreateShow] = React.useState<boolean>(false);
  const [isUpdateShow, setIsUpdateShow] = React.useState<boolean>(false);
  const [info, setInfo] = React.useState<Partial<ActionData>>({});

  React.useEffect(() => {
    props.dispatch({ type: 'action/find' });
  }, []);

  const { form, query, data, loading } = props;

  const handleQuery = (e: any) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        props.dispatch({
          type: 'action/find',
          payload: value,
        });
      }
    });
  };

  const handleTable = (
    pagination: Partial<Pagination>,
    filters: Record<keyof ActionData, string[]>,
    sorter: SorterResult<ActionData>,
  ) => {
    props.dispatch({
      type: 'action/find',
      payload: {
        ...props.query,
        ...pagination,
      },
    });
  };

  const handleCreateForm = (record: ActionData) => {
    props.dispatch({
      type: 'action/save',
      payload: record,
      callback: () => setIsCreateShow(false),
    });
  };

  const handleUpdate = (record: ActionData) => {
    setInfo(record);
    setIsUpdateShow(true);
  };

  const handleUpdateForm = (record: ActionData) => {
    props.dispatch({
      type: 'action/update',
      payload: {
        id: record.id,
        payload: record,
      },
      callback: () => setIsUpdateShow(false),
    });
  };

  const handleRemove = (record: ActionData) => {
    props.dispatch({
      type: 'action/remove',
      payload: record.id,
      callback: () => message.success('删除成功'),
    });
  };

  const columns = [
    {
      title: formatMessage({ id: 'action.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'action.columns.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'action.columns.remark' }),
      dataIndex: 'remark',
    },
    {
      title: formatMessage({ id: 'action.options' }),
      render: (_: any, record: ActionData) => (
        <React.Fragment>
          <a onClick={() => handleRemove(record)}>
            <FormattedMessage id="action.options.remove" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdate(record)}>
            <FormattedMessage id="action.options.update" />
          </a>
        </React.Fragment>
      ),
    },
  ];

  const { getFieldDecorator } = form;

  return (
    <PageHeaderWrapper title={formatMessage({ id: 'action.title' })}>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Form layout="inline" onSubmit={handleQuery}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <Form.Item label={formatMessage({ id: 'action.query.id.label' })}>
                    {getFieldDecorator('id', {
                      initialValue: query.id,
                    })(<Input placeholder={formatMessage({ id: 'action.query.id.label' })} />)}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label={formatMessage({ id: 'action.query.name.label' })}>
                    {getFieldDecorator('name', {
                      initialValue: query.name,
                    })(<Input placeholder={formatMessage({ id: 'action.query.name.label' })} />)}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">
                      <FormattedMessage id="action.button.query" />
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
                      <FormattedMessage id="action.button.reset" />
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => setIsCreateShow(true)}>
              <FormattedMessage id="action.button.create" />
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
        title={formatMessage({ id: 'action.create.title' })}
        visible={isCreateShow}
        hideModal={() => setIsCreateShow(false)}
        handleFormSubmit={handleCreateForm}
        info={{}}
      />
      <Create
        title={formatMessage({ id: 'action.update.title' })}
        visible={isUpdateShow}
        hideModal={() => setIsUpdateShow(false)}
        handleFormSubmit={handleUpdateForm}
        info={info}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create<ActionProps>()(
  connect(
    ({
      action,
      loading,
    }: {
      action: ModelState;
      loading: { models: { [key: string]: boolean } };
    }) => ({
      data: action.data,
      query: action.query,
      loading: loading.models.action,
    }),
  )(Action),
);
