import API, { graphqlOperation } from '@aws-amplify/api'
import Storage from '@aws-amplify/storage'
import { moduleFileExtensions } from '~/jest.config'

export async function setImgFile (obj) {
    if (obj.imgURL !== null && obj.imgURL !== 'null') {
        try {
            await Storage.get(obj.imgURL, {level: 'protected'})
                .then((res) => {
                    obj.imgPreview = res
                    obj.showPreviewImg = true
                })
                .catch((e) => {
                    console.log("Getting Image Failed: " + e)
                })
        } catch (e) {
            console.log("Getting Image Failed: " + e)
        } finally {
            return obj
        }
    }
}

export async function setImgFileUser (obj, identityId) {
    if (obj.imgURL !== null && obj.imgURL !== 'null' && identityId !== null) {
        try {
            await Storage.get(obj.imgURL, {
                level: 'protected',
                identityId: identityId
            })
                .then((res) => {
                    obj.imgPreview = res
                    obj.showPreviewImg = true
                })
                .catch((e) => {
                    console.log("Getting Image Failed: " + e)
                })
        } catch (e) {
            console.log("Getting Image Failed: " + e)
        } finally {
            return obj
        }
    }
}

export function getNow () {
    const date = new Date()
    const unixtimenow = Math.floor(date.getTime() / 1000)
    return unixtimenow
}

export function failed (e, message, overlay) {
    console.log(e)
    alert(message)
    overlay = false
}

export function resetImgURL (obj) {
    obj.showPreviewImg = false
    obj.imgURL = null
    obj.imgFile = null
}

export async function S3Upload (obj, id, overlay) {
    const imgExtension = obj.imgType.replace('image/', '')
    const key = 'icon-' + obj.name + '/' + id + '.' + imgExtension
    try {
        await Storage.put(key, obj.imgFile, {
            level: 'protected',
            contentType: obj.imgType
        })
        .then (result => {
            obj.imgURL = result.key
        })
        .catch(e => {
            failed(e, "アイコンのアップロードに失敗しました", overlay)
        })
    } catch (e) {
        failed(e, "アイコンのアップロードに失敗しました", overlay)
    }
}

export async function S3Remove (obj, overlay) {
    try {
        await Storage.remove(obj.imgURL, { level: 'protected' })
        .then(result => {
            obj.imgURL = null
        })
        .catch(e => {
            failed(e, "画像の削除に失敗しました", overlay)
        })
    } catch (e) {
        failed(e, "画像の削除に失敗しました", overlay)
    }
}

export function pad (num) {
    if (num < 10) {
        return '0' + num
    }
    return num
}

export async function getUserID (currentUserInfo) {
    let userID = null
    try {
        if ([null, undefined, {}].indexOf(currentUserInfo) !== -1) throw new Error("UserInfo is not found")
        const userByCognitoId = `
            query UserByCognitoId {
                userByCognitoID(
                    cognitoID: "${currentUserInfo.attributes.sub}",
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
        await API.graphql(graphqlOperation(userByCognitoId))
            .then(async (res) => {
                const items = res.data.userByCognitoID.items[0]
                if ([null, undefined, []].indexOf(items) !== -1) {
                    throw "Profile not found"
                }
                userID = items.id
            })
    } catch (e) {
        console.log("Profile not found: " + e)
    } finally {
        return userID
    }
}

export function toISO8601DateString (date) {
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
}