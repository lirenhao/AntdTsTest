import React from 'react';
import { FormComponentProps } from 'antd/es/form';
import { formatMessage } from 'umi-plugin-react/locale';
import { Form, Modal, Input } from 'antd';
import { MenuData } from './data';

interface CreatePops extends FormComponentProps {
  title: string;
  visible: boolean;
  hideModal(): void;
  handleFormSubmit(record: MenuData): void;
  info: Partial<MenuData>;
}

const Create: React.SFC<CreatePops> = props => {
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
  };

  const { form, title, visible, hideModal, handleFormSubmit, info } = props;
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
    <Modal
      width="60%"
      bodyStyle={{ padding: '32px 40px 48px' }}
      title={title}
      maskClosable={false}
      visible={visible}
      okText={formatMessage({ id: 'menu.form.submit' })}
      onOk={handleSubmit}
      onCancel={hideModal}
    >
      <Form>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'menu.form.id.label' })}>
          {getFieldDecorator('id', {
            initialValue: info.id,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'menu.form.id.required' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'menu.form.id.placeholder' })} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'menu.form.name.label' })}>
          {getFieldDecorator('name', {
            initialValue: info.name,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'menu.form.name.required' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'menu.form.name.placeholder' })} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'menu.form.icon.label' })}>
          {getFieldDecorator('icon', {
            initialValue: info.icon,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'menu.form.icon.required' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'menu.form.icon.placeholder' })} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'menu.form.path.label' })}>
          {getFieldDecorator('path', {
            initialValue: info.path,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'menu.form.path.required' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'menu.form.path.placeholder' })} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'menu.form.locale.label' })}>
          {getFieldDecorator('locale', {
            initialValue: info.locale,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'menu.form.locale.required' }),
              },
            ],
          })(<Input placeholder={formatMessage({ id: 'menu.form.locale.placeholder' })} />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'menu.form.remark.label' })}>
          {getFieldDecorator('remark', {
            initialValue: info.remark,
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'menu.form.remark.required' }),
              },
            ],
          })(
            <Input.TextArea
              style={{ minHeight: 32 }}
              placeholder={formatMessage({ id: 'menu.form.remark.placeholder' })}
              rows={3}
            />,
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create<CreatePops>()(Create);
