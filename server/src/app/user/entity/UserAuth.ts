import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import Auth from "@auth/entity/Auth";
import {Entity, BaseEntity, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import User from "./User";
import Campus from "@campus/entity/Campus";

@Entity()
export default class UserAuth extends BaseEntity {
  @PrimaryColumn({length: 40})
  authid: string;

  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @PrimaryColumn()
  campusid: string;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @ManyToOne(() => Auth, auth => auth.authid)
  @JoinColumn({name: "authid"})
  auth: Auth;

  @ManyToOne(() => Campus, campus => campus.campusid)
  @JoinColumn({name: "campusid"})
  campus: Campus;

  @CreateDateColumn()
  createdate: Date;
}
