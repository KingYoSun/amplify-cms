import { Auth, API, graphqlOperation } from 'aws-amplify'

export default async ({ params, redirect }) => {
    const userInfo = await Auth.currentUserInfo()

    if (!userInfo) {
      redirect('/signin')
    }

    const adminByCognitoId = `
        query AdminByCognitoId {
            adminByCognitoID(
                userID: "${userInfo.attributes.sub}",
                limit: 1
            ) {
                items {
                    id
                    userID
                }
            }
        }
    `
    try {
        await API.graphql(graphqlOperation(adminByCognitoId))
            .then((response) => {
                const item = response.data.adminByCognitoID.items
                if ([null, undefined, ""].indexOf(item) !== -1 || item.length == 0) {
                    alert('無効なログイン情報です')
                    redirect('/')
                }
            })
            .catch((e) => {
                console.log(e)
                alert('ユーザーの認証に失敗しました')
                redirect('/')
            })
    } catch (e) {
        console.log(e)
        alert('ユーザの認証に失敗しました')
        redirect('/')
    }
}