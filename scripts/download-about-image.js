import fs from 'fs';
import path from 'path';
import https from 'https';

const dir = path.join(process.cwd(), 'public', 'images', 'landing');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const url = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80';
const dest = path.join(dir, 'importance-ferme.jpg');

https.get(url, (res) => {
  if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, (redirectRes) => {
      const file = fs.createWriteStream(dest);
      redirectRes.pipe(file);
      file.on('finish', () => file.close(() => console.log('Image downloaded')));
    });
  } else {
    const file = fs.createWriteStream(dest);
    res.pipe(file);
    file.on('finish', () => file.close(() => console.log('Image downloaded')));
  }
}).on('error', (err) => {
  console.error('Download error:', err);
});
