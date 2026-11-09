import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
  tomate: ['1592842211516-1f6a157c9135', '1561136594165-3a5c68f763db', '1524222835726-8e6d24606b4b'],
  carotte: ['1598170845058-2977759a9971', '1445282768818-728615cd2b9a', '1582400977218-1e479a4ec410'],
  chou: ['1556804561-2495d4681c62', '1597544078941-8c46c4f34698', '1518977676601-b79f16060c23'],
  banane: ['1571562235923-d3493bafc764', '1528825871115-3581a5387919', '1603833665858-e61d47505140'],
  mandarine: ['1557800636-894a64c1696f', '1580828369019-cea98ad44203', '1611080665311-5dc07380f2d9']
};

const dir = path.join(process.cwd(), 'public', 'images', 'maraichage');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading images...');
  for (const [crop, ids] of Object.entries(images)) {
    for (let i = 0; i < ids.length; i++) {
      const url = `https://images.unsplash.com/photo-${ids[i]}?auto=format&fit=crop&w=800&q=80`;
      const dest = path.join(dir, `${crop}-${i + 1}.jpg`);
      try {
        await download(url, dest);
        console.log(`Downloaded ${crop}-${i + 1}.jpg`);
      } catch (err) {
        console.error(`Error downloading ${crop}-${i + 1}.jpg:`, err);
      }
    }
  }
  console.log('Done!');
}

run();
