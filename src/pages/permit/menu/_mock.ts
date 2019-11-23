import { Request, Response } from 'express';
import { MenuData } from './data';

const menus: MenuData[] = [
  {
    id: '',
    name: '',
    icon: '',
    path: '',
    locale: '',
    remark: 'http的所有方法',
  },
  {
    id: '',
    name: '',
    icon: '',
    path: '',
    locale: '',
    remark: 'http的所有方法',
  },
  {
    id: '',
    name: '',
    icon: '',
    path: '',
    locale: '',
    remark: 'http的所有方法',
  },
  {
    id: '',
    name: '',
    icon: '',
    path: '',
    locale: '',
    remark: 'http的所有方法',
  },
  {
    id: '',
    name: '',
    icon: '',
    path: '',
    locale: '',
    remark: 'http的所有方法',
  },
];

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
  const list = menus
    .filter(item => !params.id || params.id === '' || params.id === item.id)
    .filter(item => !params.name || params.name === '' || params.name === item.name);
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
  'GET /api/menu': find,
  'POST /api/menu': create,
  'PUT /api/menu/:id': update,
  'DELETE /api/menu/:id': remove,
};
