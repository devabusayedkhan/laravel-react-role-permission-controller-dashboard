import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import user from './user'
import role from './role'
import permission from './permission'
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
export const users = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})

users.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
users.url = (options?: RouteQueryOptions) => {
    return users.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
users.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: users.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
users.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: users.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
    const usersForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: users.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
        usersForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminAuthController::users
 * @see app/Http/Controllers/Admin/AdminAuthController.php:14
 * @route '/admin/users'
 */
        usersForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: users.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    users.form = usersForm
/**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/admin/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
    const rolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: roles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
        rolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminRoleController::roles
 * @see app/Http/Controllers/Admin/AdminRoleController.php:15
 * @route '/admin/roles'
 */
        rolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    roles.form = rolesForm
/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
export const permissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})

permissions.definition = {
    methods: ["get","head"],
    url: '/admin/permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
permissions.url = (options?: RouteQueryOptions) => {
    return permissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
permissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: permissions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
permissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: permissions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
    const permissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: permissions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
        permissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::permissions
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:14
 * @route '/admin/permissions'
 */
        permissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: permissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    permissions.form = permissionsForm
const admin = {
    users: Object.assign(users, users),
user: Object.assign(user, user),
roles: Object.assign(roles, roles),
role: Object.assign(role, role),
permissions: Object.assign(permissions, permissions),
permission: Object.assign(permission, permission),
}

export default admin