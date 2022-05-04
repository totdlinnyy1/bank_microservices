import { Directive } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'

import { BaseAudit } from '../../entities/base.entity'

@Entity('users')
@Directive('@key(fields: "id")')
export class UserEntity extends BaseAudit {
    @Column('text', { unique: true })
    email: string

    @Column('text')
    name: string
}
