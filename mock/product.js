import path from 'path';
import jsonfile from 'jsonfile';

let index = 100;
const file = path.resolve('mock/data/product.json');
const pricePath = path.resolve('mock/data/price.json');

function query(req, res) {
  jsonfile
    .readFile(file)
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
    .readFile(file)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      dataSource[key] = {
        ...body,
        productId: key,
      };
      jsonfile.writeFileSync(file, dataSource, { spaces: 2 });
      query(req, res);
    })
    .catch(error => res.status(500).send(error));
}

function update(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { key } = req.params;
  jsonfile
    .readFile(file)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      dataSource[key] = {
        ...body,
      };
      jsonfile.writeFileSync(file, dataSource, { spaces: 2 });
      // 删除价格
      const prices = jsonfile.readFileSync(pricePath);
      delete prices[key];
      jsonfile.writeFileSync(pricePath, prices, { spaces: 2 });
      query(req, res, u);
    })
    .catch(error => res.status(500).send(error));
}

function remove(req, res) {
  const { key } = req.params;
  jsonfile
    .readFile(file)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      delete dataSource[key];
      jsonfile.writeFileSync(file, dataSource, { spaces: 2 });
      res.end();
    })
    .catch(error => res.status(500).send(error));
}

export default {
  'GET /api/product': query,
  'POST /api/product': save,
  'PUT /api/product/:key': update,
  'DELETE /api/product/:key': remove,
};
