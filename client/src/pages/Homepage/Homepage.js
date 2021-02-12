import React,{useEffect} from 'react'
import HeroPanel from '../../components/HeroPanel/HeroPanel'
import {useDispatch,useSelector} from 'react-redux'
import {fetchHero} from '../../redux/actions/heroAction'
import {getHero} from '../../redux/selectors/heroSelector'
import FightArea from '../../components/FightArea/FightArea'
import './Homepage.scss'
import {fetchCreep} from '../../redux/actions/creepAction'
import {getCreep} from '../../redux/selectors/creepSelector'

export default function Homepage() {
  const adminLogin = 'admin'
  const creepName = 'Волк'
  const creepsCount = 3
  
  const dispatch = useDispatch()
  const hero = useSelector(getHero)
  const creep = useSelector(getCreep)

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
    dispatch(fetchCreep(creepName))
  }, [])

  return (
    <div className='home'>
      <HeroPanel hero={hero}/>
      <FightArea heroData={hero} creepData={creep} creepsCount={creepsCount}/>
    </div>
  )
}
