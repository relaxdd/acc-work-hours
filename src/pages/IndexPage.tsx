import { NavLink } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'

function IndexPage() {
  const { user, logout } = useAuth()

  return (
    <main className="pt-4">
      <div className="container">
        <h2 className="mb-3">Working Hours</h2>

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
              <li><NavLink to="/profile">Профиль</NavLink></li>
            </ul>
          ) : (
            <ul>
              <li><NavLink to="/auth">Авторизация</NavLink></li>
              <li><NavLink to="/restore">Восстановление доступа</NavLink></li>
            </ul>
          )}
        </nav>
      </div>
    </main>
  )
}

export default IndexPage