import { Request, Response } from 'express';
import { MethodData } from './data';

const methods: MethodData[] = [
  {
    id: 'ALL',
    name: 'HTTP ALL',
    remark: 'http的所有方法',
  },
  {
    id: 'GET',
    name: 'HTTP GET',
    remark: 'http的get方法',
  },
  {
    id: 'POST',
    name: 'HTTP POST',
    remark: 'http的post方法',
  },
  {
    id: 'PUT',
    name: 'HTTP PUT',
    remark: 'http的put方法',
  },
  {
    id: 'DELETE',
    name: 'HTTP DELETE',
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
  const list = methods
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
  'GET /api/method': find,
  'POST /api/method': create,
  'PUT /api/method/:id': update,
  'DELETE /api/method/:id': remove,
};
