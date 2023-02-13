import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import User from "@user/entity/User";
import {Entity, Column, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import {GBN_DYNAMIC} from "../BBSConstants";
@Entity()
export default class BBSRequest extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  reqbbsid: number;

  @Column({length: 100})
  name: string;

  @Column()
  masterid: number;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "masterid"})
  master: User;

  @Column({length: 100})
  description: string;

  @Column({length: 40, default: GBN_DYNAMIC})
  gbn: string;

  @CreateDateColumn()
  createdate: Date;
}
