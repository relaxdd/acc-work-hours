import { NavLink } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

function IndexPage() {
  const { user, logout } = useAuth()

  return (
    <div className="container">
      <h1>Working Hours | учет рабочих часов</h1>

      {user && (
        <p>
          Привет {user.login}, <a
          href="/logout"
          onClick={(e) => {
            e.preventDefault()
            logout()
          }}
        >Выйти</a>
        </p>
      )}

      <p>В будущем тут будет какой то текст с описанием того для чего нужен этот сайт, какие проблемы решает и тд, с
        кнопками авторизации, регистрации</p>

      <nav>
        {user ? (
          <ul>
            <li><NavLink to="/table">Таблица</NavLink></li>
          </ul>
        ) : (
          <ul>
            <li><NavLink to="/auth">Авторизация</NavLink></li>
          </ul>
        )}

        <ul>
          <li><NavLink to="/profile">Профиль</NavLink></li>
        </ul>
      </nav>
    </div>
  )
}

export default IndexPage