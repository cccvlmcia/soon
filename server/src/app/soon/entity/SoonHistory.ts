import {COLUMN_TYPE_ENUM, COLUMN_TYPE_TEXT} from "@common/CommonConstants";
import User from "@user/entity/User";
import {Entity, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import {SoonType} from "../SoonConstants";
import SoonHistoryUser from "./SoonHistoryUser";
import SoonPray from "./SoonPray";

@Entity()
export default class SoonHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  historyid: number;

  @Column()
  userid: number;

  @Column()
  sjid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "sjid"})
  soonjang: User;

  @Column({type: COLUMN_TYPE_ENUM, enum: SoonType, default: SoonType.soon})
  kind: string;

  @Column()
  progress: string; // 만남 1과, 새생활 1, 사영리, P4U 수기로 기록하게 한다.

  @Column()
  historydate: Date;

  @Column({type: COLUMN_TYPE_TEXT})
  contents: string;

  @OneToMany(() => SoonPray, pray => pray.history)
  prays: SoonPray[];

  @CreateDateColumn()
  createdate: Date;

  @OneToMany(() => SoonHistoryUser, user => user.history)
  users: SoonHistoryUser[];
}
