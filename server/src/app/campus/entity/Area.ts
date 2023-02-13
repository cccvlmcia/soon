import {COLUMN_TYPE_ENUM, CommonYN} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Area extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  areaid: string;

  @Column({length: 40})
  name: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.Y})
  useyn: string;

  @CreateDateColumn()
  createdate: Date;
}
