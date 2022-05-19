import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { BaseAudit } from '../../entities/base.entity'
import { TransactionTypeEnum } from '../../enums/transactionType.enum'

@Entity('transactions')
export class TransactionEntity extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('float')
    money: number

    @Column({ type: 'enum', enum: TransactionTypeEnum })
    type: TransactionTypeEnum

    @Column({ nullable: true })
    fromWalletId: string

    @Column()
    toWalletId: string
}
