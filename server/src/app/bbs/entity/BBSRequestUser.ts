import {COLUMN_TYPE_BIGINT} from "@common/CommonConstants";
import User from "@user/entity/User";
import {Entity, BaseEntity, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn} from "typeorm";
import BBSRequest from "./BBSRequest";
@Entity()
export default class BBSRequestUser extends BaseEntity {
  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  reqbbsid: number;

  @PrimaryColumn({type: COLUMN_TYPE_BIGINT})
  userid: number;

  @ManyToOne(() => BBSRequest, bbs => bbs.reqbbsid)
  @JoinColumn({name: "reqbbsid"})
  bbsRequest: BBSRequest;

  @ManyToOne(() => User, user => user.userid)
  @JoinColumn({name: "userid"})
  user: User;

  @CreateDateColumn()
  createdate: Date;
}
