/*
 * Copyright © Bold Brand Commerce Sp. z o.o. All rights reserved.
 * See LICENSE for license details.
 */
<template>
    <li
        :class="classes"
        :draggable="!isDragged && !disabled"
        :title="hint"
        @dragstart="onDragStart"
        @dragend="onDragEnd">
        <template v-if="!isDragged">
            <slot />
            <IconDragDrop class="list-draggable-element__icon" />
        </template>
    </li>
</template>

<script>
import {
    DRAGGED_ELEMENT,
} from '@Core/defaults/grid';
import {
    addElementCopyToDocumentBody,
    removeElementCopyFromDocumentBody,
} from '@Core/models/layout/ElementCopy';
import IconDragDrop from '@UI/components/Icons/Actions/IconDragDrop';
import {
    mapActions,
} from 'vuex';

export default {
    name: 'ListDraggableElement',
    components: {
        IconDragDrop,
    },
    props: {
        /**
         * Determinate if the component is disabled
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * Unique draggable identifier
         */
        draggableId: {
            type: String,
            default: '',
        },
        /**
         *  The hint is a tip for the component
         */
        hint: {
            type: String,
            default: '',
        },
        /**
         * The label is a text caption or description for the component
         */
        label: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            isDragged: false,
        };
    },
    computed: {
        classes() {
            return [
                'list-draggable-element',
                {
                    'list-draggable-element--dragged': this.isDragged,
                    'list-draggable-element--disabled': this.disabled,
                },
            ];
        },
    },
    methods: {
        ...mapActions('draggable', [
            '__setState',
        ]),
        onDragStart(event) {
            addElementCopyToDocumentBody({
                event,
                id: this.draggableId,
                label: this.label,
            });

            this.isDragged = true;

            this.__setState({
                key: 'isElementDragging',
                value: DRAGGED_ELEMENT.LIST,
            });
            this.$emit('drag', true);
        },
        onDragEnd(event) {
            removeElementCopyFromDocumentBody(event);

            this.isDragged = false;

            this.__setState({
                key: 'isElementDragging',
                value: null,
            });
            this.$emit('drag', false);
        },
    },
};
</script>

<style lang="scss" scoped>
    .list-draggable-element {
        $element: &;

        position: relative;
        display: flex;
        align-items: center;
        min-height: 48px;
        padding: 0 16px 0 12px;
        box-sizing: border-box;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
        user-select: none;
        cursor: grab;

        &__icon {
            opacity: 0;
        }

        &--dragged {
            z-index: 11;
            background-color: $GREY_LIGHT;
            box-shadow: $ELEVATOR_HOLE;
        }

        &--disabled {
            position: relative;
            cursor: not-allowed;

            &:before {
                position: absolute;
                top: 0;
                left: 0;
                display: block;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.7);
                content: "";
            }
        }

        &:not(&--dragged):not(&--disabled):hover {
            background-color: $WHITESMOKE;

            #{$element}__icon {
                opacity: 1;
            }
        }
    }
</style>
