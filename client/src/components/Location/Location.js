import React from 'react'
import './Location.scss'
import config from '../../config/default.json'
import { useDispatch } from 'react-redux'
import { selectedCreepInLocation, selectLocationType, selectLocLvl, selectLocation, fetchLocation, fetchCreepsInLocation } from '../../redux/actions/locationAction'
import { getSelectedType, getSelectedLvl, getSelectedCreep, getSelectedLoc, getDataLocations, getCreeps } from '../../redux/selectors/locationSelector'
import { useSelector } from 'react-redux'
import getCountByLvl from '../../helpers/getCountByLvl'
import {mathCount} from '../../helpers/mathCount'

export default function Location({ className, creepData }) {

  const dispatch = useDispatch()
  const activeItemType = useSelector(getSelectedType) // type
  const activeLvl = useSelector(getSelectedLvl)       // lvl
  const activeLocation = useSelector(getSelectedLoc)  // loca
  const creeps = useSelector(getCreeps)

  const locations = useSelector(getDataLocations)     //location arr 

  const handleChangeActiveItem = (item) => {
    dispatch(selectLocationType(item))
    dispatch(selectLocLvl(''))
    dispatch(selectedCreepInLocation(''))
  }

  const handleChangeActiveLvl = (lvl) => {
    dispatch(fetchLocation(lvl))
    dispatch(selectLocLvl(lvl))
    dispatch(selectLocation(''))
    dispatch(selectedCreepInLocation(''))
  }

  const handleChangeLocation = (location, lvl) => {
    dispatch(selectLocation(location))

    if (lvl) {
      const minMax = getCountByLvl(lvl)
      dispatch(fetchCreepsInLocation([location.creeps, minMax]))
    }
  }

  const handleSelectCreep = (creep) => {
    dispatch(selectedCreepInLocation(creep))
  }

  const handleUpdateCreeps = () => {
    dispatch(selectedCreepInLocation(''))
    handleChangeLocation(activeLocation, activeLvl)
  }

  const handleBackInLocation = () => {
    handleChangeLocation('')
    dispatch(selectedCreepInLocation(''))
  }


  return (
    <div className={`location ${className}`}>
      {/* Охота, поход, рейд, пвп */}
      <ul className="location__nav">
        <li className={`location__navItem ${activeItemType === 'Охота' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("Охота")}>
          Охота
        </li>
        <li className={`location__navItem ${activeItemType === 'Поход' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("Поход")}>
          Поход
        </li>
        <li className={`location__navItem ${activeItemType === 'Рейд' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("Рейд")}>
          Рейд (с 3 уровня)
        </li>
        <li className={`location__navItem ${activeItemType === 'ПВП' && 'location__navItem--active'}`} onClick={() => handleChangeActiveItem("ПВП")}>
          ПВП(с 4 уровня)
        </li>
      </ul>

      {/* слабый, обычный, средний... */}
      {
        activeItemType === 'Охота' &&
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

      {/* Локации */}
      {
        activeLvl && !activeLocation &&
        <div className='location__itemsContainer' >
          {locations.map(loc => (
            <div className="location__item" onClick={() => handleChangeLocation(loc, activeLvl)}>
              <img src={`${config.serverUrl}/api/images/${loc.img}`} alt={loc.name} className="location__itemImg" />
            </div>
          ))}
        </div>
      }

      {/* крипы */}
      {activeLocation &&
        <div className='creeps'>
          <div className='creeps__btns'>
            <button type='button' onClick={() => handleBackInLocation()}>Назад</button>
            <h3>{activeLocation.name}</h3>
            <button type='button' onClick={() => handleUpdateCreeps()}>Обновить</button>
          </div>
          <div className='creeps__items'>
            {
              creeps.map((creep, i) => (
                <div key={i} className="creeps__item" onClick={() => handleSelectCreep(creep)}>
                  <img className='creeps__img' src={`${config.serverUrl}/api/images/${creep.img}`} alt={creep.name} />
                  <span className='creeps__count'>{mathCount(creep.count)}</span>
                </div>
              ))
            }
          </div>
        </div>
      }

      {
        creepData.name && activeLocation &&
        <div className='creeps__infoContainer'>
          <div className='creeps__info'>
            <h3>Кол-во: {mathCount(creepData.count)}</h3>
            <div>Усиление: {creepData.buff}%</div>
            <div>Уворот: {creepData.evasion}%</div>
            {creepData.crit && <div>Шанс крита: {creepData.crit.chance}%</div>}
            {creepData.crit && <div>Урон крита: {creepData.crit.dmg}%</div>}
            <div>Увеличение добычи: 0%</div>
            {creepData.dmg && <div>Атака: {mathCount(creepData.dmg.min * creepData.count)} - {mathCount(creepData.dmg.max * creepData.count)}</div>}
            {creepData && <div>Здоровье: {mathCount(creepData.hp * creepData.count)}</div>}
          </div>
          <div className="creeps__info">
            <h3>Возможный лут</h3>

            {
              creepData.loot.map(item => (
                <div className='creeps__lootItem'><img className='creeps__lootImg' src={`${config.serverUrl}/api/images/${item.img}`} alt={item.itemName} />{item.itemName} Шанс: {item.chance}</div>
              ))
            }
          </div>
        </div>
      }

    </div>
  )
}
