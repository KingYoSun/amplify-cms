<template>
    <div>
        <div class="shadow-md border-2 border-gray-300 max-w-screen-sm">
            <div :class="containerBoxClass">
                <input class="absolute opacity-0" id="tab-single-one" type="radio" name="tabs2" ref="tabs2" @click="changeStatus">
                <label class="block p-5 leading-normal cursor-pointer" for="tab-single-one">検索フォーム</label>
                <div :class="contentBoxClass">
                    <div class="my-2 mx-4">
                        <label class="flex flex-wrap items-center">
                            <span class="text-gray-700">キーワード:</span>
                            <input v-model="title" type="text" class="form-input w-full mt-1" placeholder="キーワード" @submit="search">
                        </label>
                    </div>
                    <datepicker
                    class="mx-4 my-2"
                    v-model="date"
                    placeholder="日付"
                    language="ja"
                    :format="customFormatter"
                    @opened="opened"
                    @closed="closed"
                    />
                    <button
                    class="uppercase px-8 py-2 bg-blue-600 text-white max-w-max shadow-sm hover:shadow-md mx-4 my-2"
                    @click="search"
                    >
                    検索
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Datepicker from '@hokify/vuejs-datepicker'
import moment from 'moment'
import 'moment/locale/ja'

export default {
    name: "SearchForm",
    components: {
        Datepicker
    },
    data () {
        return {
            title: "",
            date: new Date(),
            setCheck: null,
            datepickerOpened: false,
        }
    },
    created () {
        this.title = (this.$route.query.title !== undefined)? this.$route.query.title : ""
        this.date = (this.$route.query.date !== undefined)? new Date(this.$route.query.date) : new Date()
    },
    computed: {
        contentBoxClass () {
            const cls = "tab-content border-l-2 bg-gray-100 border-indigo-500 leading-normal "
            const overflw = (this.datepickerOpened)? '' : 'overflow-hidden'
            return cls + overflw
        },
        containerBoxClass () {
            const cls = "tab border-t "
            const overflw = (this.datepickerOpened)? '' : 'overflow-hidden'
            return cls + overflw
        }
    },
    methods: {
        changeStatus () {
            if (this.setCheck != this.$refs.tabs2) {
                this.setCheck = this.$refs.tabs2
            } else {
                this.$refs.tabs2.checked = false
                this.setCheck = null
            }
        },
        opened () {
            this.datepickerOpened = true
        },
        closed () {
            this.datepickerOpened = false
        },
        customFormatter (date) {
            return moment(date).format('YYYY-MM-DD')
        },
        search () {
            if (this.title === "") return false
            const tag = (this.$route.query.tag !== undefined)? this.$route.query.tag : ""
            const userID =(this.$route.query.userID !== undefined)? this.$route.query.userID : ""
            const sort = (this.$route.query.sort !== undefined)? this.$route.query.sort : ""
            const query = {
                title: this.title,
                tag: tag,
                userID: userID,
                date: this.date.toISOString().slice(0, 10),
                sort: sort
            }
            this.$router.push({ path: "/", query: query})
        }
    }
}
</script>

<style>
.tab-content {
max-height: 0;
-webkit-transition: max-height .35s;
-o-transition: max-height .35s;
transition: max-height .35s;
}
/* :checked - resize to full height */
.tab input:checked ~ .tab-content {
max-height: 100vh;
}
/* Label formatting when open */
.tab input:checked + label{
/*@apply text-xl p-5 border-l-2 border-indigo-500 bg-gray-100 text-indigo*/
font-size: 1.25rem; /*.text-xl*/
padding: 1.25rem; /*.p-5*/
border-left-width: 2px; /*.border-l-2*/
border-color: #6574cd; /*.border-indigo*/
background-color: #f8fafc; /*.bg-gray-100 */
color: #6574cd; /*.text-indigo*/
}
/* Icon */
.tab label::after {
float:right;
right: 0;
top: 0;
display: block;
width: 1.5em;
height: 1.5em;
line-height: 1.5;
font-size: 1.25rem;
text-align: center;
-webkit-transition: all .35s;
-o-transition: all .35s;
transition: all .35s;
}
/* Icon formatting - closed */
.tab input[type=checkbox] + label::after {
content: "+";
font-weight:bold; /*.font-bold*/
border-width: 1px; /*.border*/
border-radius: 9999px; /*.rounded-full */
border-color: #b8c2cc; /*.border-grey*/
}
.tab input[type=radio] + label::after {
content: "\25BE";
font-weight:bold; /*.font-bold*/
border-width: 1px; /*.border*/
border-radius: 9999px; /*.rounded-full */
border-color: #b8c2cc; /*.border-grey*/
}
/* Icon formatting - open */
.tab input[type=checkbox]:checked + label::after {
transform: rotate(315deg);
background-color: #6574cd; /*.bg-indigo*/
color: #f8fafc; /*.text-grey-lightest*/
}
.tab input[type=radio]:checked + label::after {
transform: rotateX(180deg);
background-color: #6574cd; /*.bg-indigo*/
color: #f8fafc; /*.text-grey-lightest*/
}
</style>