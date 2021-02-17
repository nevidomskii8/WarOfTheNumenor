import React, { useEffect } from 'react'
import HeroPanel from '../../components/HeroPanel/HeroPanel'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHero } from '../../redux/actions/heroAction'
import { getHero } from '../../redux/selectors/heroSelector'
import FightArea from '../../components/FightArea/FightArea'
import './Homepage.scss'
import NavPanel from '../../components/NavPanel/NavPanel'
import Location from '../../components/Location/Location'
import { getSelectedCreep } from '../../redux/selectors/locationSelector'
import BackpackPopup from '../../components/BackpackPopup/BackpackPopup'
import { isOpenBackpack } from '../../redux/selectors/navSelector'


export default function Homepage() {
  const adminLogin = 'admin'
  const selectedCreepInLocation = useSelector(getSelectedCreep)
  const isBackpack = useSelector(isOpenBackpack)
  const dispatch = useDispatch()
  const hero = useSelector(getHero)

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
  }, [adminLogin])

  return (
    <div className='home'>
      {isBackpack && <BackpackPopup />}
      <div className="home__figthArea">
        <HeroPanel hero={hero} className='home__heroPanel' />
        <FightArea heroData={hero} creepData={selectedCreepInLocation} />
        <Location className='home__location' creepData={selectedCreepInLocation}/>
      </div>
      <div className='home__nav'>
        <NavPanel />
      </div>
    </div>
  )
}
