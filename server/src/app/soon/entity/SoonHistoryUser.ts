import {Entity, BaseEntity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import SoonHistory from "./SoonHistory";

@Entity()
export default class SoonHistoryUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  historyid: number;

  @Column({nullable: true})
  swid: number;

  @Column({nullable: true})
  email: string;

  @Column({nullable: true})
  sid: number;

  @Column({nullable: true})
  nickname: string;

  @Column({nullable: true})
  campusid: string;

  @Column({nullable: true})
  campusname: string;

  @Column({nullable: true})
  major: string;

  @ManyToOne(() => SoonHistory, history => history.users)
  @JoinColumn({name: "historyid"})
  history: SoonHistory;
}
