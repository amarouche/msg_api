import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString, ValidationArguments } from "class-validator";
import History from "src/history/history.entity";
import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TYPE_MSG } from "./dto/message.dto";


@Entity()
export default class Message{
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({length: 100, nullable:true})
  @ApiProperty()
  @IsString()
  objet: string;

  @Column({type: "enum",enum: TYPE_MSG})
  @ApiProperty()
  @IsNotEmpty()
  @IsString({
    message: (args: ValidationArguments) => {
      if (['email','sms'].includes(args.value)) {
        return 'Type message invalide';
      }
    }
  })
  type: TYPE_MSG;

  @Column()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  messageBody: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.sender)
  userSender: User;
  
  @ApiProperty({ type: () => User })
  @ManyToOne(type => User, user => user.sender)
  userReceiver: User;

  @Column('boolean', {default: false})
  read: Boolean;

  @Column("int", { array: true, nullable:true })
  answerMessages: number[] =[];
  
  @OneToMany(() => History, msgHistoy => msgHistoy.message)
  messageHistory: History[];

  @CreateDateColumn()
  created_date: Date;

  @UpdateDateColumn()
  updated_date: Date;
  
  @DeleteDateColumn()
  deleted_date: Date;

}
