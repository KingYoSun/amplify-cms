<template>
    <aside
      class="transform top-0 left-0 w-64 bg-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    >
        <span
        @click="isOpen = false"
        class="flex w-full items-center p-4 border-b text-2xl"
        >
            Amplify-CMS
        </span>
        <div
        v-for="(link, index) in links" :key="index"
        class="flex items-center p-4 hover:bg-indigo-500 hover:text-white "
        >
            <nuxt-link
            :to="link.to"
            class="text-gray-700 font-bold no-underline hover:text-gray-200 hover:text-underline"
            @click.native="clickLink"
            >
                {{ link.title }}
            </nuxt-link>
        </div>
    </aside>
</template>

<script>
export default {
    name: "AdminSidebar",
    data () {
        return {
            links: [
                {
                    title: "管理画面ホーム",
                    to: "/admin/",
                },
                {
                    title: '記事投稿',
                    to: '/posts/editor/new',
                }
            ]
        }
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        clickLink () {
            this.$emit("onClickLink")
        }
    },
    mounted () {
        document.addEventListener("keydown", e => {
            if (e.keyCode == 27 && this.isOpen) this.isOpen = false
        })
    },
    watch: {
        isOpen: {
            immediate: true,
            handler(isOpen) {
                if (process.client) {
                    if (isOpen) document.body.style.setProperty("overflow", "hidden");
                    else document.body.style.removeProperty("overflow")
                }
            }
        }
    }
}
</script>