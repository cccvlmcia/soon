/*
historyid
pray
publicyn
createdate
 */
import {COLUMN_TYPE_ENUM, CommonYN, COMMON_N} from "@common/CommonConstants";
import {Entity, BaseEntity, CreateDateColumn, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import SoonHistory from "./SoonHistory";

@Entity()
export default class SoonPray extends BaseEntity {
  @PrimaryGeneratedColumn()
  prayid: number;

  @Column()
  historyid: number;

  @ManyToOne(() => SoonHistory, history => history.historyid)
  @JoinColumn({name: "histroyid"})
  history: SoonHistory;

  @Column()
  pray: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: COMMON_N})
  publicyn: string;

  @CreateDateColumn()
  createdate: Date;
}
