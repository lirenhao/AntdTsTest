import path from 'path';
import jsonfile from 'jsonfile';

const file = path.resolve('mock/data/dict.json');

function getDict(req, res) {
  jsonfile
    .readFile(file)
    .then(dataSource => {
      res.json(dataSource);
    })
    .catch(error => res.status(500).send(error));
}

export default {
  'GET /api/dict': getDict,
};
