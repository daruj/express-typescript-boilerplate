import JWT from 'jsonwebtoken'
import { env } from '../../env'

export const signToken = (userId: string) => {
    return JWT.sign(
        {
            iss: 'CodeWorkr',
            sub: userId,
            iat: new Date().getTime(), // current time
            exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
        },
        env.jwt.secret
    )
}
