import {COLUMN_TYPE_ENUM, CommonYN} from "@common/CommonConstants";
import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from "typeorm";
import Area from "./Area";

@Entity()
export default class Campus extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  campusid: string;

  @Column({length: 40})
  name: string;

  @Column({length: 40})
  areaid: string;

  @ManyToOne(() => Area, area => area.areaid)
  @JoinColumn({name: "areaid"})
  area: Area;

  @Column({type: COLUMN_TYPE_ENUM, enum: CommonYN, default: CommonYN.Y})
  useyn: string;

  @CreateDateColumn()
  createdate: Date;
}
