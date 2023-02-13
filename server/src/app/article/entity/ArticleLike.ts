import User from "@user/entity/User";
import {Entity, Column, BaseEntity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, UpdateDateColumn, PrimaryColumn, CreateDateColumn} from "typeorm";
import Article from "./Article";
@Entity()
export default class ArticleLike extends BaseEntity {
  @PrimaryColumn()
  userid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @PrimaryColumn()
  articleid: number;

  @ManyToOne(() => Article, article => article.articleid)
  @JoinColumn({name: "articleid"})
  article: Article;

  @CreateDateColumn()
  createdate: Date;
}
