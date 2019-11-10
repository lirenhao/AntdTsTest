import React from 'react';
import { Card, Form, Radio, Input, DatePicker, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import moment from 'moment';
import { OrderType } from '../data';

interface BasicInfoProps extends FormComponentProps {
  info: Partial<OrderType>;
  handleNext(info: Partial<OrderType>): void;
  handlePrev(): void;
}

class BasicInfo extends React.Component<BasicInfoProps> {
  handleSubmit = (e: any) => {
    const { handleNext, form, info } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        handleNext({
          ...info,
          ...values,
          orderDate: values.orderDate.format('YYYY-MM-DD'),
        });
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      info,
      handlePrev,
    } = this.props;

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

    return (
      <React.Fragment>
        <div
          style={{
            marginTop: '16px',
            border: '1px dashed #e9e9e9',
            borderRadius: '6px',
            backgroundColor: '#fafafa',
            minHeight: '200px',
            textAlign: 'center',
          }}
        >
          <Card title="输入订单信息" bordered={false}>
            <Form>
              <Form.Item {...formItemLayout} label="客户分期">
                {getFieldDecorator('instalmentTypeEnumId', {
                  initialValue: info.instalmentTypeEnumId || '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择分期',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="0">完全不分期</Radio>
                    <Radio value="1">分一期</Radio>
                    <Radio value="2">分两期</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="续费状态">
                {getFieldDecorator('renewalFeeStatusId', {
                  initialValue: info.renewalFeeStatusId || '0',
                  rules: [
                    {
                      required: true,
                      message: '请选择续费状态',
                    },
                  ],
                })(
                  <Radio.Group>
                    <Radio value="0">否</Radio>
                    <Radio value="1">是</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="公司法人">
                {getFieldDecorator('legalPartyGroupName', {
                  initialValue: info.legalPartyGroupName,
                  rules: [
                    {
                      required: true,
                      message: '请输入公司法人',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="公司名称">
                {getFieldDecorator('corpName', {
                  initialValue: info.corpName,
                  rules: [
                    {
                      required: true,
                      message: '请输入公司名称',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="合同类型">
                {getFieldDecorator('agreementTypeId', {
                  initialValue: info.agreementTypeId,
                  rules: [
                    {
                      required: true,
                      message: '请输入合同类型',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="合同编号">
                {getFieldDecorator('agreementCode', {
                  initialValue: info.agreementCode,
                  rules: [
                    {
                      required: true,
                      message: '请输入合同编号',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label="订单日期">
                {getFieldDecorator('orderDate', {
                  initialValue: moment(info.orderDate),
                  rules: [
                    {
                      required: true,
                      message: '请选择订单日期',
                    },
                  ],
                })(
                  <DatePicker
                    style={{
                      width: '100%',
                    }}
                    placeholder="选择日期"
                  />
                )}
              </Form.Item>
              <Form.Item {...formItemLayout} label="服务佣金">
                {getFieldDecorator('serviceCommission', {
                  initialValue: info.serviceCommission,
                  rules: [
                    {
                      required: true,
                      message: '请输入服务佣金',
                    },
                    {
                      pattern: /^(\d+)((?:\.\d{1,2})?)$/,
                      message: '请输入合法金额数字',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </Form.Item>
            </Form>
          </Card>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
            left: 0,
            background: '#fff',
            borderRadius: '0 0 4px 4px',
          }}
        >
          <Button type="primary" onClick={this.handleSubmit}>
            下一步
          </Button>
          <Button onClick={handlePrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default Form.create<BasicInfoProps>()(BasicInfo);
