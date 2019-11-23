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
  },
  {
    name: 'permit',
    icon: 'smile',
    path: '/permit',
    children: [
      {
        name: 'method',
        icon: 'smile',
        path: '/permit/method',
      },
      {
        name: 'rest',
        icon: 'smile',
        path: '/permit/rest',
      },
      {
        name: 'menu',
        icon: 'smile',
        path: '/permit/menu',
      },
      {
        name: 'role',
        icon: 'smile',
        path: '/permit/role',
      },
    ],
  },
];

function getMenus(req: Request, res: Response) {
  return res.json(menuData);
}

export default {
  'GET /api/user/menu': getMenus,
};
