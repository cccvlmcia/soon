import FileTemp from "@file/entity/FileTemp";
import {txProcess} from "@lib/db";

export async function getTempFile(fileid: string): Promise<FileTemp | null> {
  return await FileTemp.findOne({where: {fileid}});
}
export async function addTempFile(
  fileid: string,
  filename: string,
  filepath: string,
  filesize: number,
  mimetype: string,
  filetype: string,
  sortno: number,
  reftype: string,
): Promise<string[]> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileTemp);
    const result = await repository.save({fileid, filename, filepath, filesize, mimetype, filetype, sortno, reftype});
  });
}

export async function removeTempFile(fileid: string) {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileTemp);
    return await repository.delete({fileid});
  });
}
