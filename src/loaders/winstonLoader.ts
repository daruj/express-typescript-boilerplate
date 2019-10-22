import {
    MicroframeworkLoader,
    MicroframeworkSettings
} from 'microframework-w3tec'
import { configure, format, transports } from 'winston'

import { env } from '../env'

export const winstonLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    configure({
        transports: [
            new transports.Console({
                level: env.log.level,
                handleExceptions: true,
                format: format.combine(format.timestamp(), format.json())
            })
        ]
    })
}
