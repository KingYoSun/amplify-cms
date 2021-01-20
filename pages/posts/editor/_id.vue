<template>
    <div class="container pb-10" style="padding-top: 8rem">
        <custom-overlay :overlay="overlay" />
        <custom-dialog
        :dialog="showDialog"
        :message="dialogMessage"
        :cancel="false"
        @agree="refreshPage"
        />
        <div class="w-full mx-4">
            <div class="my-1">
                <label class="flex flex-wrap items-center">
                    <span class="text-gray-700">記事タイトル:</span>
                    <input v-model="title" type="text" class="form-input w-full mt-1" placeholder="記事タイトル">
                </label>
            </div>
            <div class="my-1">
                <label class="flex flex-wrap items-center mt-3">
                    <span class="text-gray-700">タグ:</span>
                    <input v-model="tag" type="text" class="form-input w-60 mx-2" placeholder="タグ">
                    <button
                    class="uppercase px-4 py-2 bg-green-600 text-white max-w-max shadow-sm hover:shadow-md"
                    @click="addTags"
                    >
                    タグ追加
                    </button>
                </label>
            </div>
            <div class="flex flex-wrap my-2">
                <div v-for="(tag, index) in tags" :key="index">
                    <div class="flex mx-2">
                        <trash @trash="delTags(tag)" />
                        <h4>#{{ tag }}{{ (index !== tags.length -1)? ',' : '' }}</h4>
                    </div>
                </div>
            </div>
            <div class="my-1 mt-5" style="text-align: start;">
                <span class="w-full">記事本文: {{ (draft)? "下書き" : "投稿済み" }}</span>
            </div>
            <div id="editorjs" class="rounded-md border" />
            <div class="mt-3">
                <button
                class="uppercase px-8 py-2 bg-green-600 text-white max-w-max shadow-sm hover:shadow-md mr-2 mt-2"
                @click="store(true)"
                >
                下書きを保存する
                </button>
                <button
                class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md mr-2 mt-2"
                @click="store(false)"
                >
                記事を投稿（更新）する
                </button>
                <button
                class="uppercase px-8 py-2 bg-gray-600 text-white max-w-max shadow-sm hover:shadow-md mr-2 mt-2"
                @click="preview"
                >
                記事のページに移動
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
import Trash from '~/components/icons/trash.vue'
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
import ImageTool from '@editorjs/image'

let identityID = ""
let postID = ""

