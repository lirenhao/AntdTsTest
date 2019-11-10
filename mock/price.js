import path from 'path';
import jsonfile from 'jsonfile';

const file = path.resolve('mock/data/price.json');

function findPrice(req, res) {
  const { key } = req.params;
  jsonfile
    .readFile(file)
    .then(dataSource => {
      const data = dataSource[key] || {};
      res.json(data);
    })
    .catch(error => res.status(500).send(error));
}

function savePrice(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { key } = req.params;
  jsonfile
    .readFile(file)
    .then(dataSource => {
      // eslint-disable-next-line no-param-reassign
      dataSource[key] = { ...body };
      jsonfile.writeFileSync(file, dataSource, { spaces: 2 });
      res.json(true);
    })
    .catch(error => res.status(500).send(error));
}

export default {
  'GET /api/productPrice/:key': findPrice,
  'POST /api/productPrice/:key': savePrice,
};
