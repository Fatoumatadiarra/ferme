import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
  'poulet-chair': ['1548842183-48b4d8d17208', '1611327161838-8959d9c24097', '1584059049750-f86a0d6350f2'],
  'poule-pondeuse': ['1583307527632-4d048d0a4bf9', '1591523315993-4a11f211516e', '1604085444636-6eaf0027f3b8'],
  'canard': ['1555122822-ccbe18f4cf24', '1453982467389-9b97b09c2dbd', '1587394200772-9b2f153a5c2b'],
  'caille': ['1583483955677-9092498782a7', '1608226027376-80f4f910ba74', '1586521509653-3cb377319c5c'] // close approximations if exactly quail isn't easily found, using general small bird/poultry
};

const dir = path.join(process.cwd(), 'public', 'images', 'aviculture');
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
  console.log('Downloading Aviculture images...');
  for (const [bird, ids] of Object.entries(images)) {
    for (let i = 0; i < ids.length; i++) {
      const url = `https://images.unsplash.com/photo-${ids[i]}?auto=format&fit=crop&w=800&q=80`;
      const dest = path.join(dir, `${bird}-${i + 1}.jpg`);
      try {
        await download(url, dest);
        console.log(`Downloaded ${bird}-${i + 1}.jpg`);
      } catch (err) {
        console.error(`Error downloading ${bird}-${i + 1}.jpg:`, err);
      }
    }
  }
  console.log('Done!');
}

run();
