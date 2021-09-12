import { PrimaryGeneratedColumn,Column, Entity, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { IsEmail, IsString, Length } from 'class-validator';
import Message from "src/message/message.entity";
import History from "src/history/history.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ApiProperty()
  @Column({length: 100, nullable: false})
  @Length(1, 100)
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty()
  @Column({length: 100})
  @Length(1, 100)
  @IsString()
  password: string;

  @ApiProperty()
  @Column({length: 100, nullable: false})
  @Length(1, 100)
  @IsString()
  pseudo: string;

  @OneToMany(() => Message, sender => sender.userSender)
  sender: Message[];

  @OneToMany(() => Message, receiver => receiver.userReceiver)
  receiver: Message[];

  @OneToMany(() => History, msgHistoy => msgHistoy.user)
  messageHistory: History[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
}