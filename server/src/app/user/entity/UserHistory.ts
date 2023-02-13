import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
@Entity()
export default class UserHistory extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  historyid: number;

  @Column({type: COLUMN_TYPE_BIGINT})
  userid: number;

  // INSERT, UDPATE, DELETE
  @Column()
  mode: string;

  @Column()
  column: string;

  @Column()
  value: Date;

  @CreateDateColumn()
  createdate: Date;
}
