import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

import { HookContext } from '@feathersjs/feathers';
import commonHooks from "feathers-hooks-common"

const { authenticate } = authentication.hooks;

const isNotAdmin = () => (context: HookContext) =>
    !context.params.user
        ? false
        : context.params.user.roles && context.params.user.roles.indexOf("admin") === -1;

export default {
    before: {
        all: [ 
            authenticate('jwt'),
            commonHooks.iff(isNotAdmin(), hook => {
                if (hook.params.query && hook.params.user) {
                    hook.params.query.companyId = hook.params.user.companyId;
                }
                return hook;
            }),
        ],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    },

    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: []
    }
};
