import * as path from 'path'

import {
    loadConnection,
    loadEntityFactories,
    loadSeeds,
    runSeed,
    setConnection
} from 'typeorm-seeding'

import { Seed } from '../src/api/models/Seed'
import chalk from 'chalk'
import commander from 'commander'
import { difference } from 'lodash'
import { getConnection } from 'typeorm'

// Cli helper
commander
    .version('1.0.0')
    .description('Run database seeds of your project')
    .option('-L, --logging', 'enable sql query logging')
    .option('--factories <path>', 'add filepath for your factories')
    .option('--seeds <path>', 'add filepath for your seeds')
    .option(
        '--run <seeds>',
        'run specific seeds (file names without extension)',
        val => val.split(',')
    )
    .option(
        '--config <file>',
        'path to your ormconfig.json file (must be a json)'
    )
    .parse(process.argv)

// Get cli parameter for a different factory path
const factoryPath = commander.factories
    ? commander.factories
    : 'src/database/factories'

// Get cli parameter for a different seeds path
const seedsPath = commander.seeds ? commander.seeds : 'src/database/seeds/'

// Get a list of seeds
const listOfSeeds = commander.run
    ? commander.run.map(l => l.trim()).filter(l => l.length > 0)
    : []

const rootPath = path.join(__dirname, '../')
const reduceSeedsWithDb = async seedFiles => {
    try {
        const seeds = await getConnection()
            .createQueryBuilder()
            .select('seed')
            .from(Seed, 'seed')
            .getMany()

        const previousSeedFiles = seeds.map(s => rootPath + seedsPath + s.seed)
        return difference(seedFiles, previousSeedFiles)
    } catch (err) {
        return seedFiles
    }
}
// Search for seeds and factories
const run = async () => {
    const log = console.log
    let connection
    let factoryFiles
    let seedFiles
    let allSeedFiles

    // Get database connection and pass it to the seeder
    try {
        connection = await loadConnection()
        setConnection(connection)
    } catch (error) {
        return handleError(error)
    }

    try {
        factoryFiles = await loadEntityFactories(factoryPath)
        allSeedFiles = await loadSeeds(seedsPath)
        seedFiles = await reduceSeedsWithDb(allSeedFiles)
    } catch (error) {
        return handleError(error)
    }

    if (!seedFiles.length) {
        log('No seeds are pending')
        process.exit(0)
    }

    // Filter seeds
    if (listOfSeeds.length > 0) {
        seedFiles = seedFiles.filter(
            sf => listOfSeeds.indexOf(path.basename(sf).replace('.ts', '')) >= 0
        )
    }

    // Status logging to print out the amount of factories and seeds.
    log(chalk.bold('seeds'))
    log(
        '🔎 ',
        chalk.gray.underline(`found:`),
        chalk.blue.bold(
            `${factoryFiles.length} factories`,
            chalk.gray('&'),
            chalk.blue.bold(`${seedFiles.length} seeds`)
        )
    )

    let seeds = []

    // Show seeds in the console
    for (const seedFile of seedFiles) {
        try {
            seeds.push(seedFile)
            let className = getFileName(seedFile)
            className = className.replace('.ts', '').replace('.js', '')
            className = className.split('-')[className.split('-').length - 1]
            log(
                '\n' + chalk.gray.underline(`executing seed:  `),
                chalk.green.bold(`${className}`)
            )
            const seedFileObject: any = require(seedFile)
            await runSeed(seedFileObject[className])
        } catch (error) {
            console.error('Could not run seed ', error)
            process.exit(1)
        }
    }

    log('\n👍 ', chalk.gray.underline(`finished seeding`))

    try {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Seed)
            .values(
                seeds.map(file => ({
                    seed: getFileName(file)
                }))
            )
            .execute()
    } catch (error) {
        log(error.message)
    }
    process.exit(0)
}

const getFileName = fileName => {
    return fileName.split('/')[fileName.split('/').length - 1]
}

const handleError = error => {
    console.error(error)
    process.exit(1)
}

run()
