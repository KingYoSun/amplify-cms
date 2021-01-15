<template>
    <img
    :src="iconImg.imgPreview"
    v-if="iconImg.showPreviewImg"
    alt="ユーザアイコン"
    @error="removeImg"
    class="object-contain"
    style="max-width: 30px;border-radius: 50%;margin: 0 auto !important;"
    />
</template>

<script>
import * as Common from '~/assets/js/common.js'

export default {
    name: "UserIcon",
    data () {
        return {
            iconImg: {
                imgURL: null,
                imgPreview: null,
                showPreviewImg: false
            },
        }
    },
    props: {
        iconUrl: {
            type: String,
            default: ""
        }
    },
    async created () {
        if (this.iconUrl === "") return false
        this.iconImg.imgURL = this.iconUrl
        await Common.setImgFile(this.iconImg)
            .then((res) => {
                if (res != null || res != undefined) {
                    this.iconImg = res
                }
            })
    },
    methods: {
        removeImg () {
            this.iconImg.imgURL = null
            this.iconImg.showPreviewImg = false
        },
    }
}
</script>