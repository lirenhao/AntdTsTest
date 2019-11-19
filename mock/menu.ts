import { Request, Response } from 'express';

const menuData = [
  {
    name: 'account',
    icon: 'smile',
    path: '/account',
    locale: 'menu.account',
  },
  {
    name: 'product',
    icon: 'smile',
    path: '/product',
    locale: 'menu.product',
  },
  {
    name: 'order',
    icon: 'smile',
    path: '/order',
    locale: 'menu.order',
  }
]

function getMenus(req: Request, res: Response) {
  return res.json(menuData);
}

export default {
  'GET /api/menu': getMenus
}