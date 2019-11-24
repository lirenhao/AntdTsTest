import path from 'path';
import jsonfile from 'jsonfile';

const paths = {
  method: path.resolve('mock/data/method.json'),
  rest: path.resolve('mock/data/rest.json'),
  menu: path.resolve('mock/data/menu.json'),
  role: path.resolve('mock/data/role.json'),
}

const find = key => (req, res) => {
  const params = req.query;
  let pageSize = 5;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }
  let current = 1;
  if (params.current) {
    current = params.current * 1;
  }
  jsonfile
    .readFile(paths[key])
    .then(dataSource => {
      const list = dataSource
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
    })
    .catch(error => res.status(500).send(error));
}

const save = key => (req, res, u, b) => {
  const body = (b && b.body) || req.body;
  jsonfile
    .readFile(paths[key])
    .then(dataSource => {
      jsonfile.writeFileSync(paths[key], [...dataSource, body], { spaces: 2 });
      find(key)(req, res);
    })
    .catch(error => res.status(500).send(error));
}

const update = key => (req, res, u, b) => {
  const body = (b && b.body) || req.body;
  const { id } = req.params;
  jsonfile
    .readFile(paths[key])
    .then(dataSource => {
      jsonfile.writeFileSync(
        paths[key],
        dataSource.map(item => (item.id === body.id ? { ...item, ...body } : item)),
        { spaces: 2 }
      );
      find(key)(req, res);
    })
    .catch(error => res.status(500).send(error));
}

const remove = key => (req, res) => {
  const { id } = req.params;
  jsonfile
    .readFile(paths[key])
    .then(dataSource => {
      jsonfile.writeFileSync(
        paths[key],
        dataSource.filter(item => item.id !== id),
        { spaces: 2 }
      );
      res.end();
    })
    .catch(error => res.status(500).send(error));
}

const basic = key => ({
  [`GET /api/${key}`]: find(key),
  [`POST /api/${key}`]: save(key),
  [`PUT /api/${key}/:id`]: update(key),
  [`DELETE /api/${key}/:id`]: remove(key),
})

export default {
  ...basic('method'),
  ...basic('menu'),
  ...basic('rest'),
  ...basic('role'),
};
