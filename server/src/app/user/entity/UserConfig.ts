import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM, CommonYN, COMMON_N} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany} from "typeorm";
import User from "./User";
@Entity()
export default class UserConfig extends BaseEntity {
  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.N})
  cccyn: CommonYN;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.N})
  adminyn: CommonYN;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
