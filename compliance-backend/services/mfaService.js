const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.generateMfaSecret = (email) => {
  const secret = speakeasy.generateSecret({
    name: `Compliance System (${email})`
  });

  return {
    secret: secret.base32,
    uri: secret.otpauth_url
  };
};

exports.generateMfaQRCode = async (uri) => {
  try {
    return await QRCode.toDataURL(uri);
  } catch (err) {
    console.error('Error generating QR code:', err);
    return null;
  }
};

exports.verifyMfaCode = (secret, code) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: code,
    window: 1
  });
};

exports.generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};