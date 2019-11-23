import React from 'react';
import { connect } from 'dva';
import { Card, Table, Form, Row, Col, Input, Button, Divider, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { SorterResult } from 'antd/es/table';
import { MenuListData, MenuData, Pagination, QueryData } from './data';
import { ModelState } from './model';
import Create from './Create';

import styles from './style.less';

interface MenuProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  data: MenuListData;
  query: QueryData;
  loading: boolean;
}

const Menu: React.FC<MenuProps> = props => {
  const [isCreateShow, setIsCreateShow] = React.useState<boolean>(false);
  const [isUpdateShow, setIsUpdateShow] = React.useState<boolean>(false);
  const [info, setInfo] = React.useState<Partial<MenuData>>({});

  React.useEffect(() => {
    props.dispatch({ type: 'menu/find' });
  }, []);

  const handleQuery = (e: any) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        props.dispatch({
          type: 'menu/find',
          payload: value,
        });
      }
    });
  };

  const handleTable = (
    pagination: Partial<Pagination>,
    filters: Record<keyof MenuData, string[]>,
    sorter: SorterResult<MenuData>,
  ) => {
    props.dispatch({
      type: 'menu/find',
      payload: {
        ...props.query,
        ...pagination,
      },
    });
  };

  const handleCreateForm = (record: MenuData) => {
    props.dispatch({
      type: 'menu/save',
      payload: record,
      callback: () => setIsCreateShow(false),
    });
  };

  const handleUpdate = (record: MenuData) => {
    setInfo(record);
    setIsUpdateShow(true);
  };

  const handleUpdateForm = (record: MenuData) => {
    props.dispatch({
      type: 'menu/update',
      payload: {
        id: record.id,
        payload: record,
      },
      callback: () => setIsUpdateShow(false),
    });
  };

  const handleRemove = (record: MenuData) => {
    props.dispatch({
      type: 'menu/remove',
      payload: record.id,
      callback: () => message.success('删除成功'),
    });
  };

  const columns = [
    {
      title: formatMessage({ id: 'menu.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: formatMessage({ id: 'menu.columns.name' }),
      dataIndex: 'name',
    },
    {
      title: formatMessage({ id: 'menu.columns.icon' }),
      dataIndex: 'icon',
    },
    {
      title: formatMessage({ id: 'menu.columns.path' }),
      dataIndex: 'path',
    },
    {
      title: formatMessage({ id: 'menu.columns.locale' }),
      dataIndex: 'locale',
    },
    {
      title: formatMessage({ id: 'menu.columns.remark' }),
      dataIndex: 'remark',
    },
    {
      title: formatMessage({ id: 'menu.options' }),
      render: (_: any, record: MenuData) => (
        <React.Fragment>
          <a onClick={() => handleRemove(record)}>
            <FormattedMessage id="menu.options.remove" />
          </a>
          <Divider type="vertical" />
          <a onClick={() => handleUpdate(record)}>
            <FormattedMessage id="menu.options.update" />
          </a>
        </React.Fragment>
      ),
    },
  ];

  const { form, query, data, loading } = props;
  const { getFieldDecorator } = form;

  return (
    <PageHeaderWrapper title={formatMessage({ id: 'menu.title' })}>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Form layout="inline" onSubmit={handleQuery}>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <Form.Item label={formatMessage({ id: 'menu.query.id.label' })}>
                    {getFieldDecorator('id', {
                      initialValue: query.id,
                    })(<Input placeholder={formatMessage({ id: 'menu.query.id.label' })} />)}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label={formatMessage({ id: 'menu.query.name.label' })}>
                    {getFieldDecorator('name', {
                      initialValue: query.name,
                    })(<Input placeholder={formatMessage({ id: 'menu.query.name.label' })} />)}
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">
                      <FormattedMessage id="menu.button.query" />
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={() => form.resetFields()}>
                      <FormattedMessage id="menu.button.reset" />
                    </Button>
                  </span>
                </Col>
              </Row>
            </Form>
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => setIsCreateShow(true)}>
              <FormattedMessage id="menu.button.create" />
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
        title={formatMessage({ id: 'menu.create.title' })}
        visible={isCreateShow}
        hideModal={() => setIsCreateShow(false)}
        handleFormSubmit={handleCreateForm}
        info={{}}
      />
      <Create
        title={formatMessage({ id: 'menu.update.title' })}
        visible={isUpdateShow}
        hideModal={() => setIsUpdateShow(false)}
        handleFormSubmit={handleUpdateForm}
        info={info}
      />
    </PageHeaderWrapper>
  );
};

export default Form.create<MenuProps>()(
  connect(
    ({ menu, loading }: { menu: ModelState; loading: { models: { [key: string]: boolean } } }) => ({
      data: menu.data,
      query: menu.query,
      loading: loading.models.menu,
    }),
  )(Menu),
);
