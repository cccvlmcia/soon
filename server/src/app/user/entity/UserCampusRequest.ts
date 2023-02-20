import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import Campus from "@campus/entity/Campus";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import User from "./User";
@Entity()
export default class UserCampusRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  reqid: number;

  @Column({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @Column({length: 40})
  major: string;

  @Column({type: COLUMN_TYPE_BIGINT})
  sid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @PrimaryColumn({length: 40})
  campusid: string;

  @ManyToOne(() => Campus, campus => campus.campusid)
  @JoinColumn({name: "campusid"})
  campus: Campus;

  @CreateDateColumn()
  createdate: Date;
}
