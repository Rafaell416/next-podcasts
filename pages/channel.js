import { Component } from 'react'
import Layout from '../Components/Layout'
import SeriesList from '../Components/SeriesList'
import ClipsListWithClick from '../Components/ClipsListWithClick'
import Error from './_error'
import ClipPlayer from '../Components/ClipPlayer'

export default class extends Component {

  constructor(props){
    super(props)
    this.state = {
      openPodcast: null
    }
  }

  static async getInitialProps({ query, res }) {
    try {
      let idChannel = query.id

      let [reqChannel, reqSeries, reqAudios] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`)
      ])

      if (reqChannel.status >= 400) {
        res.statusCode = reqChannel.status
        return { channel: null, audioClips: null, series: null, statusCode: reqChannel.status }
      }

      let dataChannel = await reqChannel.json()
      let channel = dataChannel.body.channel

      let dataAudios = await reqAudios.json()
      let audioClips = dataAudios.body.audio_clips

      let dataSeries = await reqSeries.json()
      let series = dataSeries.body.channels

      return { channel, audioClips, series, statusCode: 200 }
    } catch (e) {
      res.statusCode = 503
      return { channel: null, audioClips: null, series: null, statusCode: 503 }
    }
  }

  _openPodcast = (event, podcast) => {
    event.preventDefault()
    this.setState({ openPodcast: podcast })
  }

  _closePodcast = (event) => {
    event.preventDefault()
    this.setState({
      openPodcast: null
    })
  }

  render() {
    const { channel, audioClips, series, statusCode } = this.props
    const { openPodcast } = this.state

    if (statusCode !== 200) {
      return <Error statusCode={ statusCode }/>
    }

    return (
      <Layout title={channel.title}>
        <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />
        { openPodcast && <ClipPlayer clip={ openPodcast } onClose={ this._closePodcast } /> }
        <h1>{ channel.title }</h1>

        { series.length > 0 && <SeriesList series={ series }/> }

        <h2>Ultimos Podcasts</h2>
        <ClipsListWithClick clips={ audioClips } onClickPodcast={this._openPodcast}/>

        <style jsx>{`
          .banner {
            width: 100%;
            padding-bottom: 25%;
            background-position: 50% 50%;
            background-size: cover;
            background-color: #aaa;
          }
          h1 {
            font-weight: 600;
            padding: 15px;
          }
          h2 {
            padding: 5px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }
        `}</style>
      </Layout>
    )
  }
}
