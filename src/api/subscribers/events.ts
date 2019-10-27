/**
 * events
 * ---------------------
 * Define all your possible custom events here.
 */
export const events = {
    user: {
        created: 'onUserCreate',
        updated: 'onUserUpdate',
        find: 'onUserFind',
        findMany: 'onUserFindMany',
        removed: 'onUserRemove'
    },
    role: {
        created: 'onRoleCreate',
        updated: 'onRoleUpdate',
        find: 'onRoleFind',
        findMany: 'onRoleFindMany',
        removed: 'onRoleRemove'
    }
}
