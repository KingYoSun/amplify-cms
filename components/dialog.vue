<template>
    <div
    v-if="showDialog"
    class="fixed z-10 inset-0 overflow-y-auto"
    >
        <div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
            <div class="bg-black opacity-25 w-full h-full absolute z-10 inset-0">
            </div>
            <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative">
                <div class="md:flex items-center">
                    <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                        <p class="font-bold">{{ title }}</p>
                        <p class="text-sm text-gray-700 mt-1">
                            {{ message }}
                        </p>
                    </div>
                </div>
                <div class="text-center md:text-right mt-4 md:flex md:justify-end">
                    <button
                    @click="agree"
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                        OK
                    </button>
                    <button
                    @click="calcel"
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CustomDialog",
    data () {
        return {
            showDialog: false
        }
    },
    props: {
        dialog: {
                type: Boolean,
                default: false
        },
        title: {
            type: String,
            default: ""
        },
        message: {
                type: String,
                default: ""
        },
        cancel: {
                type: Boolean,
                default: false
        }
    },
    watch: {
        dialog: function(newOne, oldOne) {
            this.showDialog = newOne
        }
    },
    methods: {
        agree () {
            this.$emit("agree")
        },
        calcel () {
            this.dialog = false
        }
    }
}
</script>

<style>
.modal {
    transition: opacity 0.25s ease;
}
.modal-active {
    overflow-x: hidden;
    overflow-y: visible !important;
}
</style>