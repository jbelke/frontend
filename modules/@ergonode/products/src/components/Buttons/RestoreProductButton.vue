/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Button
        :theme="secondaryTheme"
        :size="smallSize"
        :title="$t('product.buttons.restore')"
        :disabled="!isAllowedToRestore"
        @click.native="onShowModal">
        <template #prepend="{ color }">
            <IconRestore :fill-color="color" />
        </template>
        <RestoreProductAttributesModalForm
            v-if="isModalVisible"
            :language-code="languageCode"
            :elements="elements"
            @restored="onRestored"
            @close="onCloseModal" />
    </Button>
</template>

<script>
import {
    SIZE,
    THEME,
} from '@Core/defaults/theme';
import PRIVILEGES from '@Products/config/privileges';
import Button from '@UI/components/Button/Button';
import IconRestore from '@UI/components/Icons/Actions/IconRestore';
import {
    mapGetters,
    mapState,
} from 'vuex';

export default {
    name: 'RestoreProductButton',
    components: {
        Button,
        IconRestore,
        RestoreProductAttributesModalForm: () => import('@Products/components/Modals/RestoreProductAttributesModalForm'),
    },
    props: {
        languageCode: {
            type: String,
            required: true,
        },
        elements: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isModalVisible: false,
        };
    },
    computed: {
        ...mapState('authentication', {
            languagePrivileges: state => state.user.languagePrivileges,
        }),
        ...mapGetters('core', [
            'rootLanguage',
        ]),
        smallSize() {
            return SIZE.SMALL;
        },
        secondaryTheme() {
            return THEME.SECONDARY;
        },
        isAllowedToRestore() {
            return this.$hasAccess([
                PRIVILEGES.PRODUCT.update,
            ])
                && this.languagePrivileges[this.languageCode].edit
                && this.rootLanguage.code !== this.languageCode;
        },
    },
    methods: {
        onShowModal() {
            this.isModalVisible = true;
        },
        onCloseModal() {
            this.isModalVisible = false;
        },
        onRestored() {
            this.onCloseModal();
            this.$emit('restored');
        },
    },
};
</script>
