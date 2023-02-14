import CryptoJS from "crypto-js";
import {LocalStorage} from "typescript-web-storage";
const SECRET_KEY = "ciabootcamp2023";

export function getHash(value: string) {
  const key = CryptoJS.SHA256(value, {SECRET_KEY});
  return key;
}

export function setStorage(key: string, value: string) {
  const storage = new LocalStorage();
  const data = CryptoJS.AES.encrypt(value, SECRET_KEY);
  storage.setItem<string>(key, data.toString());
}

export function getStorage(key: string) {
  const storage = new LocalStorage();
  const data = CryptoJS.AES.decrypt(storage.getItem<string>(key) ?? "", SECRET_KEY).toString(CryptoJS.enc.Utf8);
  return data;
}
