import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import Message from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export default class History{
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Message })
  @ManyToOne(()=> Message, message => message.messageHistory)
  message: Message;
  
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.messageHistory, {nullable:true})
  user: User;
  
  @Column()
  @IsString()
  archivedMessage: string;

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;

}