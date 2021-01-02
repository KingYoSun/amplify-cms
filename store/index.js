export const state = () => {
    currentUserInfo: null
    isLoggedIn: false
    userID: null
    imgPreview: null
    showPreviewImg: false
    noticeCount: 0
    page: 0
    nextToken: null
    nextTokens: [null]
}

export const mutations = {
    login(state, user) {
        state.currentUserInfo = user
        state.isLoggedIn = true
    },
    logout(state) {
        state.currentUserInfo = null
        state.isLoggedIn = false
    },
    setImg(state, img) {
        state.imgPreview = img
        state.showPreviewImg = true
    },
    removeImg(state) {
        state.showPreviewImg = false
        state.imgPreview = null
    },
    setUserID(state, id) {
        state.userID = id
    },
    setNoticeCount(state) {
        state.noticeCount = 0
    },
    incrementNoticeCount(state) {
        state.noticeCount++
    },
    decrementNoticeCount(state) {
        state.noticeCount--
    },
    setupNextToken(state) {
        state.nextToken = null
        state.nextTokens = [null]
    },
    setupPage(state) {
        state.page = 0
    },
    setPage(state, num) {
        state.page = num
    },
    setNextToken(state, str) {
        state.nextToken = str
    },
    setNextTokens(state, arr) {
        state.nextTokens = arr
    }
}