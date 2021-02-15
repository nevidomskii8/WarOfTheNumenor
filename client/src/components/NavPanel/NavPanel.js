import React from 'react'
import './NavPanel.scss'

export default function NavPanel() {
  return (
    <ul className='nav'>
      <li className="nav__item nav__item--backpack">
        <span className="nav__text">Сундук добычи</span>
      </li>
      <li className="nav__item nav__item--altar">
        <span className="nav__text">Алтарь Эссенций</span></li>
      <li className="nav__item  nav__item--forge">
        <span className="nav__text">Кузница</span></li>
      <li className="nav__item  nav__item--pvp">
        <span className="nav__text">PVP звания и награды</span></li>
      <li className="nav__item  nav__item--barracks">
        <span className="nav__text">Казарма</span></li>
      <li className="nav__item  nav__item--shop">
        <span className="nav__text">Магазин</span></li>
    </ul>
  )
}
