import path from 'path';
import jsonfile from 'jsonfile';

const productPath = path.resolve('mock/data/product.json');
const pricePath = path.resolve('mock/data/price.json');
const orderPath = path.resolve('mock/data/order.json');

let index = 100;

function queryProduct(req, res, u, b) {
  const { productTypeId, productCategotyId } = (b && b.body) || req.body;
  jsonfile
    .readFile(productPath)
    .then(dataSource => {
      const products = Object.keys(dataSource).map(key => dataSource[key]);
      res.json(
        products.filter(
          item =>
            item.productCategotyId === productCategotyId && item.productTypeId === productTypeId,
        ),
      );
    })
    .catch(error => res.status(500).send(error));
}

function queryPrice(req, res, u, b) {
  const { productId } = (b && b.body) || req.body;
  jsonfile
    .readFile(pricePath)
    .then(dataSource => {
      res.json(dataSource[productId]);
    })
    .catch(error => res.status(500).send(error));
}

async function findProductPrice(req, res) {
  const { key } = req.params;
  const products = jsonfile.readFileSync(productPath);
  const prices = jsonfile.readFileSync(pricePath);
  res.json({ productInfo: products[key], productPrice: prices[key] });
}

function find(req, res) {
  jsonfile
    .readFile(orderPath)
    .then(dataSource => {
      const list = Object.keys(dataSource).map(key => dataSource[key]);
      res.json({
        list,
        pagination: {
          total: list.length,
          pageSize: 10,
          current: 0,
        },
      });
    })
    .catch(error => res.status(500).send(error));
}

function save(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const key = index.toString();
  index += 1;
  jsonfile
    .readFile(orderPath)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      dataSource[key] = {
        ...body,
        orderId: key,
      };
      jsonfile.writeFileSync(orderPath, dataSource, { spaces: 2 });
      find(req, res, u);
    })
    .catch(error => res.status(500).send(error));
}

function update(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { key } = req.params;
  jsonfile
    .readFile(orderPath)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      dataSource[key] = {
        ...body,
      };
      jsonfile.writeFileSync(orderPath, dataSource, { spaces: 2 });
      find(req, res, u);
    })
    .catch(error => res.status(500).send(error));
}

function remove(req, res) {
  const { key } = req.params;
  jsonfile
    .readFile(orderPath)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      delete dataSource[key];
      jsonfile.writeFileSync(orderPath, dataSource, { spaces: 2 });
      res.send('success');
    })
    .catch(error => res.status(500).send(error));
}

export default {
  'POST /api/order/queryProduct': queryProduct,
  'POST /api/order/queryPrice': queryPrice,
  'GET /api/order/findProductPrice/:key': findProductPrice,
  'GET /api/order': find,
  'POST /api/order': save,
  'PUT /api/order/:key': update,
  'DELETE /api/order/:key': remove,
};
