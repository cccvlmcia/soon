import User from "@user/entity/User";
import {Entity, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, Column, PrimaryGeneratedColumn, Unique} from "typeorm";

@Entity()
@Unique(["swid"])
export default class Soon extends BaseEntity {
  @PrimaryGeneratedColumn()
  soonid: number;

  @Column()
  sjid: number;

  @Column()
  swid: number;

  @ManyToOne(() => User, user => user.sj)
  @JoinColumn({name: "sjid"})
  soonjang: User;

  @ManyToOne(() => User, user => user.sw)
  @JoinColumn({name: "swid"})
  soonwon: User[];

  @CreateDateColumn()
  createdate: Date;
}
