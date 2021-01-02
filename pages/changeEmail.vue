<template>
    <div class="container pt-24 pb-10">
        <custom-overlay :overlay="overlay" />
        <custom-dialog
        :dialog="showDialog"
        :message="dialogMessage"
        :cancel="false"
        @agree="showDialog = !showDialog"
        />
        <div class="w-full mx-4">
            <div class="mb-4">
                <span class="text-2xl">メールアドレスを変更する</span>
            </div>
            <form ref="formEmail" @submit.prevent>
                <div class="my-1">
                    <label class="flex-none flex-wrap items-center">
                        <span class="text-gray-700">変更先メールアドレス:</span>
                        <input v-model="email" type="text" class="form-input mt-1 ml-2" placeholder="変更先メールアドレス">
                    </label>
                </div>
                <div class="my-1">
                    <label class="flex-none flex-wrap items-center">
                        <span class="text-gray-700">確認用メールアドレス:</span>
                        <input v-model="confirmEmail" type="text" class="form-input mt-1 ml-2" placeholder="確認用メールアドレス">
                    </label>
                </div>
                <div class="my-1">
                    <button
                        class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md mr-2"
                        @click="validation"
                        >
                        確認メールを送信
                    </button>
                </div>
            </form>
            <div class="pt-6">
                <div class="mt-6">
                    <span class="text-2xl">確認用コードを入力する</span>
                </div>
                <form ref="formConfirm" @submit.prevent>
                    <div class="my-1">
                        <label class="flex-nonte flex-wrap items-center">
                            <span class="text-gray-700">確認用コード:</span>
                            <input v-model="code" type="text" class="form-input mt-1 ml-2" placeholder="確認用コード">
                        </label>
                    </div>
                    <div class="my-1">
                        <button
                        class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md mr-2"
                        @click="verifyEmail"
                        >
                            確認
                        </button>
                    </div>
                </form>
            </div>
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
import API, { graphqlOperation } from '@aws-amplify/api'
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
            currentUserInfo: null,
            id: "",
            username: "",
            email: "",
            confirmEmail: "",
            showDialog: false,
            overlay: false,
            dialogMessage: "",
            code: "",
            required: value => !!value || "必須事項です",
            validateEmail: value => patternEmail.test(value) || 'メールアドレスを入力してください',
            confirm: value => value == this.email || '確認用メールアドレス欄にも同様のメールアドレスを入力してください'
        }
    },
    async created () {
        this.currentUserInfo = this.$store.state.currentUserInfo
        if (!this.currentUserInfo) {
            this.currentUserInfo = await this.$Amplify.Auth.currentUserInfo()
        }
        this.username = this.currentUserInfo.username
        this.email = this.currentUserInfo.attributes.email
        this.getProfile()
    },
    methods: {
        nuxtLink (link) {
            this.$router.push(link)
        },
        validation () {
            try {
                if(this.email === "" || this.email !== this.confirmEmail || !patternEmail.test(this.email)) {
                    throw "ExceptionOccured"
                }
                 this.updateEmail()
            } catch (e) {
                Common.failed(e, "バリデーションエラー", this.overlay)
            }
        },
        verifyValidation () {
            try {
                if(this.code === "") {
                    throw "ExceptionOccured"
                }
                 this.verifyEmail()
            } catch (e) {
                Common.failed(e, "バリデーションエラー", this.overlay)
            }
        },
        async updateEmail () {
            this.overlay = true
            const user = await Auth.currentAuthenticatedUser()
            try {
                await Auth.updateUserAttributes(
                    user,
                    { 
                        email: this.email, // 新しいメールアドレス
                    }
                ).then((res) => {
                    console.log('update email: ' + res)
                    this.dialogMessage = "確認用メールを送信しました。メールに記載されているコードを確認用フォームに入力してください"
                    this.overlay = false
                    this.showDialog = true
                })
            } catch (e) {
                Common.failed(e, "確認メールの送信に失敗しました。再送信ボタンから確認メールを再送信してください", this.overlay)
            }
        },
        async verifyEmail () {
            try {
                await Auth.verifyCurrentUserAttributeSubmit(
                    'email',
                    this.code // 認証コード
                ).then((res)=> {
                    console.log('verify email: ' + res)
                    this.updateProfile()
                })
            } catch (e) {
                Common.failed(e, "確認メールの送信に失敗しました。確認メールを確認してから再度確認メールを送信してください", this.overlay)
            }
        },
        async getProfile () {
            this.overlay = true
            const userByCognitoId = `
                query UserByCognitoId {
                    userByCognitoID(
                        cognitoID: "${this.currentUserInfo.attributes.sub}",
                        limit: 1,
                        nextToken: null
                    ) {
                        items {
                            id
                        }
                    }
                }
            `
            try {
                await API.graphql(graphqlOperation(userByCognitoId))
                    .then((res) => {
                        const items = res.data.userByCognitoID.items[0]
                        this.id = ("id" in items) ? items.id : ""
                        this.overlay = false
                    })
            } catch (e) {
                console.log(e)
            }
        },
        async updateProfile () {
            const updateUser = `
            mutation UpdateUser {
                updateUser(input: {
                    id: "${this.id}",
                    name: "${this.username}",
                    email: "${this.email}"
                }) {
                id
                name
                email
                }
            }
            `
            try {
                await API.graphql(graphqlOperation(updateUser))
                    .then((res)=> {
                        console.log("succeded")
                        this.currentUserInfo.attributes.email = this.email
                        this.$store.commit('login', this.currentUserInfo)
                        this.dialogMessage = "メールアドレスの確認が完了しました"
                        this.overlay = false
                        this.showDialog = true
                    })
            } catch (e) {
                Common.failed(e + "メールアドレスの更新に失敗しました", this.overlay)
            }
        },
    },
    middleware: 'auth'
}
</script>