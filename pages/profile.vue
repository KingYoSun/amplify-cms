<template>
    <div class="container pb-10" style="padding-top: 9em;">
        <custom-overlay :overlay="overlay" />
        <custom-dialog
        :dialog="showDialog"
        :message="dialogMessage"
        :cancel="false"
        @agree="refresh"
        />
        <form ref="formProfile" @submit.prevent class="w-full max-w-screen-sm mx-4">
            <div class="my-2">
                <div v-if="icon.showPreviewImg">
                    <img
                    :src="icon.imgPreview"
                    alt="アイコンのプレビュー"
                    @error="Common.resetImgURL(icon)"
                    class="object-contain"
                    style="max-width: 100px;border-radius: 50%;margin: 0 auto !important;"
                    />
                </div>
            </div>
            <div class="my-1">
                <input
                type="file"
                ref="imgFile"
                name="image"
                accept="image/*"
                @change="storeImgIcon"
                />
            </div>
            <div class="my-1">
                <label class="flex flex-wrap items-center">
                    <span class="text-gray-700">ユーザーID:</span>
                    <input v-model="username" type="text" class="form-input mt-1 ml-2 text-gray-500" placeholder="ユーザーID" disabled>
                </label>
            </div>
            <div class="my-1">
                <label class="flex flex-wrap items-center">
                    <span class="text-gray-700">ユーザー名:</span>
                    <input v-model="viewName" type="text" class="form-input mt-1 ml-2" placeholder="ユーザー名">
                </label>
            </div>
            <div class="flex flex-wrap items-center my-1">
                <label class="flex flex-wrap items-center mr-3">
                    <span class="text-gray-700">メールアドレス:</span>
                    <input v-model="email" type="text" class="form-input mt-1 ml-2 text-gray-500" placeholder="メールアドレス" disabled>
                </label>
                <button
                class="uppercase px-8 py-2 bg-green-600 text-white max-w-max shadow-sm hover:shadow-md"
                @click="nuxtLink('/changeEmail')"
                >
                変更する
                </button>
            </div>
            <div class="my-1">
                <label class="flex flex-wrap my-1">
                    <span class="text-gray-700">紹介文:</span>
                    <textarea v-model="description" class="form-textarea mt-1 block w-full" rows="4" placeholder="紹介文"></textarea>
                </label>
            </div>
            <div class="mt-3">
                <button
                class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md mr-2 mt-2"
                @click="validation"
                >
                プロフィールを更新
                </button>
                <button
                class="uppercase px-8 py-2 bg-green-600 text-white max-w-max shadow-sm hover:shadow-md mt-2"
                @click="nuxtLink('/changePass')"
                >
                パスワードを変更する
                </button>
            </div>
        </form>
    </div>
</template>

<script>
import API, { graphqlOperation } from '@aws-amplify/api'
import Storage from '@aws-amplify/storage'
import CustomOverlay from '~/components/overlay.vue'
import CustomDialog from '~/components/dialog.vue'
import * as Common from '~/assets/js/common.js'

export default {
    components: {
        CustomOverlay,
        CustomDialog
    },
    data () {
        return {
            overlay: false,
            showDialog: false,
            dialogMessage: "プロフィールを更新しました",
            currentUserInfo: null,
            currentCredentials: null,
            id: "",
            username: "",
            viewName: "",
            email: "",
            description: "",
            icon: {
                name: "icon",
                imgURL: null,
                imgFile: null,
                imgType: null,
                imgPreview: null,
                showPreviewImg: false,
            },
            _version: 0,
            required: value => !!value || "必須事項です",
            maxFileSize: value => !value || value.size < 3*1024*1024 || 'ファイルサイズは3MB以下にしてください'
        }
    },
    async created () {
        this.currentUserInfo = this.$store.state.currentUserInfo
        if (!this.currentUserInfo) {
            this.currentUserInfo = await this.$Amplify.Auth.currentUserInfo()
        }
        this.currentCredentials = await this.$Amplify.Auth.currentCredentials()
        this.username = this.currentUserInfo.username
        this.email = this.currentUserInfo.attributes.email
        this.getProfile()
    },
    methods: {
        refresh () {
            if (process.browser) {
                window.location.reload(true)
            }
        },
        nuxtLink (link) {
            this.$router.push(link)
        },
        validation () {
            try {
                if(this.viewName === "") {
                    throw "ExceptionOccured"
                }
                 this.startUpdateProfile()
            } catch (e) {
                Common.failed(e, "バリデーションエラー", this.overlay)
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
                            name
                            viewName
                            email
                            description
                            iconUrl
                        }
                    }
                }
            `
            try {
                await API.graphql(graphqlOperation(userByCognitoId))
                    .then((res) => {
                        const items = res.data.userByCognitoID.items[0]
                        this.id = ("id" in items) ? items.id : ""
                        this.viewName = ("viewName" in items) ? items.viewName : ""
                        this.description = ("description" in items) ? items.description.replace(/\\n/g, '\n') : ""
                        this.icon.imgURL = ("iconUrl" in items && items.iconUrl !== "") ? items.iconUrl : null
                        Common.setImgFile(this.icon)
                        this.overlay = false
                    })
            } catch (e) {
                console.log(e)
                this.description = ""
            }
        },
        storeImgIcon (e) {
            const files = this.$refs.imgFile
            const fileImg = files.files[0]
            this.icon.imgPreview = null
            this.icon.imgFile = null
            this.icon.showPreviewImg = false
            try{
                if (fileImg == undefined || fileImg == null || !fileImg.type.startsWith("image/")) {
                    throw "ExceptionOccured"
                }
                this.icon.imgFile = fileImg
                this.icon.imgType = fileImg.type
                const reader = new FileReader()
                reader.readAsDataURL(fileImg)
                reader.onload = () => {
                    this.icon.imgPreview = reader.result
                    this.icon.showPreviewImg = true
                }
            } catch (e) {
                console.log("Store Image Failed: " + e)
            }
        },
        async startUpdateProfile () {
            this.overlay = true
            if (this.icon.imgFile != null) {
                if (this.icon.imgURL != null && this.icon.imgURL != undefined && this.icon.imgURL != "null") {
                    await Common.S3Remove(this.icon, this.overlay)
                }
                await Common.S3Upload(this.icon, this.id, this.overlay)
            }
            this.updateProfile()
        },
        async updateProfile () {
            this.overlay = true
            const date = new Date()
            const nowUnix = Math.floor(date.getTime() / 1000)
            const updateUser = `
            mutation UpdateUser {
                updateUser(input: {
                    id: "${this.id}",
                    name: "${this.currentUserInfo.username}",
                    viewName: "${this.viewName}",
                    email: "${this.currentUserInfo.attributes.email}",
                    description: "${this.description.replace(/\n/g,'\\n')}",
                    iconUrl: "${this.icon.imgURL}",
                    identityID: "${this.currentCredentials.identityId}"
                }) {
                    id
                    name
                    viewName
                    email
                    description
                    iconUrl
                    identityID
                }
            }
            `
            try {
                await API.graphql(graphqlOperation(updateUser))
                    .then((res)=> {
                        console.log("succedeed")
                        this.showDialog = true
                        this.$store.commit("setImg", this.icon.imgPreview)
                    })
            } catch (e) {
                Common.failed(e, "プロフィールの更新に失敗しました", this.overlay)
                this.overlay = false
            }
            this.overlay = false
        },
    },
    middleware: 'auth'
}
</script>