<template>
    <div class="container pt-24 pb-10">
        <div class="w-full">
            <editor v-model="editorText" :options="editorOptions" height="500px" previewStyle="vertical" />
            <viewer :value="editorText" />
        </div>
    </div>
</template>

<script>
import { Editor, Viewer } from '@toast-ui/vue-editor';

export default {
    components: {
        Editor,
        Viewer
    },
    data () {
        return {
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
    }
}
</script>