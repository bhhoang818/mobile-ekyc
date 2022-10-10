import CryptoJS from "crypto-js";

const config = {
    decrypt_key: process.env.REACT_APP_FACE_DECRYPT_KEY
};

export const encrypt = data => {
    var encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), CryptoJS.enc.Utf8.parse(config.decrypt_key),
        {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse("1234567891123456"),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return encryptedlogin.toString()?.replace('+', 'xMl3Jk').replace('/', 'Por21Ld');
    // return data;
};
