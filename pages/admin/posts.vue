<template>
    <div class="container pb-10" style="padding-top: 9rem">
        <custom-overlay :overlay="overlay" />
        <custom-dialog
        :dialog="showDialog"
        :message="dialogMessage"
        :cancel="false"
        @agree="refresh"
        />
        <div class="w-full mx-6">
            <search-form class="my-4" />
            <div>
                <div
                v-for="(post, index) in posts" :key="index"
                class="my-4 grid grid-cols-4 gap-4 items-center rounded overflow-hidden shadow-xl border-2 border-gray-300"
                >
                    <div class="col-span-3">
                        <div class="px-6 px-4">
                            <div class="font-bold text-xl">{{ post.title }}</div>
                            <p v-if="query.sort === 'createdAt'" class="text-gray-600 mb-2">投稿日時: {{ new Date(post.createdAt).toLocaleString() }}</p>
                            <p v-if="query.sort === 'updatedAt'" class="text-gray-600 mb-2">更新日時: {{ new Date(post.updatedAt).toLocaleString() }}</p>
                        </div>
                        <div class="px-6 px-4">
                            <div class="flex flex-wrap my-2">
                                <span class="text-gray-600 mr-2">投稿者: </span>
                                <button class="flex flex-wrap">
                                    <user-icon :iconUrl="post.user.iconUrl" />
                                    <span class="text-gray-600 hover:text-black ml-1">{{ post.user.name }}@{{ post.user.viewName }}</span>
                                </button>
                            </div>
                            <div class="flex flex-wrap my-2">
                                <span class="font-bold text-gray-600 mr-2">タグ:</span>
                                <div v-for="(tag, index) in JSON.parse(post.tags)" :key="index">
                                    <button class="mx-1 text-gray-600 hover:text-black">#{{ tag }}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap">
                        <button
                        class="uppercase px-4 py-2 bg-gray-600 text-white max-w-max shadow-sm hover:shadow-md mx-4 my-2"
                        @click="delPost(post)"
                        >
                        削除
                        </button>
                    </div>
                </div>
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
import UserIcon from '~/components/userIcon.vue'
import SearchForm from '~/components/searchForm.vue'
 
 export default {
     components: {
        CustomOverlay,
        CustomDialog,
        UserIcon,
        SearchForm
    },
     data () {
        return {
            overlay: false,
            showDialog: false,
            dialogMessage: "",
            posts: [],
            nextToken: null,
            page: 1,
            totalPages: 1,
            postCount: 0,
            postsPerPage: 8,
            queryUser: {
                id: "",
                identityID: "",
                name: "",
                viewName: "",
                iconUrl: ""
            },
            sortTypes: [
                {name: "作成日時順", value: "createdAt"},
                {name: "更新日時順", value: "updatedAt"}
            ],
            showQueryUser: false,
            loadflag: true
        }
    },
    asyncData (context) {
        let query = {
            title: "",
            tag: "",
            userID: "",
            date: "",
            sort: "createdAt"
        }
        const queryKey = Object.keys(context.query)
        queryKey.map((key) => {
            query[key] = context.query[key]
        })
        if([null, undefined, ""].indexOf(query.sort) !== -1) query.sort = "createdAt"
        const sortTypes = [
            {name: "作成日時順", value: "createdAt"},
            {name: "更新日時順", value: "updatedAt"}
        ]
        const sortObj = sortTypes.find(obj => obj.value === query.sort)
        const sortName = ([null, undefined, "", {}].indexOf(sortObj) === -1)? sortObj.name : "null"
        const now = new Date()
        const date = (query.date !== "")? new Date(Number(query.date.substring(0, 4)), Number(query.date.substring(5, 7))-1, Number(query.date.substring(8))) : new Date(now.getFullYear(), now.getMonth(), now.getDate())
        return { 
            query: query,
            sortName: sortName,
            date: date,
            nextTokens: [null]
        }
    },
    watchQuery: ['title', 'tag', 'userID', 'date', 'sort'],
    created () {
        if (this.$store.state.page === undefined || this.$store.state.nextToken === undefined || this.$store.state.nextTokens === undefined) {
            this.$store.commit("setupNextToken")
            this.$store.commit("setupPage")
        } else {
            this.page = this.$store.state.page
            this.nextTokens = this.$store.state.nextTokens
            this.nextToken = this.nextTokens[this.page -1]
            this.totalPages = this.nextTokens.length
        }
    },
    mounted () {
        this.startLoading()
    },
    computed: {
        disableBackBtn () {
            return ((this.page -1 < 1) ? true : false)
        },
        disableNextBtn () {
            return ( ([null, "null", ""].indexOf(this.nextToken) !== -1 && this.postCount < this.postsPerPage) ? true : false )
        }
    },
    watch: {
        query: function(newVal) {
            this.nextToken = null
            this.nextTokens = [null]
            this.$store.commit("setupNextToken")
            this.startLoading()
        },
    },
    methods: {
        refresh () {
            if (process.browser) {
                window.location.reload(true)
            }
        },
        removeImg (obj) {
            obj.imgURL = null
        },
        changeSort () {
            this.$router.push({path: "/", query: this.query})
        },
        backBtn () {
            this.page--
            this.$store.commit("setPage", this.page)
            this.postCount = 0
            this.posts = []
            this.$store.commit("setNextToken", this.nextToken)
            this.nextToken = this.nextTokens[this.page-1]
            this.getPosts()
        },
        nextBtn () {
            if (this.page === this.totalPages) {
                this.nextTokens.push(this.nextToken)
                this.$store.commit("setNextTokens", this.nextTokens)
                this.totalPages++
            }
            this.page++
            this.$store.commit("setPage", this.page)
            this.postCount = 0
            this.posts = []
            this.getPosts()
        },
        async startLoading () {
            if (this.query.userID !== "") {
                await this.getUser()
            }
            this.getPosts()
        },
        async getPostsCreatedAt (nextToken, filter) {
            const date = this.date
            this.date = new Date(date.setDate(date.getDate() + 1))
            const createdAtLe = ([null, undefined, ""].indexOf(this.date) === -1)? this.date.toISOString() : new Date().toISOString()
            const postByCreatedAt = `
                query PostByCreatedAt {
                    postByCreatedAt (
                        div: "1"
                        createdAt: {le: "${createdAtLe}"}
                        sortDirection: DESC
                        ${filter}
                        limit: ${this.postsPerPage - this.postCount}
                        nextToken: ${nextToken}
                    ) {
                    items {
                        id
                        div
                        title
                        tags
                        draft
                        createdAt
                        updatedAt
                        userID
                        user {
                            id
                            identityID
                            name
                            viewName
                            iconUrl
                        }
                        _version
                        _deleted
                    }
                    nextToken
                    }
                }
            `
            try {
                await API.graphql(graphqlOperation(postByCreatedAt))
                    .then((res) => {
                        const items = res.data.postByCreatedAt.items.filter(obj => !obj._deleted)
                        this.$store.commit("setNextToken", this.nextToken)
                        this.nextToken = res.data.postByCreatedAt.nextToken
                        this.posts = items
                        this.postCount += items.length
                        if (this.postCount >= this.postsPerPage || this.nextToken === null) {
                            this.loadflag = false
                        }
                    })
            } catch (e) {
                Common.failed(e, "投稿の読み込みに失敗しました", this.overlay)
                this.overlay = false
            }
        },
        async getPostsUpdatedAt (nextToken, filter) {
            const postByUpdatedAt = `
                query PostByUpdatedAt {
                    postByUpdatedAt (
                        div: "1"
                        updatedAt: {le: "${new Date().toISOString()}"}
                        sortDirection: DESC
                        ${filter}
                        limit: ${this.postsPerPage - this.postCount}
                        nextToken: ${nextToken}
                    ) {
                    items {
                        id
                        div
                        title
                        tags
                        draft
                        createdAt
                        updatedAt
                        userID
                        user {
                            id
                            identityID
                            name
                            viewName
                            iconUrl
                        }
                        _version
                        _deleted
                    }
                    nextToken
                    }
                }
            `
            try {
                await API.graphql(graphqlOperation(postByUpdatedAt))
                    .then((res) => {
                        const items = res.data.postByUpdatedAt.items.filter(obj => !obj._deleted)
                        this.$store.commit("setNextToken", this.nextToken)
                        this.nextToken = res.data.postByUpdatedAt.nextToken
                        this.posts = items
                        this.postCount += items.length
                        if (this.postCount >= this.postsPerPage || this.nextToken === null) {
                            this.loadflag = false
                        }
                    })
            } catch (e) {
                Common.failed(e, "投稿の読み込みに失敗しました", this.overlay)
                this.overlay = false
            }
        },
        async getPosts () {
            this.overlay = true
            let nextToken = null
            this.loadflag = true
            do {
                if (this.nextToken) {
                    nextToken = `"${this.nextToken}"`
                }
                const filterTitle = (this.query.title !== "")? `{title: {contains: "${this.query.title}"}},`: ''
                const filterTagTitle = (this.query.title !== "")? `{tags: {contains: "${this.query.title}"}},`: ''
                const filterTag = (this.query.tag !== "")? `{tags: {contains: "${this.query.tag}"}},`: ''
                const filterOR = ( filterTitle !== '' || filterTagTitle !== '' || filterTag !== '')? 'or: [' + filterTitle + filterTagTitle + filterTag + '],' : ''
                
                const filterUserID = (this.query.userID !== "")? `{userID: {eq: "${this.query.userID}"}},` : ''
                const filterAnd = ( filterUserID !== '')? 'and: [' + filterUserID + ']' : ''
                
                const filter = ( filterOR !== '' || filterAnd !== '')? 'filter: {' + filterOR + filterAnd + '}' : ''
                if (this.query.sort === "createdAt") {
                    await this.getPostsCreatedAt(nextToken, filter)
                } else if (this.query.sort === "updatedAt") {
                    await this.getPostsUpdatedAt(nextToken, filter)
                } else {
                    this.loadflag = false
                }
            } while (this.loadflag)
            this.overlay = false
            console.log("Loading done") 
        },
        async getUser() {
            this.overlay = true
            const getUser = `
                query GetUser {
                    getUser(id: "${this.query.userID}") {
                        id
                        identityID
                        name
                        viewName
                        iconUrl
                    }
                }
            `
            try {
                await API.graphql(graphqlOperation(getUser))
                    .then((res) => {
                        this.queryUser = res.data.getUser
                        this.overlay = false
                        this.showQueryUser = true
                    })
            } catch (e) {
                Common.failed(e, "ユーザーの読み込みに失敗しました", this.overlay)
                this.overlay = false
            }
        },
        async delPost(post) {
            if (!confirm("記事を削除してもよろしいですか？")) {
                return false
            }
            this.overlay = true
            try {
                const deletePost = `
                    mutation DeletePost {
                        deletePost(input: {
                            id: "${post.id}",
                            _version: ${post._version}
                        }) {
                            id
                        }
                    }
                `
                API.graphql(graphqlOperation(deletePost))
                    .then((res) => {
                        this.overlay = false
                        this.dialogMessage = "記事を削除しました"
                        this.showDialog = true
                    })
            } catch (e) {
                Common.failed(e, "投稿の削除に失敗しました", this.overlay)
                this.overlay = false
            }
        },
    }
 }
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
@apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
}

.title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
        'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}
</style>
