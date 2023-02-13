import {BaseEntity, Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm";

@Entity()
export default class FileTemp extends BaseEntity {
  @PrimaryColumn()
  fileid: string;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column()
  filesize: number;

  @Column()
  mimetype: string;

  @Column()
  filetype: string;

  @Column({default: 99})
  sortno: number;

  @Column({nullable: true})
  reftype: string;

  @CreateDateColumn()
  createdate: Date;
}
