import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import Article from "./Article";
@Entity()
export default class Comment extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  cmtid: number;

  @Column()
  articleid: number;

  @ManyToOne(() => Article, article => article.articleid)
  @JoinColumn({name: "articleid"})
  article: Article;

  @Column({type: COLUMN_TYPE_BIGINT})
  refid: number;

  @ManyToOne(() => Comment, comment => comment.cmtid)
  @JoinColumn({name: "refid"})
  ref: Comment;

  @Column({length: 100})
  comment: string;

  //TODO: 태그 벗기고 저장해야 함. < -> &lt; xxsFilter
  @Column({length: 100, name: "srch_comment"})
  srchComment: string;

  @CreateDateColumn()
  createdate: Date;

  @UpdateDateColumn()
  updatedate: Date;
}
