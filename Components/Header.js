import Link from 'next/link'
const Header = () => (
  <div>
      <header>
        <Link href='/'>
          <a>Next Podcasts</a>
        </Link>
      </header>
    <style jsx>{`
      header {
        color: #fff;
        background: #8756ca;
        padding: 15px;
        text-align: center;
      }

      header a {
        color: #fff;
        text-decoration: none;
      }
    `}</style>
  </div>
)

export default Header
