const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucket = storage.bucket('grommet-sites');

/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.sites = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
    return;
  }
  if (req.method === 'GET') {
    const id = decodeURIComponent(req.url.split('/')[1]);
    const file = bucket.file(`${id}.json`);
    return file.download()
      .then((data) => {
        const site = JSON.parse(data[0]);
        const date = new Date(site.date);
        date.setMilliseconds(0);
        site.date = date.toISOString();
        res.status(200).type('json').send(JSON.stringify(site));
      })
      .catch(e => res.status(400).send(e.message));
  }
  if (req.method === 'POST') {
    const site = req.body;
    const id = encodeURIComponent(`${site.name}-${site.email.replace('@', '-')}`.replace(/\.|\s+/g, '-'));
    const file = bucket.file(`${id}.json`);
    return file.download()
      .then((data) => {
        const existingSite = JSON.parse(data[0]);

        const existingPin = (new Date(existingSite.date)).getMilliseconds();
        const pin = (new Date(site.date)).getMilliseconds();
        if (pin !== existingPin) {
          res.status(403).send('Unauthorized');
          return;
        }

        file.save(JSON.stringify(site), { resumable: false })
          .then(() => res.status(200).type('text').send(id))
          .catch(e => res.status(500).send(e.message))
      })
      .catch(() => {
        // doesn't exist yet, add it
        file.save(JSON.stringify(site), { resumable: false })
          .then(() => res.status(201).type('text').send(id))
          .catch(e => res.status(500).send(e.message))
      });
  }
  res.status(405).send();
};
