<template>
    <div class="container pt-24 pb-10">
        <custom-overlay :overlay="overlay" />
        <custom-dialog
        :dialog="showDialog"
        :message="dialogMessage"
        :cancel="false"
        @agree="showDialog = !showDialog"
        />
        <div class="w-full mx-4" @submit.prevent>
            <div  class="mb-4">
                <span class="text-2xl">パスワードを変更する</span>
            </div>
            <form ref="formPass">
                <div class="my-1">
                    <label class="flex-none flex-wrap items-center">
                        <span class="text-gray-700">現在のパスワード:</span>
                        <input v-model="nowPass" type="password" class="form-input mt-1 ml-2" placeholder="現在のパスワード">
                    </label>
                </div>
                <div class="my-1">
                    <label class="flex-none flex-wrap items-center">
                        <span class="text-gray-700">新しいパスワード:</span>
                        <input v-model="newPass" type="password" class="form-input mt-1 ml-2" placeholder="新しいパスワード">
                    </label>
                </div>
                <div class="my-1">
                    <label class="flex-none flex-wrap items-center">
                        <span class="text-gray-700">新しいパスワード（確認用）:</span>
                        <input v-model="newPassConf" type="password" class="form-input mt-1 ml-2" placeholder="現在のパスワード">
                    </label>
                </div>
                <div class="my-2">
                    <button
                    class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md"
                    @click="validation"
                    >
                    変更
                    </button>
                </div>
            </form>
            <div class="mt-6">
                <button
                class="uppercase px-8 py-2 bg-green-600 text-white max-w-max shadow-sm hover:shadow-md"
                @click="nuxtLink('/profile')"
                >
                戻る
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Auth from '@aws-amplify/auth'
import CustomOverlay from '~/components/overlay.vue'
import CustomDialog from '~/components/dialog.vue'
import * as Common from '~/assets/js/common.js'

const patternEmail = new RegExp(/^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

export default {
    components: {
        CustomOverlay,
        CustomDialog
    },
    data () {
        return {
            confirmPass: "",
            showDialog: false,
            overlay: false,
            dialogMessage: "",
            nowPass: "",
            newPass: "",
            newPassConf: "",
            show1: false,
            show2: false,
            show3: false,
            required: value => !!value || "必須事項です",
            need8more: value => value.length > 7 || "8文字以上の英数字を入力してください",
            confirm: value => value == this.newPass || '同じパスワードを入力してください'
        }
    },
    methods: {
        nuxtLink (link) {
            this.$router.push(link)
        },
        validation () {
            try {
                if([this.nowPass, this.newPass, this.newPassConf].indexOf("") !== -1 || this.newPass.length < 8 || this.newPass !== this.newPassConf) {
                    throw "ExceptionOccured"
                }
                 this.changePass()
            } catch (e) {
                Common.failed(e, "バリデーションエラー", this.overlay)
            }
        },
        async changePass () {
            this.overlay = true
            const user = await Auth.currentAuthenticatedUser()
            try {
                await Auth.changePassword(
                    user,
                    this.nowPass,
                    this.newPass
                ).then((res) => {
                    console.log('update email: ' + res)
                    this.dialogMessage = "パスワードを変更しました"
                    this.overlay = false
                    this.showDialog = true
                })
            } catch (e) {
                Common.failed(e, "パスワードの変更に失敗しました", this.overlay)
            }
        },
    },
    middleware: 'auth'
}
</script>