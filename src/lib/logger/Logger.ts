import * as path from 'path'
import * as uuid from 'uuid'
import * as winston from 'winston'

/**
 * core.Log
 * ------------------------------------------------
 *
 * This is the main Logger Object. You can create a scope logger
 * or directly use the static log methods.
 *
 * By Default it uses the debug-adapter, but you are able to change
 * this in the start up process in the core/index.ts file.
 */

export class Logger {
    public static DEFAULT_SCOPE = 'app'

    private static parsePath(filepath: string): [string, string] {
        if (filepath.indexOf(path.sep) >= 0) {
            filepath = filepath.replace(process.cwd(), '')
            filepath = filepath.replace(`${path.sep}src${path.sep}`, '')
            filepath = filepath.replace(`${path.sep}dist${path.sep}`, '')
            filepath = filepath.replace('.ts', '')
            filepath = filepath.replace('.js', '')
            filepath = filepath.replace(path.sep, ':')
        }
        const idx = filepath.indexOf('/')
        if (idx >= 0) {
            return [filepath.substring(0, idx), filepath.substring(idx + 1)]
        }
        return [filepath, '']
    }

    private category: string
    private service: string

    private baseMeta: any

    constructor(scope?: string, baseMeta: any = {}) {
        ;[this.category, this.service] = Logger.parsePath(
            scope ? scope : Logger.DEFAULT_SCOPE
        )
        this.baseMeta = baseMeta
    }

    public debug(message: string, meta: any = {}): void {
        this.log('debug', message, meta)
    }

    public info(message: string, meta: any = {}): void {
        this.log('info', message, meta)
    }

    public warn(message: string, meta: any = {}): void {
        this.log('warn', message, meta)
    }

    public error(message: string, meta: any = {}, error?: Error): void {
        let newMessage = message
        const newMeta = Object.assign({}, meta)

        if (error) {
            newMessage = `${message}: ${error.message ? error.message : error}`
            if (error.stack) {
                newMeta.stack = error.stack
                    .split('\n')
                    .slice(1)
                    .map(line => line.replace(/^[\s]*at[\s]+/, '').trim())
            }
            newMeta.errorId = uuid.v4()
        }

        this.log('error', newMessage, newMeta)
    }

    private log(level: string, message: string, meta): void {
        if (winston) {
            winston[level](message, {
                ...this.baseMeta,
                ...meta,
                category: this.category,
                service: this.service
            })
        }
    }
}
