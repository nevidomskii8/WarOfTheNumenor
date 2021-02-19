import React, { useEffect,useState } from 'react'
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
import {selectedCreepInLocation} from '../../redux/actions/locationAction'

export default function Homepage() {
  const adminLogin = 'admin'
  const creepInLocation = useSelector(getSelectedCreep)
  const isBackpack = useSelector(isOpenBackpack)
  const dispatch = useDispatch()
  const hero = useSelector(getHero)
  const [logs, setLogs] = useState([]) // [[heroDmg,creepDmg], ...]
  const [fightResult, setFightResult] = useState('')
  const [heroHpBar, setHeroHpBar] = useState(100)
  const [creepHpBar, setCreepHpBar] = useState(100)

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
  }, [adminLogin])

  const handleStartNewFight = () => {
    dispatch(fetchHero(adminLogin))
    dispatch(selectedCreepInLocation(''))
    setFightResult('')
    setHeroHpBar(100)
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
