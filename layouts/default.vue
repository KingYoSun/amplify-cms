<template>
    <div>
        <nav class="flex fiexed items-center justify-between flex-wrap bg-gray-700 px-6 h-16 fixed w-full z-10 pin-t">
            <div class="flex items-center flex-no-shrink text-white mr-6">
                <a class="text-white no-underline hover:text-white hover:no-underline" href="#">
                    <span class="text-2xl pl-2">Amplify-CMS</span>
                </a>
            </div>

            <div class="block lg:hidden">
                <button
                id="nav-toggle"
                class="flex items-center px-3 py-2 border rounded text-gray-300 border-grey-700 hover:text-white hover:border-white"
                @click="showSideBar = !showSideBar"
                >
                    <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>

            <div class="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden lg:block pt-6 lg:pt-0" id="nav-content">
                <ul class="list-reset lg:flex justify-end flex-1 items-center h-16">
                    <li v-for="(link, index) in filteredItems" :key="index" class="mr-3">
                        <nuxt-link
                        class="inline-block font-bold text-gray-500 no-underline hover:text-gray-200 hover:text-underline py-2 px-4"
                        :to="link.to">
                            {{ link.title }}
                        </nuxt-link>
                    </li>
                    <li class="text-white" v-if="showProfileIcon">
                        <nuxt-link class="flex flex-wrap" to="/profile">
                            <img
                            :src="$store.state.imgPreview"
                            v-if="$store.state.showPreviewImg"
                            alt="ユーザアイコン"
                            @error="removeImg"
                            class="object-contain"
                            style="max-width: 40px;border-radius: 50%;"
                            />
                            <span class="mx-2">{{ $store.state.currentUserInfo.username }}</span>
                        </nuxt-link>
                    </li>
                    <li v-if="isLoggedIn">
                        <amplify-sign-out class="pt-2 mx-auto"/>
                    </li>
                </ul>
            </div>
        </nav>
        <div v-if="showSideBar" class="sidebar bg-gray-700 w-40 shadow-xl justify-items-end z-20">
            <div class="text-white" v-if="showProfileIcon">
                <nuxt-link to="/profile">
                    <img
                    :src="$store.state.imgPreview"
                    v-if="$store.state.showPreviewImg"
                    alt="ユーザアイコン"
                    @error="removeImg"
                    class="object-contain"
                    style="max-width: 50px;border-radius: 50%;margin: 0 auto !important;"
                    />
                    <span class="block w-full text-center">{{ $store.state.currentUserInfo.username }}</span>
                </nuxt-link>
            </div>
            <div v-if="isLoggedIn">
                <amplify-sign-out class="mx-1"/>
            </div>
            <div v-for="(link, index) in filteredItems" :key="index" class="py-3 px-3 text-center">
                <nuxt-link
                :to="link.to"
                class="text-gray-500 font-bold no-underline hover:text-gray-200 hover:text-underline"
                @click.native="showSideBar = false"
                >
                    {{ link.title }}
                </nuxt-link>
            </div>
        </div>
        <Nuxt />
    </div>
</template>

<script>
import API, { graphqlOperation } from '@aws-amplify/api'
import { AmplifyEventBus } from 'aws-amplify-vue'
import * as Common from '~/assets/js/common.js'
import { nanoid } from 'nanoid'

