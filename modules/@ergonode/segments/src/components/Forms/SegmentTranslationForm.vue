/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <Card :title="selectedLanguage">
        <Form :errors="translationErrors">
            <template #body>
                <FormSection>
                    <TextField
                        :data-cy="dataCyGenerator(nameKeyField)"
                        :value="translations.name[languageCode]"
                        label="Condition set name"
                        :error-messages="translationErrors[nameKeyField]"
                        :disabled="!isAllowedToUpdate"
                        @input="(value) => setTranslationPropertyValue(value, nameKeyField)" />
                    <TextArea
                        :data-cy="dataCyGenerator(descriptionKeyField)"
                        :value="translations.description[languageCode]"
                        label="Description"
                        resize="vertical"
                        height="150px"
                        :error-messages="translationErrors[descriptionKeyField]"
                        :disabled="!isAllowedToUpdate"
                        @input="(value) => setTranslationPropertyValue(
                            value,
                            descriptionKeyField,
                        )" />
                    <Divider v-if="extendedForm.length" />
                    <template v-for="(field, index) in extendedForm">
                        <Component
                            :is="field.component"
                            :key="index"
                            v-bind="bindingProps(field)" />
                    </template>
                </FormSection>
            </template>
        </Form>
    </Card>
</template>

<script>
import translationCardMixin from '@Core/mixins/card/translationCardMixin';
import PRIVILEGES from '@Segments/config/privileges';
import Card from '@UI/components/Card/Card';
import Divider from '@UI/components/Dividers/Divider';
import Form from '@UI/components/Form/Form';
import FormSection from '@UI/components/Form/Section/FormSection';
import TextArea from '@UI/components/TextArea/TextArea';
import TextField from '@UI/components/TextField/TextField';

export default {
    name: 'SegmentTranslationForm',
    components: {
        Divider,
        Form,
        FormSection,
        Card,
        TextField,
        TextArea,
    },
    mixins: [
        translationCardMixin,
    ],
    computed: {
        isAllowedToUpdate() {
            return this.$hasAccess([
                PRIVILEGES.SEGMENT.update,
            ]);
        },
        extendedForm() {
            return this.$extendedForm({
                key: '@Segments/components/Forms/SegmentTranslationForm',
            });
        },
        descriptionKeyField() {
            return 'description';
        },
        nameKeyField() {
            return 'name';
        },
    },
    methods: {
        bindingProps({
            props = {},
        }) {
            return {
                disabled: !this.isAllowedToUpdate,
                scope: this.scope,
                changeValues: this.changeValues,
                errors: this.translationErrors,
                languageCode: this.languageCode,
                ...props,
            };
        },
        dataCyGenerator(key) {
            return `segment-${key}_${this.languageCode}`;
        },
    },
};
</script>
