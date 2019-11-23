import { Request, Response } from 'express';
import { RestData } from './data.d';

const rests: RestData[] = [
  {
    id: '1',
    path: '/api/test',
    method: 'ALL',
    remark: 'http的所有方法',
  },
  {
    id: '2',
    path: '/api/test',
    method: 'GET',
    remark: 'http的get方法',
  },
  {
    id: '3',
    path: '/api/test',
    method: 'POST',
    remark: 'http的post方法',
  },
  {
    id: '4',
    path: '/api/test',
    method: 'PUT',
    remark: 'http的put方法',
  },
  {
    id: '5',
    path: '/api/test',
    method: 'DELETE',
    remark: 'http的delete方法',
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
  const list = rests
    .filter(item => !params.path || params.path === '' || params.path === item.path)
    .filter(item => !params.method || params.method === '' || params.method === item.method);
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
  'GET /api/rest': find,
  'POST /api/rest': create,
  'PUT /api/rest/:id': update,
  'DELETE /api/rest/:id': remove,
};
