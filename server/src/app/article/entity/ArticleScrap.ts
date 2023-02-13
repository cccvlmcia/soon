import User from "@user/entity/User";
import {Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn} from "typeorm";
import Article from "./Article";
@Entity()
export default class ArticleScrap extends BaseEntity {
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
