import {addMetaFile} from "@file/service/FileMetaService";
import sharp from "sharp";
import {generatedUUID} from "./UUIDUtils";

export const addArticleThumbnail = async (filename: string, filepath: string, refid: number) => {
  // const origin = "C:\\workspace\\haqqaton\\bbs\\server\\public\\img\\origin.jpg";
  // const next = "C:\\workspace\\haqqaton\\bbs\\server\\public\\img\\next.jpg";
  const thumb = "thumbnail.jpg";
  const origin = filepath + filename;
  const next = filepath + thumb;
  const info = await sharp(origin)
    .rotate()
    .resize(200) //  .resize(320, 240)
    .jpeg({mozjpeg: true})
    .toFile(next);
  // console.log("info >>", info);
  const fileid = generatedUUID();
  return await addMetaFile({fileid, filename, filepath, filesize: info.size, refid, filetype: "thumb", sortno: 1, reftype: "thumb"});
};
