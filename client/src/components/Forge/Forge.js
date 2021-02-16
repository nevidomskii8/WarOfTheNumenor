import React from 'react'
import './Forge.scss'
export default function Forge() {

  return (
    <>
      <div className="forge">
        <div className="forge__title">Кузница</div>
        <div className="forge__craft">
          <div className="crystals--counter">
            <img src="../../assets/png/red_crystals.png " />: 10
              <div className="action">Создать вещь  <img src="../../assets/png/inquiry_character.png"></img></div>
          </div>
          <div className="list__items">
            <ul className="">
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Обычное<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Улучшенное<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Заколдованное<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Мощное<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Эпическое<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Мифическое<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Легендарное<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Легендарное<img src="../../assets/png/inquiry_character.png" /></div></li>
              <li><img src="../../assets/png/red_crystals.png" /><div className="enhancement__item">Легендарное<img src="../../assets/png/inquiry_character.png" /></div></li>
            </ul>
          </div>
          <button>Создать</button>
          <div className="row">
            <img src="../../assets/png/ring_snake.png"></img>
            <img src="../../assets/png/ring_snake.png"></img>
            <img src="../../assets/png/ring_snake.png"></img>
          </div>
          <div className="row__button">
            <button className="btn-green">Забрать</button>
            <button className="btn-green">Забрать всё</button>
            <button className="btn-red">Выбросить</button>
            <button className="btn-red">Выбросить всё</button>
          </div>
        </div>
        <div className="sort__out">
          <div className="sort-out__header">Разобрать вещь</div>
          <img src="../../assets/png/ring_snake.png"></img>
          <button className="btn-red">Разобрать</button>
          <div className="description">Получите: 5к</div>

          <div className="merge">Объединить вещи</div>
          <img src="../../assets/png/ring_snake.png" />
          <img src="../../assets/png/ring_snake.png" />
          <div className="pointer">-------></div>
          <div className="item"></div>
        </div>
        <div className="inventory">
          <div className="inventory__header">Инвентарь кузнеца</div>
          <div className="inventory__list">
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
            <div className="inventory__item"></div>
          </div>
        </div>
      </div>
    </>
  )
}
