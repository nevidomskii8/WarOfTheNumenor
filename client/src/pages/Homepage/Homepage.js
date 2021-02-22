import React, { useEffect,useState } from 'react'
import HeroPanel from '../../components/HeroPanel/HeroPanel'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHero,saveHeroData } from '../../redux/actions/heroAction'
import { getHero } from '../../redux/selectors/heroSelector'
import FightArea from '../../components/FightArea/FightArea'
import './Homepage.scss'
import NavPanel from '../../components/NavPanel/NavPanel'
import Location from '../../components/Location/Location'
import { getSelectedCreep } from '../../redux/selectors/locationSelector'
import BackpackPopup from '../../components/BackpackPopup/BackpackPopup'
import { isOpenBackpack } from '../../redux/selectors/navSelector'
import {selectedCreepInLocation} from '../../redux/actions/locationAction'
import axios from 'axios'
import config from '../../config/default.json'

export default function Homepage() {
  const dispatch = useDispatch()
  const adminLogin = 'admin'

  const creepInLocation = useSelector(getSelectedCreep)
  const isBackpack = useSelector(isOpenBackpack)
 
  const hero = useSelector(getHero)
  const [logs, setLogs] = useState([]) // [[heroDmg,creepDmg], ...]
  const [fightResult, setFightResult] = useState('')
  const [heroHpBar, setHeroHpBar] = useState()
  const [creepHpBar, setCreepHpBar] = useState(100)

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
  }, [adminLogin])

  useEffect(() => {
    hero && setHeroHpBar(((hero.currentDef / hero.def) * 100))
  }, [hero])


  
  const handleStartNewFight = () => {
    dispatch(fetchHero(adminLogin))
    dispatch(selectedCreepInLocation(''))
    setFightResult('')
    setHeroHpBar((hero.currentDef / hero.def) * 100)
    setCreepHpBar(100)
    setLogs([])
  }

  return (
    <div className='home'>
      {isBackpack && <BackpackPopup />}
      <div className="home__figthArea">
        <HeroPanel hero={hero} className='home__heroPanel' />
        <FightArea heroData={hero} creepData={creepInLocation} creepHpBar={creepHpBar} setCreepHpBar={setCreepHpBar} heroHpBar={heroHpBar} setHeroHpBar={setHeroHpBar} logs={logs} fightResult={fightResult} setFightResult={setFightResult} setLogs={setLogs} handleStartNewFight={handleStartNewFight}/>
        <Location className='home__location' creepData={creepInLocation} handleStartNewFight={handleStartNewFight} />
      </div>
      <div className='home__nav'>
        <NavPanel />
      </div>
    </div>
  )
}
