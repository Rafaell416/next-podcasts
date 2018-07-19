import 'isomorphic-fetch'
import Layout from '../Components/Layout'
import ChannelGrid from '../Components/ChannelGrid'

export default class extends React.Component {

  static async getInitialProps() {
    let req = await fetch('https://api.audioboom.com/channels/recommended')
    let { body: channels } = await req.json()
    return { channels }
  }

  render() {
    const { channels } = this.props
    return (
      <Layout title='Podcasts'>
        <ChannelGrid channels={ channels }/>
      </Layout>
    )
  }
}
