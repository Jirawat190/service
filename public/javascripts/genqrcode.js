const QRCode = require('qrcode'); // Import the QRCode module
const fs = require('fs');

function generateQRCode(text, outputPath, table) {
  try {
    // Generate the QR code
    QRCode.toFile(outputPath, text, function (err) {
      if (err) {
        console.error('Error generating QR code:', err);
      } else {
        console.log(`QR code generated and saved as ${outputPath}`);
      }
    });

    return `table${table}.jpg`;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
}

module.exports = generateQRCode;


