import { ContainerInstance } from 'typedi'
import { User } from './models/User'
import express from 'express'

export interface Context {
    requestId: string
    request: express.Request
    response: express.Response
    container: ContainerInstance
    user?: User
}