export default {
    components: {
        CustomOverlay,
        CustomDialog,
        Trash
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
            version: 0,
            user: {
                id: "",
                identityID: ""
            },
            editorJSON: "",
            data: [],
            editor: null,
            tags: [],
            tag: "",
            draft: false,
            imageKeys: []
        }
    },
    async created () {
        //init Page
        const currentCredentials = await this.$Amplify.Auth.currentCredentials()
        this.user.identityID = currentCredentials.identityId
        identityID = this.user.identityID
        this.id = this.$route.params.id
        if ([null, undefined, "", "new"].indexOf(this.id) === -1) {
            await this.getPostAPI()
            postID  =this.id
            if (this.contentUrl !== "") {
                await this.getPostS3()
            }
        } else {
            this.id = nanoid()
            this.newFlag = true
            postID  =this.id
            this.setEditor()
        }
    },
    middleware: "admin",
    methods: {
        setEditor () {
            this.editor = new EditorJS({
                holder: 'editorjs',
                data: ([null, undefined, "", []].indexOf(this.data) !== -1) ? [] : this.data,
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
                    underline: Underline,
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile (file) {
                                    const imgExtension = file.type.replace('image/', '')
                                    const nowUnix = Common.getNow()
                                    const key = 'post/' + postID + '/' + nowUnix + '.' + imgExtension
                                    let s3Key = ""
                                    let s3Url = ""
                                    await Storage.put(key, file, {
                                        level: 'protected',
                                        contentType: file.type
                                    })
                                    .then (result => {
                                        s3Key = result.key
                                        console.log('image uploaded')
                                    })
                                    await Storage.get(key, {
                                        level: 'protected',
                                        identityId: identityID,
                                        expires: 86400
                                    })
                                    .then((res) => {
                                        s3Url = res
                                        console.log("image downloaded")
                                    })
                                    return {
                                        success: 1,
                                        file: {
                                            url: s3Url,
                                            key: s3Key
                                        }
                                    }
                                },
                                uploadByUrl (url) {
                                    return {
                                        success: 1,
                                        file: {
                                            url: url
                                        }
                                    }
                                }
                            }
                        }
                    }
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
                            "Underline": "下線",
                            "Image": "画像"
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
                            },
                            "image": {
                                "With background": "背景化",
                                "Stretch image": "ストレッチ",
                                "With border": "境界線"
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
        },
        async setData (blocks) {
            blocks = await Promise.all(
                blocks.map(async obj => {
                    if (obj.type === "image") {
                        await Storage.get(obj.data.file.key, {
                            level: 'protected',
                            identityId: identityID,
                            expires: 86400
                        })
                        .then((res) => {
                            obj.data.file.url = res
                            console.log("image downloaded")
                        })
                    }
                    return obj
                })
            )
            return blocks
        },
        addTags () {
            this.tags.push(this.tag)
            this.tags = [...new Set(this.tags)]
            this.tag = ""
        },
        delTags (deltag) {
            this.tags = this.tags.filter(tag => tag !== deltag)
        },
        refreshPage () {
            if (this.newFlag) {
                this.$router.push('/posts/editor/' + this.id)
            }
            if (!this.newFlag && process.browser) {
                window.location.reload(true)
            }
        },
        preview () {
            this.$router.push('/posts/' + this.id)
        },
        async setUser() {
            if ([null, undefined, ""].indexOf(this.user.id) !== -1) {
                this.user.id = this.$store.state.userID
            }
        },
        store (boolean) {
            this.draft = boolean
            this.post()
        },
        async post () {
            try {
                await this.setUser()
                await this.editor.save().then((outputData) => {
                    this.editorJSON = JSON.stringify(outputData).replace(/"/g, '\\"')
                }).catch((err) => {
                    throw "Saving Failed"
                })
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
            const key = 'post/' + this.id + '/' + this.id + '.txt'
            try {
                await Storage.put(key, this.editorJSON, {
                    level: 'protected',
                    contentType: 'text/plain'
                })
                .then (result => {
                    this.contentUrl = result.key
                    console.log('json file uploaded')
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
                            tags
                            draft
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
                        this.tags = ("tags" in items) ? JSON.parse(items.tags) : []
                        this.draft = ("draft" in items) ? items.draft : false
                        this.version = ("_version" in items) ? items._version : 0
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
                reader.onload = async () => {
                    this.editorJSON = reader.result.replace(/\\\"/g, '\"')
                    this.data = JSON.parse(this.editorJSON)
                    this.data.blocks = await this.setData(this.data.blocks)
                    this.setEditor()
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
                            div: "1",
                            title: "${this.title}",
                            contentUrl: "${this.contentUrl}",
                            tags: "${JSON.stringify(this.tags).replace(/"/g, '\\"')}",
                            draft: ${this.draft},
                            userID: "${this.user.id}"
                        }) {
                            id
                            title
                            contentUrl
                            tags
                            draft
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
                const updatePost = `
                    mutation UpdatePost {
                        updatePost(input: {
                            id: "${this.id}",
                            div: "1",
                            title: "${this.title}",
                            contentUrl: "${this.contentUrl}",
                            tags: "${JSON.stringify(this.tags).replace(/"/g, '\\"')}",
                            draft: ${this.draft},
                            _version: ${this.version}
                        }) {
                            id
                            title
                            contentUrl
                            tags
                            draft
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