// import jwt from "jsonwebtoken";
// const {token} = haqqaton;

export function parseJWT(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    return {};
  }
}

// export const signJWT = async (payload: any, expiresIn = token.expiresIn) => {
//   return jwt.sign(payload, token.secret, {expiresIn});
// };

// export const verifyJWT = async (_token: string) => {
//   return jwt.verify(_token, token.secret);
// };
