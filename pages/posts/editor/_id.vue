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
            <div class="my-1">
                <label class="flex flex-wrap items-center">
                    <span class="text-gray-700">記事タイトル:</span>
                    <input v-model="title" type="text" class="form-input w-full mt-1" placeholder="記事タイトル">
                </label>
            </div>
            <div class="my-1 mt-3" style="text-align: start;">
                <span class="w-full">記事本文:</span>
            </div>
            <div class="w-full" style="text-align: start;">
                <editor
                :initialValue="editorText"
                :options="editorOptions"
                height="500px"
                previewStyle="vertical"
                ref="editor"
                />
                <viewer :value="editorText" />
            </div>
            <div class="mt-3">
                <button
                class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md mr-2 mt-2"
                @click="post"
                >
                記事を投稿（更新）する
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import API, { graphqlOperation } from '@aws-amplify/api'
import { nanoid } from 'nanoid'
import { Editor, Viewer } from '@toast-ui/vue-editor'
import Storage from '@aws-amplify/storage'
import CustomOverlay from '~/components/overlay.vue'
import CustomDialog from '~/components/dialog.vue'
import * as Common from '~/assets/js/common.js'
import { version } from 'codemirror'


export default {
    components: {
        Editor,
        Viewer,
        CustomOverlay,
        CustomDialog
    },
    data () {
        return {
            overlay: false,
            showDialog: false,
            dialogMessage: "",
            newFlag: false,
            id: "",
            title: "",
            contentUrl: "",
            _version: 0,
            user: {
                id: "",
                identityID: ""
            },
            editorText: "",
            editorOptions: {
                hideModeSwitch: true,
                toolbarItems: [
                    'heading',
                    'bold',
                    'italic',
                    'strike',
                    'divider',
                    'hr',
                    'quote',
                    'divider',
                    'ul',
                    'ol',
                    'task',
                    'indent',
                    'outdent',
                    'divider',
                    'table',
                    'link',
                    'divider',
                    'code',
                    'codeblock'
                ]
            }
        }
    },
    async created () { 
        this.id = this.$route.params.id
        if ([null, undefined, "", "new"].indexOf(this.id) === -1) {
            await this.getPostAPI()
            if (this.contentUrl !== "") await this.getPostS3()
        } else {
            this.id = nanoid()
            this.newFlag = true
        }
    },
    methods: {
        async setUser() {
            if ([null, undefined, ""].indexOf(this.user.id) !== -1) {
                this.user.id = this.$store.state.userID
                console.log(this.$store.state.userID)
            }
        },
        async post () {
            try {
                await this.setUser()
                this.editorText = this.$refs.editor.invoke('getHtml')
                if (this.editorText === "") throw "ValidationError"
                this.overlay = true
                if (!this.newFlag) await this.S3Remove()
                await this.S3Upload()
                if (this.newFlag) {
                    this.createPostAPI()
                } else {
                    this.updatePostAPI()
                }
            } catch (e) {
                Common.failed(e, "バリデーションエラー", this.overlay)
                this.overlay = false
            }
            
        },
        async S3Upload () {
            const key = 'post' + '/' + this.id + '.txt'
            try {
                await Storage.put(key, this.editorText, {
                    level: 'protected',
                    contentType: 'text/plain'
                })
                .then (result => {
                    this.contentUrl = result.key
                    console.log('md file uploaded')
                })
                .catch(e => {
                    Common.failed(e, "記事のアップロードに失敗しました", this.overlay)
                    this.overlay = false
                })
            } catch (e) {
                Common.failed(e, "記事のアップロードに失敗しました", this.overlay)
                this.overlay = false
            }
        },
        async S3Remove () {
            try {
                await Storage.remove(this.contentUrl, { level: 'protected' })
                    .then(result => {
                        this.contentUrl = ""
                    })
                    .catch(e => {
                        Common.failed(e, "記事の削除に失敗しました", this.overlay)
                        this.overlay = false
                    })
            } catch (e) {
                Common.failed(e, "記事の削除に失敗しました", this.overlay)
                this.overlay = false
            }
        },
        async getPostAPI () {
            try {
                const getPost = `
                    query GetPost {
                        getPost(id: "${this.id}") {
                            id
                            title
                            contentUrl
                            userID
                            createdAt
                            updatedAt
                            _version
                            user {
                                id
                                identityID
                            }
                        }
                    }
                `
                await API.graphql(graphqlOperation(getPost))
                    .then((res) => {
                        const items = res.data.getPost
                        if ([null, undefined, "", {}, []].indexOf(items) !== -1) {
                            throw "ExceptionOccured"
                        }
                        this.id = ("id" in items) ? items.id : ""
                        this.title = ("title" in items) ? items.title : ""
                        this.contentUrl = ("contentUrl" in items) ? items.contentUrl : ""
                        this.user = ("user" in items) ? items.user : {}
                        this._version = ("_version" in items) ? items._version : 0
                    })
            } catch (e) {
                console.log("記事の取得に失敗しました")
            }
        },
        async getPostS3 () {
            try {
                let data = await Storage.get(this.contentUrl, {
                    level: 'protected',
                    identityId: this.user.identityId,
                    download: true,
                    cacheControl: 'no-cache'
                })
                let reader = new FileReader()
                reader.readAsText(data.Body, 'utf-8')
                reader.onload = () => {
                    this.editorText = reader.result
                }
            } catch (e) {
                console.log("Getting Image Failed: " + e)
            } finally {
                return obj
            }
        },
        async createPostAPI () {
            try {
                const createPost = `
                    mutation CreatePost {
                        createPost(input: {
                            id: "${this.id}",
                            title: "${this.title}",
                            contentUrl: "${this.contentUrl}",
                            userID: "${this.user.id}"
                        }) {
                            id
                            title
                            contentUrl
                            userID
                        }
                    }
                `
                await API.graphql(graphqlOperation(createPost))
                    .then((res) => {
                        this.overlay = false
                        this.dialogMessage = "投稿が完了しました"
                        this.showDialog = true
                    })
            } catch (e) {
                Common.failed(e, "投稿に失敗しました", this.overlay)
                this.overlay = false
            }
        },
        async updatePostAPI () {
            try {
                this._version++
                const updatePost = `
                    mutation UpdatePost {
                        updatePost(input: {
                            id: "${this.id}",
                            title: "${this.title}",
                            contentUrl: "${this.contentUrl}",
                            _version: ${this._version}
                        }) {
                            id
                            title
                            contentUrl
                            userID
                            createdAt
                            updatedAt
                            _version
                        }
                    }
                `
                await API.graphql(graphqlOperation(updatePost))
                    .then((res) => {
                        this.overlay = false
                        this.dialogMessage = "投稿を更新しました"
                        this.showDialog = true
                    })
            } catch (e) {
                Common.failed(e, "投稿の更新に失敗しました", this.overlay)
                this.overlay = false
            }
        }
    }
}
</script>