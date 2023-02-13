import {ArticleStatus} from "@article/ArticleConstants";
import User from "@user/entity/User";
import BBS from "@bbs/entity/BBS";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

/*
  bbsid: number;
  userid: number;
  thumbnail?: string;
  title: string;
  contents: string;
  srchContents: string;
  status: string;

*/
@Entity()
export default class Article extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  articleid: number;

  @Column({type: COLUMN_TYPE_BIGINT})
  bbsid: number;

  @ManyToOne(() => BBS, bbs => bbs.bbsid)
  @JoinColumn({name: "bbsid"})
  bbs: BBS;

  @Column()
  userid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  //TODO: 아티클 처리 할 때, 썸네일 압축 작업이 필요함. 이미지첨부가 있을 때
  @Column({nullable: true})
  thumbnail: string;

  @Column()
  title: string;

  //<p>안녕하세요</p> -> &lt;p&gt 안녕하세요 &lt;/p&gt
  @Column({type: "text"})
  contents: string;

  //TODO: 안녕하세요
  @Column({type: "text", name: "srch_contents"})
  srchContents: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: ArticleStatus, default: ArticleStatus.PUBLISHED})
  status: ArticleStatus;

  @Column({default: 0})
  readcnt: number;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