export default {
    data () {
        return {
            currentUserInfo: null,
            showSideBar: false,
            isLoggedIn: false,
            showProfileIcon: false,
            links: [
                {
                    title: 'ホーム',
                    to: '/',
                    status: ['loggedIn', 'loggedOut']
                },
                {
                    title: 'サインイン',
                    to: '/signin',
                    status: ['loggedOut']
                },
                {
                    title: '記事投稿',
                    to: '/posts/editor/new',
                    status: ['loggedIn']
                }
            ],
            img: {
                imgURL: null,
                imgPreview: null,
                showPreviewImg: false
            },
        }
    },
    async beforeCreate() {
        await AmplifyEventBus.$on('authState', async (info) => {
            if (info === 'signedIn') {
                this.$router.push('/')
                await this.getUserInfo()
                this.showProfileIcon = true
            } else if (info === 'signedOut') {
                this.$router.push('/')
                this.logout()
            }
        })
        await this.getUserInfo()
        if (this.isLoggedIn) this.showProfileIcon = true
    },
    computed: {
        filteredItems () {
            const self = this
            return self.links.filter((link) => {
                if (self.isLoggedIn) {
                    return link.status.indexOf('loggedIn') !== -1
                } else {
                    return link.status.indexOf('loggedOut') !== -1
                }
            })
        },
    },
    methods: {
        async getUserInfo () {
            this.currentUserInfo = this.$store.state.currentUserInfo || await this.$Amplify.Auth.currentUserInfo()
            if (this.currentUserInfo) {
                this.$store.commit('login', this.currentUserInfo)
                this.isLoggedIn = true
            }
            if (this.isLoggedIn) {
                await this.getProfile()
            }
        },
        logout () {
            this.$store.commit('logout')
            this.isLoggedIn = false
            this.$store.commit('removeImg')
        },
        async getProfile () {
            if (!this.currentUserInfo) {
                this.currentUserInfo = await this.$Amplify.Auth.currentUserInfo()
            }
            const userByCognitoId = `
                query UserByCognitoId {
                    userByCognitoID(
                        cognitoID: "${this.currentUserInfo.attributes.sub}",
                        limit: 1,
                        nextToken: null
                    ) {
                        items {
                            id
                            iconUrl
                        },
                        nextToken
                    }
                }
            `
            try {
                await API.graphql(graphqlOperation(userByCognitoId))
                    .then(async (res) => {
                        const items = res.data.userByCognitoID.items[0]
                        if (items == null || items == undefined || items == []) {
                            throw "Profile not found"
                        }
                        this.$store.commit('setUserID', items.id)
                        this.img.imgURL = ("iconUrl" in items) ? items.iconUrl : null
                        await Common.setImgFile(this.img)
                            .then((res) => {
                                if (res != null || res != undefined) {
                                    this.$store.commit("setImg", res.imgPreview)
                                }
                            })
                    })
            } catch (e) {
                console.log("Profile not found: " + e)
                this.createProfile(this.currentUserInfo)
            }
        },
        removeImg () {
            this.$store.commit("removeImg")
            this.img.imgURL = null
        },
        createProfile (currentUserInfo) {
            try {
                if ([null, undefined, "", {}].indexOf(currentUserInfo) !== -1) {
                    throw new Error('ユーザーが見つかりません')
                }
                const nowUnix = Common.getNow()
                const id = nanoid()
                const createUser = `
                    mutation CreateUser {
                        createUser(input: {
                            id: "${id}",
                            cognitoID: "${currentUserInfo.attributes.sub}",
                            name: "${currentUserInfo.username}",
                            viewName: "${currentUserInfo.username}",
                            email: "${currentUserInfo.attributes.email}",
                            description: "",
                        }) {
                            id
                            cognitoID
                            name
                            viewName
                            email
                            description
                        }
                    }
                `
                API.graphql(graphqlOperation(createUser))
                    .then(async (res)=> {
                        this.$store.commit('setUserID', id)
                        console.log("プロフィールを作成しました")
                        await this.getUserInfo()
                        if (this.isLoggedIn) {
                            this.showProfileIcon = false
                            this.showProfileIcon = true
                        }
                    })
            } catch (e) {
                console.log("プロフィールの作成に失敗しました: " + e)
            }
        },
    }
}
</script>

<style>
html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
}

.button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
}

.button--green:hover {
    color: #fff;
    background-color: #3b8070;
}

.button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
}

.button--grey:hover {
    color: #fff;
    background-color: #35495e;
}

.sidebar {
    position: absolute;
    top: 84px;
    right: 0px;
}
</style>
