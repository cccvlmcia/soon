import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import User from "@user/entity/User";
import {Entity, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
@Entity()
export default class BBS extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  bbsid: number;

  @Column({length: 100})
  name: string;

  @Column()
  masterid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "masterid"})
  master: User;

  //TODO: 게시판 구분 값 추가 필요
  @Column({length: 40})
  gbn: string; // 게시판 구분.... 기본/다이나믹

  @CreateDateColumn()
  createdate: Date;
}
