import crypto from "crypto";
import {haqqaton} from "@config/haqqaton.config";

const {alg, key, iv} = haqqaton.cipher;

export const encrypted = (plainText: string | undefined) => {
  if (plainText == "" || plainText == undefined) {
    return "";
  }
  let cipher = crypto.createCipheriv(alg, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
};
export const decrypted = (encrypted: string) => {
  let decipher = crypto.createDecipheriv(alg, key, iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
};
