/* eslint-disable no-throw-literal */
/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
import {
    ALERT_TYPE,
} from '@Core/defaults/alerts';
import {
    getKeyByValue,
} from '@Core/models/objectWrapper';
import {
    addBySegment,
    addBySku,
    applyDraft,
    create,
    get,
    getCollections,
    getCompleteness,
    getDraft,
    getTemplate,
    getWorkflow,
    remove,
    removeChildren,
    removeDraftValue,
    update,
    updateDraftValue,
} from '@Products/services/index';

import {
    types,
} from './mutations';

export default {
    setDraftValue: ({
        commit,
    }, payload) => commit(types.SET_DRAFT_VALUE, payload),
    async getProductDraft({
        commit,
    }, {
        id,
        onError = () => {},
        languageCode,
    }) {
        try {
            // EXTENDED BEFORE METHOD
            await this.$extendMethods('@Products/store/product/action/getProductDraft/__before', {
                $this: this,
                data: {
                    id,
                },
            });
            // EXTENDED BEFORE METHOD
            const {
                attributes,
            } = await getDraft({
                $axios: this.app.$axios,
                id,
                languageCode,
            });

            commit(types.SET_PRODUCT_DRAFT, {
                languageCode,
                draft: attributes,
            });
            // EXTENDED AFTER METHOD
            await this.$extendMethods('@Products/store/product/action/getProductDraft/__after', {
                $this: this,
                data: {
                    attributes,
                },
            });
            // EXTENDED AFTER METHOD
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async getProductWorkflow({
        commit,
    }, {
        id,
        languageCode,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                status = {},
                workflow = [],
            } = await getWorkflow({
                $axios: this.app.$axios,
                id,
                languageCode,
            });

            commit('__SET_STATE', {
                key: 'status',
                value: status,
            });

            commit('__SET_STATE', {
                key: 'workflow',
                value: workflow,
            });

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async getProduct({
        commit,
        rootState,
    }, {
        id,
        onError = () => {},
    }) {
        try {
            // EXTENDED BEFORE METHOD
            await this.$extendMethods('@Products/store/product/action/getProduct/__before', {
                $this: this,
                data: {
                    id,
                },
            });
            // EXTENDED BEFORE METHOD

            const {
                productTypes,
            } = rootState.dictionaries;

            const data = await get({
                $axios: this.app.$axios,
                id,
            });

            const {
                design_template_id: templateId,
                attributes,
                sku,
                type,
            } = data;

            if (templateId) {
                commit('__SET_STATE', {
                    key: 'template',
                    value: templateId,
                });
            }

            commit('__SET_STATE', {
                key: 'id',
                value: id,
            });
            commit('__SET_STATE', {
                key: 'sku',
                value: sku,
            });
            commit('__SET_STATE', {
                key: 'type',
                value: productTypes[type],
            });
            commit('__SET_STATE', {
                key: 'data',
                value: attributes,
            });

            // EXTENDED AFTER METHOD
            await this.$extendMethods('@Products/store/product/action/getProduct/__after', {
                $this: this,
                data,
                type,
            });
            // EXTENDED AFTER METHOD
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async getProductWorkflowOptions({}, {
        id,
        languageCode,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                workflow = [],
            } = await getWorkflow({
                $axios: this.app.$axios,
                id,
                languageCode,
            });

            onSuccess({
                workflow: workflow.map(e => ({
                    id: e.id,
                    key: e.code,
                    value: e.name,
                    hint: e.name
                        ? `#${e.code} ${languageCode}`
                        : '',
                })),
            });
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async addBySku({
        state,
    }, {
        scope,
        skus,
        onSuccess = () => {},
        onError = () => {},
    }) {
        const {
            id,
        } = state;
        const data = {
            skus,
        };

        try {
            await addBySku({
                $axios: this.app.$axios,
                id,
                data,
            });

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Adding product by skus has been canceled',
                });

                return;
            }

            onError({
                errors: e.data.errors,
                scope,
            });
        }
    },
    async addBySegment({
        state,
    }, {
        scope,
        segments,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const errors = {};
            let isAnyError = false;
            const {
                id,
            } = state;
            const data = {
                segments,
            };

            if (!data.segments.length) {
                errors.segments = [
                    'Segment rule is required',
                ];
                isAnyError = true;
            }

            if (isAnyError) {
                throw {
                    data: {
                        errors,
                    },
                };
            }

            await addBySegment({
                $axios: this.app.$axios,
                id,
                data,
            });
            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Adding products from segment has been canceled',
                });

                return;
            }

            onError({
                errors: e.data.errors,
                scope,
            });
        }
    },
    async getProductTemplate({}, {
        languageCode,
        id,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                elements,
            } = await getTemplate({
                $axios: this.app.$axios,
                languageCode,
                id,
            });

            onSuccess({
                elements,
            });
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async getProductCollections({
        state,
    }, {
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                id,
            } = state;

            const {
                collection,
            } = await getCollections({
                $axios: this.app.$axios,
                id,
            });
            onSuccess({
                collections: collection,
            });
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async getProductCompleteness({}, {
        languageCode,
        id,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const completeness = await getCompleteness({
                $axios: this.app.$axios,
                languageCode,
                id,
            });

            onSuccess({
                completeness,
            });
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                return;
            }

            onError(e);
        }
    },
    async updateProductStatus({
        state,
    }, {
        attributeId,
        value,
        languageCode,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                id,
            } = state;
            const data = {
                value,
            };

            await updateDraftValue({
                $axios: this.app.$axios,
                id,
                attributeId,
                languageCode,
                data,
            });
            await applyDraft({
                $axios: this.app.$axios,
                id,
            });

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Updating product status has been canceled',
                });

                return;
            }

            onError(e);
        }
    },
    async applyProductDraft({}, {
        id,
        scope,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            await applyDraft({
                $axios: this.app.$axios,
                id,
            });
            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Applying product draft has been canceled',
                });

                return;
            }

            onError({
                errors: e.data.errors,
                scope,
            });
        }
    },
    async updateProductDraft({
        dispatch,
        rootState,
    }, {
        languageCode,
        fieldKey,
        productId,
        elementId,
        value,
        scope,
    }) {
        try {
            const data = {
                value,
            };

            await updateDraftValue({
                $axios: this.app.$axios,
                id: productId,
                attributeId: elementId,
                languageCode,
                data,
            });

            if (rootState.feedback.errors[scope]) {
                dispatch(
                    'feedback/removeScopeError',
                    {
                        scope,
                        fieldKey,
                    },
                    {
                        root: true,
                    },
                );
            }
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Updating product draft has been canceled',
                });

                return;
            }

            const {
                errors,
            } = e.data;

            const fieldKeys = {
                value: fieldKey,
            };

            if (errors) {
                dispatch(
                    'feedback/onError',
                    {
                        errors,
                        fieldKeys,
                        scope,
                    },
                    {
                        root: true,
                    },
                );
            } else {
                const internalServerError = {
                    value: [
                        e.statusText,
                    ],
                };

                dispatch(
                    'feedback/onError',
                    {
                        errors: internalServerError,
                        fieldKeys,
                        scope,
                    },
                    {
                        root: true,
                    },
                );
            }
        }
    },
    async updateProduct(
        {
            state,
            rootState,
        },
        {
            scope,
            onSuccess = () => {},
            onError = () => {},
        },
    ) {
        try {
            const {
                productTypes,
            } = rootState.dictionaries;
            const {
                id,
                template,
                type,
            } = state;
            const typeKey = getKeyByValue(productTypes, type);
            let data = {
                templateId: template,
            };

            // EXTENDED BEFORE METHOD
            const extendedData = await this.$extendMethods('@Products/store/product/action/updateProduct/__before', {
                $this: this,
                type: typeKey,
                data: {
                    id,
                    ...data,
                },
            });
            // EXTENDED BEFORE METHOD

            extendedData.forEach((extend) => {
                data = {
                    ...data,
                    ...extend,
                };
            });

            await update({
                $axios: this.app.$axios,
                id,
                data,
            });
            await applyDraft({
                $axios: this.app.$axios,
                id,
            });

            // EXTENDED AFTER METHOD
            await this.$extendMethods('@Products/store/product/action/updateProduct/__after', {
                $this: this,
                type: typeKey,
                data,
            });
            // EXTENDED AFTER METHOD

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Updating product has been canceled',
                });

                return;
            }

            onError({
                errors: e.data.errors,
                scope,
            });
        }
    },
    async createProduct(
        {
            state,
            rootState,
        },
        {
            scope,
            onSuccess = () => {},
            onError = () => {},
        },
    ) {
        try {
            const {
                productTypes,
            } = rootState.dictionaries;
            const {
                sku,
                type,
                template,
            } = state;
            const typeKey = getKeyByValue(productTypes, type);
            let data = {
                sku,
                type: typeKey,
                templateId: template,
            };

            // EXTENDED BEFORE METHOD
            const extendedData = await this.$extendMethods('@Products/store/product/action/createProduct/__before', {
                $this: this,
                type: typeKey,
                data,
            });
            // EXTENDED BEFORE METHOD

            extendedData.forEach((extend) => {
                data = {
                    ...data,
                    ...extend,
                };
            });

            const {
                id,
            } = await create({
                $axios: this.app.$axios,
                data,
            });

            // EXTENDED AFTER METHOD
            await this.$extendMethods('@Products/store/product/action/createProduct/__after', {
                $this: this,
                type: typeKey,
                data: {
                    id,
                    ...data,
                },
            });
            // EXTENDED AFTER METHOD

            onSuccess(id);
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Creating product has been canceled',
                });

                return;
            }

            onError({
                errors: e.data.errors,
                scope,
            });
        }
    },
    async removeProduct({
        state,
        rootState,
    }, {
        onSuccess = () => {},
        onError = () => {},
    }) {
        const {
            productTypes,
        } = rootState.dictionaries;
        const {
            id,
            type,
        } = state;
        const typeKey = getKeyByValue(productTypes, type);

        try {
            // EXTENDED BEFORE METHOD
            await this.$extendMethods('@Products/store/product/action/removeProduct/__before', {
                $this: this,
                type: typeKey,
            });
            // EXTENDED BEFORE METHOD

            await remove({
                $axios: this.app.$axios,
                id,
            });

            // EXTENDED AFTER METHOD
            await this.$extendMethods('@Products/store/product/action/removeProduct/__after', {
                $this: this,
                type: typeKey,
            });
            // EXTENDED AFTER METHOD

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Removing product draft has been canceled',
                });

                return;
            }

            onError(e);
        }
    },
    async removeProductChildren({
        state,
    }, {
        childrenId,
        skus,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                id,
            } = state;
            const mappedSkus = skus.replace(/\n/g, ',');
            const data = {
                skus: mappedSkus !== '' ? mappedSkus.split(',') : [],
            };

            await removeChildren({
                $axios: this.app.$axios,
                id,
                childrenId,
                data,
            });

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Removing product children has been canceled',
                });

                return;
            }

            onError(e);
        }
    },
    async removeProductDraft({
        state,
    }, {
        languageCode,
        attributeId,
        onSuccess = () => {},
        onError = () => {},
    }) {
        try {
            const {
                id,
            } = state;

            await removeDraftValue({
                $axios: this.app.$axios,
                id,
                languageCode,
                attributeId,
            });

            onSuccess();
        } catch (e) {
            if (this.app.$axios.isCancel(e)) {
                this.app.$addAlert({
                    type: ALERT_TYPE.WARNING,
                    message: 'Removing product draft has been canceled',
                });

                return;
            }

            onError(e);
        }
    },
};
