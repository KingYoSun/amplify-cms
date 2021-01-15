<template>
    <div class="container pb-10" style="padding-top: 8rem">
        <custom-overlay :overlay="overlay" />
        <custom-dialog
        :dialog="showDialog"
        :message="dialogMessage"
        :cancel="false"
        @agree="redirectHome"
        />
        <div class="mx-4 max-w-screen-md">
            <p class="text-3xl font-black">{{ title }}</p>
            <p class="text-gray-600">投稿日時: {{ new Date(createdAt).toLocaleString() }}<span class="mx-2" />更新日時: {{ new Date(updatedAt).toLocaleString() }}</p>
            <div class="flex flex-wrap my-2">
                <span class="text-gray-600 mr-2">投稿者: </span>
                <button class="flex flex-wrap">
                    <img
                    :src="iconImg.imgPreview"
                    v-if="iconImg.showPreviewImg"
                    alt="ユーザアイコン"
                    @error="removeImg"
                    class="object-contain"
                    style="max-width: 30px;border-radius: 50%;margin: 0 auto !important;"
                    />
                    <span class="text-gray-600 hover:text-black ml-1">{{ user.name }}@{{ user.viewName }}</span>
                </button>
            </div>
            <div class="flex flex-wrap my-2">
                <span class="font-bold text-gray-600 mr-2">タグ:</span>
                <div v-for="(tag, index) in tags" :key="index">
                    <button class="mx-2 text-gray-600 hover:text-black">#{{ tag }}</button>
                </div>
            </div>
            <div v-if="showHtml" v-html="parsedHtml" />
            <div class="mt-3">
                <button
                class="uppercase px-8 py-2 bg-green-600 text-white max-w-max shadow-sm hover:shadow-md mr-2 mt-2"
                @click="$router.back()"
                >
                戻る
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import API, { graphqlOperation } from '@aws-amplify/api'
import Storage from '@aws-amplify/storage'
import CustomOverlay from '~/components/overlay.vue'
import CustomDialog from '~/components/dialog.vue'
import * as Common from '~/assets/js/common.js'
import Parser from 'editorjs-parser'

export default {
    components: {
        CustomOverlay,
        CustomDialog
    },
    data () {
        return {
            data: "",
            overlay: false,
            showDialog: false,
            dialogMessage: "",
            id: "",
            title: "",
            contentUrl: "",
            user: {
                id: "",
                name: "",
                viewName: "",
                iconUrl: "",
                identityID: ""
            },
            iconImg: {
                imgURL: null,
                imgPreview: null,
                showPreviewImg: false
            },
            tags: [],
            draft: false,
            createdAt: "",
            updatedAt: "",
            parser: null,
            parsedHtml: "",
            showHtml: false
        }
    },
    async created () {
        this.id = this.$route.params.id
        try {
            await this.getPostAPI()
            if (this.contentUrl === "") {
                throw "エラー！"
            }
            await this.getPostS3()
        } catch (e) {
            this.dialogMessage = "エラー！ホームに戻ります"
            this.showDialog = true
        }
    },
    methods: {
        removeImg () {
            this.$store.commit("removeImg")
            this.iconImg.imgURL = null
        },
        redirectHome () {
            this.$route.push('/')
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
                            user {
                                id
                                name
                                viewName
                                iconUrl
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
                        this.createdAt = ("createdAt" in items) ? items.createdAt : ""
                        this.updatedAt = ("updatedAt" in items) ? items.updatedAt : ""
                        this.iconImg.imgURL = ("iconUrl" in items.user) ? items.user.iconUrl : null
                        Common.setImgFile(this.iconImg)
                            .then((res) => {
                                if (res != null || res != undefined) {
                                    this.iconImg = res
                                }
                            })
                    })
            } catch (e) {
                console.log("記事の取得に失敗しました")
            }
        },
        async setData (blocks) {
            blocks = await Promise.all(
                blocks.map(async obj => {
                    if (obj.type === "image") {
                        await Storage.get(obj.data.file.key, {
                            level: 'protected',
                            identityId: this.user.identityId,
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
                    const editorJSON = reader.result.replace(/\\\"/g, '\"')
                    this.data = JSON.parse(editorJSON)
                    this.data.blocks = await this.setData(this.data.blocks)
                    this.setParser()
                }
            } catch (e) {
                console.log("Getting Image Failed: " + e)
            }
        },
        setParser () {
            const config = {
                image: {
                    use: "figure",
                    imgClass: "img",
                    figureClass: "fig-img",
                    figCapClass: "fig-cap",
                    path: "absolute",
                },
                paragraph: {
                    pClass: "paragraph",
                },
                code: {
                    codeBlockClass: "code-block",
                },
                embed: {
                    useProvidedLength: false,
                },
                quote: {
                    applyAlignment: false,
                },
            }
            const customParsers = {
                paragraph: function(data, config) {
                    return `<p class="paragraph text-${data.alignment}"> ${data.text} </p>`
                },
                AnyButton: function(data, config) {
                    return `<div class="text-center"><a class="btn btn--default" target="_blank" rel="nofollow noindex noreferrer" href="${data.link}">${data.text}</a></div>`
                }
            }
            const customEmbeds = {}
            this.parser = new Parser(config, customParsers, customEmbeds)
            this.parsedHtml = this.parser.parse(this.data)
            this.showHtml = true
        }
    }
}
</script>