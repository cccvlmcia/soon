import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM, CommonYN} from "@common/CommonConstants";
import Campus from "@campus/entity/Campus";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, OneToMany, UpdateDateColumn} from "typeorm";
import User from "./User";
@Entity()
export default class UserCampus extends BaseEntity {
  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @PrimaryColumn({length: 40})
  campusid: string;

  @ManyToOne(() => Campus, campus => campus.campusid)
  @JoinColumn({name: "campusid"})
  campus: Campus;

  @Column({length: 40})
  major: string;

  @Column({type: COLUMN_TYPE_BIGINT})
  sid: number;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.Y})
  defaultyn: CommonYN;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
