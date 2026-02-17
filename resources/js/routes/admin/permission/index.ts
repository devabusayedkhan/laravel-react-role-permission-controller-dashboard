import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::store
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:20
 * @route '/admin/permission'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/permission',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::store
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:20
 * @route '/admin/permission'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::store
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:20
 * @route '/admin/permission'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::store
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:20
 * @route '/admin/permission'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::store
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:20
 * @route '/admin/permission'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::update
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:50
 * @route '/admin/permission/{permission}'
 */
export const update = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/admin/permission/{permission}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::update
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:50
 * @route '/admin/permission/{permission}'
 */
update.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::update
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:50
 * @route '/admin/permission/{permission}'
 */
update.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::update
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:50
 * @route '/admin/permission/{permission}'
 */
    const updateForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::update
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:50
 * @route '/admin/permission/{permission}'
 */
        updateForm.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::destroy
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:79
 * @route '/admin/permission/{permission}'
 */
export const destroy = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/permission/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::destroy
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:79
 * @route '/admin/permission/{permission}'
 */
destroy.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminPermissionController::destroy
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:79
 * @route '/admin/permission/{permission}'
 */
destroy.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::destroy
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:79
 * @route '/admin/permission/{permission}'
 */
    const destroyForm = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminPermissionController::destroy
 * @see app/Http/Controllers/Admin/AdminPermissionController.php:79
 * @route '/admin/permission/{permission}'
 */
        destroyForm.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const permission = {
    store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default permission