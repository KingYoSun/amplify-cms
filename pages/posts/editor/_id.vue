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
            <div v-if="showEditor" class="w-full rounded-md border">
                <div id="editorjs" />
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
import Storage from '@aws-amplify/storage'
import CustomOverlay from '~/components/overlay.vue'
import CustomDialog from '~/components/dialog.vue'
import * as Common from '~/assets/js/common.js'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Embed from '@editorjs/embed'
import Paragraph from 'editorjs-paragraph-with-alignment'
import Quote from '@editorjs/quote'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import RawTool from '@editorjs/raw'
import AnyButton from 'editorjs-button'
import Delimiter from '@editorjs/delimiter'
import Marker from '@editorjs/marker'
import Underline from '@editorjs/underline'

export default {
    components: {
        CustomOverlay,
        CustomDialog
    },
    data () {
        return {
            overlay: false,
            showDialog: false,
            dialogMessage: "",
            newFlag: false,
            showEditor: false,
            id: "",
            title: "",
            contentUrl: "",
            _version: 0,
            user: {
                id: "",
                identityID: ""
            },
            editorText: "",
            editor: null,
        }
    },
    async created () { 
        //init EditorJS
        this.editor = new EditorJS({
            holder: 'editorjs',
            tools: {
                header: Header,
                embed: {
                    class: Embed,
                    inlineToolbar: true
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true
                },
                quote: Quote,
                list: {
                    class: List,
                    inlineToolbar: true
                },
                table: {
                    class: Table,
                    inlineToolbar: true
                },
                raw: RawTool,
                AnyButton: {
                    class: AnyButton,
                    inlineToolbar: true,
                    config: {
                        css: {
                            "background-color": "#3B82F6"
                        }
                    }
                },
                delimiter: Delimiter,
                Marker: {
                    class: Marker,
                    shortcut: 'CMD+SHIFT+M'
                },
                underline: Underline
            },
            i18n: {
                messages: {
                    ui: {
                        "blockTunes": {
                            "toggler": {
                                "Click to tune": "調整する",
                                "or drag to move": "ドラッグして動かす"
                            },
                        },
                        "inlineToolbar": {
                            "converter": {
                                "Convert to": "変換する",
                            }
                        },
                        "toolbar": {
                            "toolbox": {
                                "Add": "追加"
                            }
                        }
                    },
                    toolNames: {
                        "Heading": "ヘッダー",
                        "Quote": "引用",
                        "Text": "テキスト",
                        "List": "リスト",
                        "Table": "表",
                        "Raw HTML": "HTMLを直接入力",
                        "Button": "ボタン",
                        "Delimiter": "区切り",
                        "Bold": "太字",
                        "Italic": "斜体",
                        "Link": "リンク",
                        "Marker": "マーカー",
                        "Underline": "下線"
                    },
                    tools: {
                        "list": {
                            "Ordered": "数値順",
                            "Unordered": "点"
                        },
                        "AnyButton": {
                            'Button Text': 'ボタンに表示するテキスト',
                            'Link Url': 'ボタンの飛び先のURL',
                            'Set': "設定する",
                            'Default Button': "デフォルト",
                        }
                    },
                    blockTunes: {
                        "delete": {
                            "Delete": "削除"
                        },
                        "moveUp": {
                            "Move up": "上へ"
                        },
                        "moveDown": {
                            "Move down": "下へ"
                        }
                    },
                }
            }
        })
        //init Page
        this.id = this.$route.params.id
        if ([null, undefined, "", "new"].indexOf(this.id) === -1) {
            await this.getPostAPI()
            if (this.contentUrl !== "") {
                await this.getPostS3()
            } else {
                this.showEditor = true
            }
        } else {
            this.id = nanoid()
            this.newFlag = true
            this.showEditor = true
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
                this.editorText = ""
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
                    this.showEditor = true
                }
            } catch (e) {
                console.log("Getting Image Failed: " + e)
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