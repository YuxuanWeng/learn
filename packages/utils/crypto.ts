import aes from 'crypto-js/aes';
import utf8 from 'crypto-js/enc-utf8';
import ctr from 'crypto-js/mode-ctr';
import pkcs7 from 'crypto-js/pad-pkcs7';
import sha1 from 'crypto-js/sha1';

const iv = sha1('OMS');

// 使用userId作为密钥，SHA1('OMS')为偏移值

export const encryptPassword = (password: string, userId: string) => {
  const encrypted = aes.encrypt(password, userId, {
    mode: ctr,
    padding: pkcs7,
    length: 256,
    iv
  });
  return encrypted.toString();
};

export const decryptPassword = (ciphertext: string, userId: string) => {
  const bytes = aes.decrypt(ciphertext, userId, {
    mode: ctr,
    padding: pkcs7,
    length: 256,
    iv
  });
  return bytes.toString(utf8);
};
