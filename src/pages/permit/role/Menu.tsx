import React from 'react';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/es/form';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Drawer, Input, Button } from 'antd';
import { RoleData, RoleMenuData } from './data';

interface MenuPops extends FormComponentProps {
  loading?: boolean;
  title: string;
  visible: boolean;
  hideModal(): void;
  handleFormSubmit(record: RoleMenuData): void;
  info: Partial<RoleData>;
}

const Menu: React.SFC<MenuPops> = props => {

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
  }

  const { form, title, visible, hideModal, handleFormSubmit, info, loading } = props;
  const { getFieldDecorator } = form;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        handleFormSubmit({ ...info, ...value });
        form.resetFields();
      }
    });
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
      <Form>
        <Form.Item {...formItemLayout}
          label={formatMessage({ id: 'role.form.id.label' })}
        >
          {getFieldDecorator('id', {
            initialValue: info.id,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'role.form.id.required' }),
              },
            ],
          })(
            <Input placeholder={formatMessage({ id: 'role.form.id.placeholder' })} />
          )}
        </Form.Item>
        <Form.Item {...formItemLayout}
          label={formatMessage({ id: 'role.form.name.label' })}
        >
          {getFieldDecorator('name', {
            initialValue: info.name,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'role.form.name.required' }),
              },
            ],
          })(
            <Input placeholder={formatMessage({ id: 'role.form.name.placeholder' })} />
          )}
        </Form.Item>
      </Form>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px',
        }}
      >
        <Button style={{ marginRight: 8 }} onClick={hideModal} >
          取消
        </Button>
        <Button onClick={handleSubmit} type="primary" loading={loading}>
          提交
        </Button>
      </div>
    </Drawer>
  );
}

export default Form.create<MenuPops>()(
  connect(({ loading }: {
    loading: { effects: { [key: string]: boolean } };
  }) => ({
    loading: loading.effects['role/saveMenu'],
  }))(Menu)
);
