import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
    before: {
        all: [ 
            authenticate('jwt'),
            (hook: HookContext) => {
                if (hook.params.query && hook.params.user) {
                    hook.params.query.companyId = hook.params.user.companyId;
                }
                return hook;
            }
        ],
        find: [],
        get: [],
        create: [
            (hook: HookContext) => {
                if (hook.params.user) {
                    hook.data.companyId = hook.params.user.companyId;
                }
                return hook;
            }
        ],
        update: [
            (hook: HookContext) => {
                if (hook.params.user) {
                    hook.data.companyId = hook.params.user.companyId;
                }
                return hook;
            }
        ],
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
