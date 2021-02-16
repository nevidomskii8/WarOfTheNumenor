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
import { getSelectedCreep } from '../../redux/selectors/locationSelector'

export default function Homepage() {
  const adminLogin = 'admin'
  const creepName = useSelector(getSelectedCreep)
  const creepsCount = 3
  const selectedCreepInLocation = useSelector(getSelectedCreep)

  const dispatch = useDispatch()
  const hero = useSelector(getHero)
  const creep = useSelector(getCreep)

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
    dispatch(fetchCreep(creepName))
  }, [creepName])

  return (
    <div className='home'>
      <div className="home__figthArea">
        <HeroPanel hero={hero} className='home__heroPanel' />
        <FightArea heroData={hero} creepData={creep} creepsCount={creepsCount} />
        <Location className='home__location' creepData={creep} />
      </div>
      <div className='home__nav'>
        <NavPanel />
      </div>
    </div>
  )
}
