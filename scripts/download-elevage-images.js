import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
  vaches: ['1570535316335-e51c886e3f4f', '1598285511041-356b4bd098c9', '1564344445391-76495df001d2'],
  moutons: ['1484244233201-29892afe6a2c', '1514478147614-a95f5abfc3e7', '1504953934333-a3093557e1be'],
  chevres: ['1524024968848-124b21d55639', '1611116238699-b1d5d14dfce1', '1589437198153-625d97d76b17']
};

const dir = path.join(process.cwd(), 'public', 'images', 'elevage');
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
  console.log('Downloading Elevage images...');
  for (const [animal, ids] of Object.entries(images)) {
    for (let i = 0; i < ids.length; i++) {
      const url = `https://images.unsplash.com/photo-${ids[i]}?auto=format&fit=crop&w=800&q=80`;
      const dest = path.join(dir, `${animal}-${i + 1}.jpg`);
      try {
        await download(url, dest);
        console.log(`Downloaded ${animal}-${i + 1}.jpg`);
      } catch (err) {
        console.error(`Error downloading ${animal}-${i + 1}.jpg:`, err);
      }
    }
  }
  console.log('Done!');
}

run();
