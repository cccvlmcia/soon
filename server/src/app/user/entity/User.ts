import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "@common/CommonConstants";
import Soon from "@soon/entity/Soon";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne} from "typeorm";
import {Gender, USER_STATUS} from "../UserConstants";
import UserAuth from "./UserAuth";
import UserCampus from "./UserCampus";
import UserConfig from "./UserConfig";
import UserLogin from "./UserLogin";
@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @Column({length: 40})
  nickname: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: USER_STATUS, default: USER_STATUS.NORMAL})
  status: string; // BAN, NORMAL

  @Column({type: COLUMN_TYPE_ENUM, enum: Gender, default: Gender.MALE})
  gender: Gender;

  @Column({nullable: true, length: 512})
  refresh_token: string;

  @CreateDateColumn()
  createdate: Date;

  @OneToOne(() => UserConfig, config => config.user)
  config: UserConfig;

  @OneToMany(() => UserLogin, login => login.user)
  login: UserLogin;

  @OneToMany(() => UserCampus, campus => campus.user)
  campus: UserCampus;

  @OneToMany(() => UserAuth, auth => auth.user)
  auth: UserAuth;

  @OneToMany(() => Soon, soon => soon.soonjang)
  sj: Soon;

  @OneToMany(() => Soon, soon => soon.soonwon)
  sw: Soon;
}
