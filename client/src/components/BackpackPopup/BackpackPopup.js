import React from 'react'
import './BackpackPopup.scss'
import { useDispatch } from 'react-redux'
import { openBackpack } from '../../redux/actions/navAction'
import magImg from '../../assets/png/hero.png'
import human from '../../assets/png/human.png'
import elf from '../../assets/png/elf.png'
import gnome from '../../assets/png/gnome.png'

export default function BackpackPopup() {
  const dispatch = useDispatch()
  return (
    <div className='backpack'>
      {/* <h2 className="backpack__title">Backpack</h2> */}
      <div className="backpack__modal">
        <button className="backpack__btnClose" onClick={() => dispatch(openBackpack(false))}>close</button>
        <div className="backpack__heroes">
          <div className="backpack__hero">
            <img src={magImg} alt="" className="backpack__heroImg" />
            <span className="backpack__heroName">Олорин</span>
          </div>
          <div className="backpack__hero">
            <img src={human} alt="" className="backpack__heroImg" />
            <span className="backpack__heroName">Вольдемар</span>
          </div>
          <div className="backpack__hero">
            <img src={elf} alt="" className="backpack__heroImg" />
            <span className="backpack__heroName">Галадриэль</span>
          </div>
          <div className="backpack__hero">
            <img src={gnome} alt="" className="backpack__heroImg" />
            <span className="backpack__heroName">Торин</span>
          </div>
        </div>
      </div>
    </div>
  )
}
