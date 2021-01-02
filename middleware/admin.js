import { Auth, API, graphqlOperation } from 'aws-amplify'

export default async ({ params, redirect }) => {
    const userInfo = await Auth.currentUserInfo()

    if (!userInfo) {
      redirect('/signin')
    }

    const getAdmin = `
        query GetAdmin {
            getAdmin(id: "${userInfo.attributes.sub}") {
                id
        }
    `
    try {
        await API.graphql(graphqlOperation(getAdmin))
            .then((response) => {
                const item = response.data.getAdmin
                if ([null, undefined, ""].indexOf(item) !== -1) {
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