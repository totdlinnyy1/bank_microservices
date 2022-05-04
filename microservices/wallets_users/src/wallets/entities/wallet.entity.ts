import {
    Check,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'

import { BaseAudit } from '../../entities/base.entity'
import { UserEntity } from '../../users/entities/user.entity'

@Entity('wallets')
@Check(`"incoming" >= "outgoing"`)
export class WalletEntity extends BaseAudit {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('float', { default: 0 })
    incoming: number

    @Column('float', { default: 0 })
    outgoing: number

    @Column('text')
    ownerId: string

    @Column('boolean', { default: false })
    isClosed?: boolean

    @Column('boolean', { default: false })
    isLock?: boolean

    @ManyToOne(() => UserEntity, (user) => user.wallets)
    owner: UserEntity

    get actualBalance(): number {
        return this.incoming - this.outgoing
    }
}
