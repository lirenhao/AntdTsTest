import { Request, Response } from 'express';
import { RoleData } from './data.d';

const roles: RoleData[] = [
  {
    id: 'admin',
    name: '管理员角色',
    remark: '管理员角色具有所有权限'
  },
  {
    id: 'user',
    name: '用户角色',
    remark: '用户角色只有部分权限'
  },
  {
    id: 'test',
    name: '测试角色',
    remark: '测试角色具有测试权限'
  },
  {
    id: 'abc',
    name: 'abc角色',
    remark: 'abc角色只有部分权限'
  },
  {
    id: 'def',
    name: 'def角色',
    remark: 'def角色具有所有权限'
  },
  {
    id: 'ghl',
    name: 'ghl角色',
    remark: 'ghl角色只有部分权限'
  },
]

function find(req: Request, res: Response) {
  const params = req.query;
  let pageSize = 5;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }
  let current = 1;
  if (params.current) {
    current = params.current * 1;
  }
  const list = roles
    .filter(item => !params.id || params.id === '' || params.id === item.id)
    .filter(item => !params.name || params.name === '' || params.name === item.name)
  res.json({
    list: list.slice((current - 1) * pageSize, current * pageSize),
    pagination: {
      total: list.length,
      pageSize,
      current,
    },
  });
}

function create(req: Request, res: Response) {
  console.log(req.body);
  find(req, res);
}

function update(req: Request, res: Response) {
  const { id } = req.params;
  console.log(id, req.body);
  find(req, res);
}

function remove(req: Request, res: Response) {
  const { id } = req.params;
  console.log(id);
  res.status(200).end();
}

export default {
  'GET /api/role': find,
  'POST /api/role': create,
  'PUT /api/role/:id': update,
  'DELETE /api/role/:id': remove,
};
