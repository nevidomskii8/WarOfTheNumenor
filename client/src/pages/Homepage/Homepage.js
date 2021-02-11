import React,{useEffect} from 'react'
import HeroPanel from '../../components/HeroPanel/HeroPanel'
import {useDispatch,useSelector} from 'react-redux'
import {fetchHero} from '../../redux/actions/heroAction'
import {getHero} from '../../redux/selectors/heroSelector'

export default function Homepage() {
  const adminLogin = 'admin'
  const dispatch = useDispatch()
  const hero = useSelector(getHero)

  useEffect(() => {
    dispatch(fetchHero(adminLogin))
  }, [])

  return (
    <div className='container'>
      <HeroPanel hero={hero}/>
    </div>
  )
}
