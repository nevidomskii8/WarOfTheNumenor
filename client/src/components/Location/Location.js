import React, { useState } from 'react'
import './Location.scss'
import woods from '../../assets/png/woods.png'
import woods2 from '../../assets/png/woods2.png'
import wolf from '../../assets/png/wolf.png'
import witch from '../../assets/png/witch.png'
import { useDispatch } from 'react-redux'
import { selectedCreepInLocation } from '../../redux/actions/locationAction'
import { getSelectedCreep } from '../../redux/selectors/locationSelector'
import { useSelector } from 'react-redux'
import getRandomInt from '../../helpers/getRandomInt'

export default function Location({ className,creepData }) {
  const [activeItem, setActiveItem] = useState('Охота')
  const [activeLvl, setActiveLvl] = useState('')
  const [activeLocation, setActiveLocation] = useState('')
  const selectedCreep = useSelector(getSelectedCreep)

  const creepsCount = getRandomInt(1,9);

  const dispatch = useDispatch()

  const handleChangeActiveItem = (item) => {
    setActiveItem(item)
    setActiveLvl('')
    dispatch(selectedCreepInLocation(''))
  }

  const handleChangeActiveLvl = (lvl) => {
    setActiveLvl(lvl)
    setActiveLocation('')
    dispatch(selectedCreepInLocation(''))
  }

  return (
    <div className={`location ${className}`}>
      {/* Охота, поход, рейд, пвп */}
      <ul className="location__nav">
        <li className={`location__navItem ${activeItem === 'Охота' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("Охота")}>
          Охота
        </li>
        <li className={`location__navItem ${activeItem === 'Поход' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("Поход")}>
          Поход
        </li>
        <li className={`location__navItem ${activeItem === 'Рейд' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("Рейд")}>
          Рейд (с 3 уровня)
        </li>
        <li className={`location__navItem ${activeItem === 'ПВП' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("ПВП")}>
          ПВП(с 4 уровня)
        </li>
      </ul>

      {/* слабый, обычный, средний... */}
      {
        activeItem === 'Охота' &&
        <div className='location__difficultyLvls'>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Слабый')}>
            <span>1-9</span>
            <span className={`location__difficultNumber ${activeLvl === 'Слабый' && 'location__difficultNumber--active'}`}>1</span>
            <span>Слабый</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Обычный')}>
            <span>10-99</span>
            <span className={`location__difficultNumber ${activeLvl === 'Обычный' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#CBFFB9' }}>2</span>
            <span>Обычный</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Средний')}>
            <span>100-999</span>
            <span className={`location__difficultNumber ${activeLvl === 'Средний' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#B2CDFF' }}>3</span>
            <span>Средний</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Сильный')}>
            <span>1к-9.99к</span>
            <span className={`location__difficultNumber ${activeLvl === 'Сильный' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#9584FF' }}>4</span>
            <span>Сильный</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Мощный')}>
            <span>10к-99.9к</span>
            <span className={`location__difficultNumber ${activeLvl === 'Мощный' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#F68CFF' }}>5</span>
            <span>Мощный</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Великий')}>
            <span>100к-999к</span>
            <span className={`location__difficultNumber ${activeLvl === 'Великий' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#FF4F4F', color: '#fff' }}>6</span>
            <span>Великий</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Эпический')}>
            <span>1м-9.99м</span>
            <span className={`location__difficultNumber ${activeLvl === 'Эпический' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#FF2929', color: '#fff' }}>7</span>
            <span>Эпический</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Невероятный')}>
            <span>10м-99.9м</span>
            <span className={`location__difficultNumber ${activeLvl === 'Невероятный' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#3F3F3F', color: '#fff' }}>8</span>
            <span>Невероятный</span>
          </div>
          <div className="location__difficultyItem" onClick={() => handleChangeActiveLvl('Легендарный')}>
            <span>100м-999м</span>
            <span className={`location__difficultNumber ${activeLvl === 'Легендарный' && 'location__difficultNumber--active'}`} style={{ backgroundColor: '#000', color: '#fff' }}>9</span>
            <span>Легендарный</span>
          </div>
        </div>
      }


      {/* Легкий лес1, легкий лес2 */}
      {
        activeLvl === 'Слабый' && !activeLocation &&
        <div className='location__itemsContainer' >
          <div className="location__item" onClick={() => setActiveLocation('Сказочная поляна')}>
            <img src={woods} alt="location" className="location__itemImg" />
          </div>
          <div className="location__item" onClick={() => setActiveLocation('Лесная поляна')}>
            <img src={woods2} alt="location" className="location__itemImg" />
          </div>
        </div>
      }

      {/* крипы */}
      {activeLocation &&
        <div className='creeps'>
          <div className='creeps__btns'>
            <button type='button' onClick={() => setActiveLocation('')}>Назад</button>
            <h3>{activeLocation}</h3>
            <button type='button'>Обновить</button>
          </div>
          {
            activeLocation === 'Сказочная поляна' &&
            <div className='creeps__items'>
              <div className="creeps__item" onClick={() => dispatch(selectedCreepInLocation('Волк'))}>
                <img src={wolf} alt="волк" />
              </div>
              {/* <div className="creeps__item" onClick={() => dispatch(selectedCreepInLocation('Ведьма'))}> Ведьма
                <img src={witch} alt="ведьма" />
              </div> */}
            </div>

          }
        </div>
      }
      {
        selectedCreep &&
        <div className='fightArea__infoContainer'>
          <h3>Кол-во: {creepsCount}</h3>
          <div>Усиление: {creepData.buff}</div>
          <div>Уворот: {creepData.evasion}%</div>
          {creepData.crit && <div>Шанс крита: {creepData.crit.chance}%</div>}
          {creepData.crit && <div>Урон крита: {creepData.crit.dmg}%</div>}
          <div>Увеличение добычи: 0%</div>
          {creepData.dmg && <div>Атака: {creepData.dmg.min} - {creepData.dmg.max}</div>}
          {creepData && <div>Здоровье: {creepData.hp * creepsCount}</div>}
        </div>
      }

    </div>
  )
}
