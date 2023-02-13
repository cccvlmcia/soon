import fs from "fs";
import format from "date-fns/format";
import {getTempFile, removeTempFile} from "@file/service/FileTempService";
import {copyMetaFile, editFileSort} from "@file/service/FileMetaService";

// export default async function (ids: string[], refid: number, sortids: string[], sortnos: number[]) {
export default async function (ids: string[], refid: number) {
  if (ids && ids.length > 0) {
    const newfilepath = "public/meta/" + format(new Date(), "yyyy/MM/dd/HH");
    if (!fs.existsSync(newfilepath)) {
      fs.mkdirSync(newfilepath, {recursive: true});
    }
    // TEMP Data to META Data in DB
    await copyMetaFile(ids, newfilepath, refid);
    // SORT UPLOAD FILES
    // if (sortids && sortnos && sortids.length > 0 && sortnos.length > 0) {
    //   await editFileSort(sortids, sortnos);
    // }
    // TEMP File To META File in Server public Folder
    for (const fileid of ids) {
      const file = await getTempFile(fileid);
      const tempfilepath = file?.filepath;
      file &&
        fs.copyFile(`${tempfilepath}/${fileid}`, `${newfilepath}/${fileid}`, err => {
          if (err) {
            console.log("TEMP TO META COPY ERR >> ", err);
          } else {
            console.log("File Copied");
            fs.unlink(`${tempfilepath}/${fileid}`, async err => {
              if (err) {
                console.log("TEMP FILE DELETE ERR >> ", err);
              } else {
                console.log("File Deleted");
                await removeTempFile(fileid);
              }
            });
          }
        });
    }
  }
}
