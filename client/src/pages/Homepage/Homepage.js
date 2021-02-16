import React, { useEffect } from 'react'
import HeroPanel from '../../components/HeroPanel/HeroPanel'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHero } from '../../redux/actions/heroAction'
import { getHero } from '../../redux/selectors/heroSelector'
import FightArea from '../../components/FightArea/FightArea'
import './Homepage.scss'
import { fetchCreep } from '../../redux/actions/creepAction'
import { getCreep } from '../../redux/selectors/creepSelector'
import NavPanel from '../../components/NavPanel/NavPanel'
import Location from '../../components/Location/Location'
import { getSelectedCreep, getSelectedLvl } from '../../redux/selectors/locationSelector'
import getCountByLvl from '../../helpers/getCountByLvl'

export default function Homepage() {
  const adminLogin = 'admin'
  const creepsCount = getCountByLvl('Слабый')
  const selectedCreepInLocation = useSelector(getSelectedCreep)

  const dispatch = useDispatch()
  const hero = useSelector(getHero)
  const creep = useSelector(getCreep)
  

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
    dispatch(fetchCreep(selectedCreepInLocation))
  }, [selectedCreepInLocation])

  return (
    <div className='home'>
      <div className="home__figthArea">
        <HeroPanel hero={hero} className='home__heroPanel'/>
        <FightArea heroData={hero} creepData={creep} creepsCount={creepsCount} />
        <Location className='home__location' creepData={creep} creepsCount={creepsCount}/>
      </div>
      <div className='home__nav'>
        <NavPanel />
      </div>

    </div>
  )
}
