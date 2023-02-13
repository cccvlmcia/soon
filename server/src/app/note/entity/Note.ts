import {COLUMN_TYPE_ENUM, CommonYN} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Note extends BaseEntity {
  @PrimaryGeneratedColumn()
  noteid: number;

  @Column()
  userid: number;

  @Column()
  refid: number;

  @Column()
  contents: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.N})
  readyn: String;

  @CreateDateColumn()
  createdate: Date;
}
