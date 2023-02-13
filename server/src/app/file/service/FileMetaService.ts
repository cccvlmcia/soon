import FileMeta from "@file/entity/FileMeta";
import {txProcess} from "@lib/db";

export async function getMetaFile(fileid: string): Promise<FileMeta | null> {
  return await FileMeta.findOne({where: {fileid}});
}

export async function getDownloadFiles(reftype: string, refid: number) {
  return await FileMeta.find({where: {reftype, refid}, order: {sortno: "ASC"}});
}

export async function addMetaFile(file: {
  fileid: string;
  filename: string;
  filepath: string;
  filesize: number;
  refid: number;
  filetype: string;
  sortno: number;
  reftype: string;
}) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileMeta);
    return await repository.save(file);
  });
}
export async function copyMetaFile(ids: string[], filepath: string, refid: number): Promise<string[]> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileMeta);
    for (let i = 0; i < ids.length; i++) {
      const fileid = ids[i];
      let query = "";
      query += " INSERT INTO file_meta (fileid, filename, filepath, filesize, mimetype, filetype, sortno, reftype, refid) ";
      query += " SELECT fileid, filename, ?, filesize, mimetype, filetype, sortno, reftype, ? ";
      query += " FROM file_temp ";
      query += " WHERE fileid = ? ";
      repository.query(query, [filepath, refid, fileid]);
    }
    return ids;
  });
}
export async function editFileSort(sortids: string[], sortnos: number[]) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileMeta);
    const result = [];
    for (let i = 0, len = sortids.length; i < len; i++) {
      const fileid = sortids[i];
      const sortno = sortnos[i];
      result.push(await repository.update({fileid: fileid}, {sortno: sortno}));
    }
    return result;
  });
}

export async function removeMetaFile(reftype: string, refid: number): Promise<string> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileMeta);
    if (reftype == "ARTICLE") {
      await repository.delete({reftype: "UPLOAD", refid});
      return await repository.delete({reftype, refid});
    } else if (reftype == "COMMENT") {
      return await repository.delete({reftype, refid});
    }
  });
}
export async function removeMetaFileByfileid(fileid: string): Promise<string> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileMeta);
    return await repository.delete({fileid});
  });
}
