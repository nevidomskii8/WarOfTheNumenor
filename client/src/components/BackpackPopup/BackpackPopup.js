import React, { useState, useEffect } from 'react'
import './BackpackPopup.scss'
import { useDispatch, useSelector } from 'react-redux'
import { openBackpack } from '../../redux/actions/navAction'
import magImg from '../../assets/png/hero.png'
import human from '../../assets/png/human.png'
import elf from '../../assets/png/elf.png'
import gnome from '../../assets/png/gnome.png'
import { getBackpack } from '../../redux/selectors/heroSelector'
import config from '../../config/default.json'
import BackpackItem from '../BackpackItem/BackpackItem'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import axios from 'axios'
import { getHero } from '../../redux/selectors/heroSelector'
import { fetchHero } from '../../redux/actions/heroAction'

export default function BackpackPopup() {
  const dispatch = useDispatch()
  const [hero, setHero] = useState(useSelector(getHero))
  const backpack = useSelector(getBackpack)
  const [activeHero, setActiveHero] = useState('mag')
  const [items, setItems] = useState(backpack.items)
  const [equipment, setEquipment] = useState(backpack.equipment)
  const [currentItem, setCurrentItem] = useState(null)

  const BackpackSlots = () => {
    const slots = []
    for (let i = 0; i < backpack.size; i++) {
      slots.push(<div className='backpack__slot'>{i}</div>)
    }
    return slots
  }

  const dragStartHandler = (e, item) => {
    setCurrentItem(item)
    e.target.style.background = 'black'
  }

  const dragEndHandler = (e) => {
    e.target.style.background = 'none'
  }

  const dragOverHandler = (e) => {
    e.preventDefault()
    e.target.style.background = 'black'
  }

  const dropHandler = (e, item) => {
    e.preventDefault()
    setItems(items.map(it => {
      if (it._id === item._id) {
        return { ...it, order: currentItem.order }
      }
      if (it._id === currentItem._id) {
        return { ...it, order: item.order }
      }
      return it
    }))
    e.target.style.background = 'none'
  }

  const handleClickItemInventory = (item) => {
    if (item.type === 'essense') return
    const itemDmg = item.stats.dmg
    const heroEquip = {
      ...equipment[activeHero],
      [item.type]: item
    }
    if (itemDmg) {
      setHero({ ...hero, attack: { minDmg: hero.attack.minDmg + itemDmg, maxDmg: hero.attack.maxDmg + itemDmg } })
    }
    setEquipment({ ...equipment, [activeHero]: heroEquip })
    setItems(items.filter(it => it.itemName !== item.itemName))
  }

  const handleRemoveHeroItem = (type) => {
    const item = equipment[activeHero][type]
    if (!item) return

    const itemDmg = item.stats && item.stats.dmg


    if (itemDmg) {
      setHero({ ...hero, attack: { minDmg: hero.attack.minDmg - itemDmg, maxDmg: hero.attack.maxDmg - itemDmg } })
    }

    const heroEquip = {
      ...equipment[activeHero],
      [type]: ''
    }

    setItems([...items, item])
    setEquipment({ ...equipment, [activeHero]: heroEquip })
  }

  const handleSaveEquip = async () => {
    const backpackData = {
      size: backpack.size,
      items: items,
      equipment: equipment,
    }
    const heroData = { ...hero, backpack: backpackData }

    await axios.put(`${config.serverUrl}/api/heroes/equip/${hero._id}`, heroData)
    dispatch(openBackpack(false))
    dispatch(fetchHero(hero.login))
  }
  return (
    <div className='backpack'>
      <div className="backpack__modal">
        <button className="backpack__btnClose" onClick={() => handleSaveEquip()}></button>
        <div className="backpack__container">
          <div className="backpack__column">
            <div className="backpack__heroes">
              <div className={`backpack__hero ${activeHero === 'mag' && 'backpack__hero--active'}`} onClick={() => setActiveHero('mag')}>
                <img src={magImg} alt="" className="backpack__heroImg" />
                <span className="backpack__heroName">Олорин</span>
              </div>
              <div className={`backpack__hero ${activeHero === 'human' && 'backpack__hero--active'}`} onClick={() => setActiveHero('human')}>
                <img src={human} alt="" className="backpack__heroImg" />
                <span className="backpack__heroName">Вольдемар</span>
              </div>
              <div className={`backpack__hero ${activeHero === 'elf' && 'backpack__hero--active'}`} onClick={() => setActiveHero('elf')}>
                <img src={elf} alt="" className="backpack__heroImg" />
                <span className="backpack__heroName">Галадриэль</span>
              </div>
              <div className={`backpack__hero ${activeHero === 'gnome' && 'backpack__hero--active'}`} onClick={() => setActiveHero('gnome')}>
                <img src={gnome} alt="" className="backpack__heroImg" />
                <span className="backpack__heroName">Торин</span>
              </div>
            </div>

            {/* Инвентарь мага */}
            {activeHero === 'mag' &&
              <div className="backpack__heroItems">
                <div className="backpack__heroItemContainer backpack__heroItemContainer--helm" onClick={() => handleRemoveHeroItem('helm')}>
                  <span>Шлем</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].helm && equipment[activeHero].helm.img && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].helm.img}`} alt={equipment[activeHero].helm.itemName} />}
                    {
                      equipment[activeHero].helm &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].helm.stats.dmg && <div>Урон: {equipment[activeHero].helm.stats.dmg}</div>}
                        {equipment[activeHero].helm.stats.def && <div>Защита: {equipment[activeHero].helm.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--weapon" onClick={() => handleRemoveHeroItem('weapon')}>
                  <span>Оружие</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].weapon && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].weapon.img}`} alt={equipment[activeHero].weapon.itemName} />}
                    {
                      equipment[activeHero].weapon &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].weapon.stats.dmg && <div>Урон: {equipment[activeHero].weapon.stats.dmg}</div>}
                        {equipment[activeHero].weapon.stats.def && <div>Защита: {equipment[activeHero].weapon.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--gloves" onClick={() => handleRemoveHeroItem('gloves')}>
                  <span>Перчатки</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].gloves && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].gloves.img}`} alt={equipment[activeHero].gloves.itemName} />}
                    {
                      equipment[activeHero].gloves &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].gloves.stats.dmg && <div>Урон: {equipment[activeHero].gloves.stats.dmg}</div>}
                        {equipment[activeHero].gloves.stats.def && <div>Защита: {equipment[activeHero].gloves.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--cuirass" onClick={() => handleRemoveHeroItem('cuirass')}>
                  <span>Кираса</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].cuirass && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].cuirass.img}`} alt={equipment[activeHero].cuirass.itemName} />}
                    {
                      equipment[activeHero].cuirass &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].cuirass.stats.dmg && <div>Урон: {equipment[activeHero].cuirass.stats.dmg}</div>}
                        {equipment[activeHero].cuirass.stats.def && <div>Защита: {equipment[activeHero].cuirass.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--ring" onClick={() => handleRemoveHeroItem('ring')}>
                  <span>Кольцо</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].ring && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].ring.img}`} alt={equipment[activeHero].ring.itemName} />}
                    {
                      equipment[activeHero].ring &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].ring.stats.dmg && <div>Урон: {equipment[activeHero].ring.stats.dmg}</div>}
                        {equipment[activeHero].ring.stats.def && <div>Защита: {equipment[activeHero].ring.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--boots" onClick={() => handleRemoveHeroItem('boots')}>
                  <span>Сапоги</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].boots && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].boots.img}`} alt={equipment[activeHero].boots.itemName} />}
                    {
                      equipment[activeHero].boots &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].boots.stats.dmg && <div>Урон: {equipment[activeHero].boots.stats.dmg}</div>}
                        {equipment[activeHero].boots.stats.def && <div>Защита: {equipment[activeHero].boots.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroSvg">
                  <svg width="318" height="637" viewBox="0 0 318 637" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M296.874 588.408C295.991 586.188 295.109 583.968 294.404 582.198C290.098 582.977 286.111 583.874 282.074 584.383C277.523 584.956 275.093 586.718 276.06 591.82C276.845 595.952 276.388 600.437 271.955 602.068C260.42 606.311 258.388 615.444 258.088 626.079C257.894 632.961 253.184 637.337 246.32 636.98C236.643 636.475 226.971 635.542 217.35 634.354C211.221 633.596 210.215 628.261 209.164 623.406C208.322 619.518 207.675 615.58 207.117 611.64C206.577 607.827 203.922 606.782 200.935 607.589C191.306 610.192 181.722 612.997 172.236 616.076C160.912 619.752 149.922 624.67 137.477 622.614C128.186 621.079 124.972 616.673 126.412 605.831C127.131 600.407 126.865 597.849 120.798 598.208C115.026 598.551 109.231 598.825 103.455 598.7C101.122 598.65 98.6819 597.737 96.5212 596.726C92.4457 594.818 88.7335 591.945 84.5107 590.593C78.9792 588.821 77.0695 585.175 76.8352 579.996C76.1071 563.904 75.4226 547.808 74.7012 531.715C74.4585 526.294 73.4861 525.8 64.1502 526.993C64.1502 535.851 64.0983 544.886 64.1619 553.921C64.2841 571.767 64.3912 589.613 64.6808 607.456C64.7628 612.561 65.3084 617.673 65.9009 622.751C66.4131 627.146 64.2841 629.62 60.4949 630.98C56.4931 632.418 53.5959 630.325 52.0712 627.065C50.5816 623.879 49.2962 620.227 49.2995 616.78C49.3096 603.887 48.1815 590.653 50.6787 578.186C53.7834 562.689 50.4561 547.497 51.7799 532.234C51.9557 530.201 51.4653 528.111 51.3013 526.241C50.7322 525.866 50.4443 525.522 50.1247 525.489C38.9477 524.322 35.6321 519.829 37.4481 508.259C38.6163 500.812 37.7694 499.681 30.1206 498.464C24.5037 497.57 23.1313 495.59 23.7372 489.902C24.2376 485.208 24.4535 480.486 24.8552 474.959C18.8885 474.241 13.1176 473.604 7.36508 472.837C-0.615101 471.772 -1.12056 470.246 1.22429 462.966C7.89062 442.276 14.0046 421.408 20.6057 400.697C21.8894 396.668 23.8058 392.556 26.4368 389.293C34.5258 379.267 43.1872 369.704 51.4134 359.784C52.8712 358.027 54.0963 355.428 54.0963 353.217C54.1047 331.431 52.7959 309.75 50.1447 288.074C48.6367 275.748 49.82 263.097 49.7196 250.592C49.6376 240.54 49.4234 230.492 49.3146 220.441C49.2661 215.961 49.097 211.59 43.9102 209.342C43.2608 210.647 42.752 212.06 41.9118 213.231C41.321 214.056 40.3453 214.726 39.3963 215.107C39.0414 215.249 37.7393 214.27 37.7945 213.984C38.0289 212.787 38.4339 211.535 39.1168 210.535C40.1076 209.086 41.7043 207.998 42.4993 206.475C45.6944 200.352 40.5846 199.141 36.6832 197.319C37.3811 196.505 37.987 195.798 38.5929 195.091C36.8757 194.662 35.1601 194.23 32.3534 193.527C36.5276 191.98 39.2272 186.986 43.7194 192.985C44.0625 191.678 44.737 190.581 44.5144 189.717C42.1997 180.739 41.0432 172.703 46.6517 163.508C49.7698 158.396 47.8284 149.366 46.3471 142.494C44.2232 132.64 42.6365 122.987 44.486 112.985C44.5897 112.427 44.64 111.852 44.6467 111.284C44.7487 102.473 44.8877 93.6616 44.8927 84.8506C44.8944 83.169 44.7588 81.2817 44.0123 79.8375C40.1444 72.3587 41.1737 65.562 45.1571 58.2855C46.4576 55.9118 45.3663 51.0842 43.686 48.4531C39.182 41.3989 38.8373 36.9959 44.5546 30.5335C47.6844 26.9964 48.9932 23.7836 45.8199 19.5945C45.0383 18.5632 44.7839 16.6609 45.1036 15.3587C46.2266 10.8103 47.7062 6.34374 49.6008 0C52.7591 5.62662 55.0286 9.78222 57.4086 13.8726C59.3049 17.1323 62.0548 20.0877 63.1544 23.578C65.1009 29.7596 65.9662 36.2738 67.5043 42.5958C68.7328 47.6424 70.5186 52.5602 71.5915 57.6336C72.0618 59.8551 72.2961 63.2585 71.0341 64.5072C66.7261 68.7681 67.6231 73.4252 68.7077 78.2812C70.4718 86.1695 69.814 93.466 65.5595 100.717C61.9326 106.897 58.7057 113.049 61.2899 121.409C63.2297 127.685 61.4037 135.084 61.5075 141.979C61.6079 148.577 61.8891 155.185 62.4648 161.754C62.5602 162.843 64.4214 164.262 65.7352 164.68C76.2661 168.03 77.759 171.731 71.8091 181.145C70.1672 183.743 70.0818 185.483 71.8861 188.238C73.5296 190.75 73.8811 194.215 74.3916 197.328C75.1247 201.786 75.1113 206.4 76.2142 210.746C76.5824 212.197 79.3976 213.967 81.1014 213.975C87.346 214.004 93.7847 212.21 99.7966 213.215C109.946 214.91 113.782 210.477 116.738 201.605C118.666 195.82 123.625 191.036 127.257 185.826C128.01 184.746 129.096 183.858 129.682 182.706C131.953 178.231 133.589 174.699 131.609 168.491C128.383 158.379 130.069 147.205 133.652 136.742C136.348 128.871 138.74 120.89 141.055 112.897C142.796 106.887 138.007 99.1645 130.402 95.141C125.699 92.6536 120.674 90.5859 116.443 87.455C113.196 85.0529 108.115 80.1032 108.841 78.3581C110.599 74.1323 114.691 69.8429 118.91 67.9173C125.009 65.134 131.983 63.9087 138.717 62.9793C143.925 62.2605 146.069 59.4807 147.868 55.1044C150.13 49.5982 152.926 44.2875 155.832 39.0821C156.788 37.372 158.789 36.2354 160.338 34.8663C163.663 31.9243 167.971 29.5874 170.172 25.9667C179.762 10.1884 194.479 6.68641 211.374 7.20127C216.995 7.37344 222.646 6.63794 229.003 6.27687C227.49 9.34426 225.888 13.6102 223.429 17.3078C220.726 21.3698 217.399 25.0624 214.048 28.6396C208.994 34.0355 209.626 37.3921 216.517 40.533C217.963 41.1917 219.218 42.2698 221.459 43.7475C217.817 46.8216 214.83 49.3457 212.744 51.1059C215.195 59.3252 217.258 66.249 219.586 74.0604C220.232 74.0955 221.834 74.2459 223.436 74.2643C234.703 74.3914 244.243 78.4283 251.521 87.0922C256.128 92.5784 255.482 95.92 249.191 99.3551C246.772 100.676 243.857 101.164 241.113 101.797C236.429 102.877 231.702 103.771 226.992 104.744C226.994 105.445 226.998 106.147 226.999 106.847C229.778 107.385 232.584 108.494 235.331 108.362C246.99 107.798 257.308 111.994 266.682 117.978C270.607 120.484 272.813 125.771 275.612 129.922C279.592 135.824 283.64 141.704 287.225 147.847C293.216 158.114 297.885 168.508 296.625 181.232C294.891 198.75 294.688 216.421 293.883 234.028C293.825 235.327 293.877 236.804 294.426 237.933C299.005 247.322 297.715 257.064 296.93 266.97C295.729 282.09 295.47 297.28 294.516 312.423C294.148 318.28 292.462 324.07 292.293 329.919C292.039 338.75 292.524 347.608 292.809 356.451C293.139 366.648 294.342 376.876 293.848 387.026C292.493 414.842 298.667 441.773 302.359 469.015C304.5 484.812 305.887 500.709 307.621 516.561C307.787 518.072 307.46 519.997 308.265 521.024C314.989 529.586 311.887 540.01 313.963 549.421C314.98 554.031 316.723 558.488 317.638 563.113C319.014 570.067 316.51 572.63 309.38 572.056C307.487 571.904 305.616 571.291 303.733 571.281C301.097 571.266 296.55 570.928 296.183 571.943C295.142 574.819 295.54 578.343 295.897 581.553C296.136 583.712 297.268 585.772 297.999 587.876C297.626 588.05 297.249 588.229 296.874 588.408ZM62.2841 243.531C63.0807 253.184 63.9494 262.398 64.5753 271.629C65.4574 284.642 66.1453 297.669 66.9604 310.688C67.029 311.793 67.1395 313.126 67.7822 313.894C68.311 314.526 69.9061 314.942 70.5689 314.591C71.2015 314.255 71.7187 312.613 71.4291 311.888C70.999 310.81 69.814 310.031 69.3454 309.539C70.7597 307.866 72.8836 306.502 72.8166 305.252C72.2894 295.277 71.5513 285.301 70.4149 275.38C70.0467 272.171 66.6993 268.637 67.4742 266.086C69.9362 257.977 67.8993 250.406 67.0223 242.266C65.2716 242.732 64.018 243.068 62.2841 243.531Z" fill="#969696" />
                  </svg>
                </div>
              </div>
            }
            {/* Инвентарь человека */}
            {
              activeHero === 'human' &&
              <div className="backpack__heroItems">
                <div className="backpack__heroItemContainer backpack__heroItemContainer--helmHuman" onClick={() => handleRemoveHeroItem('helm')}>
                  <span>Шлем</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].helm && equipment[activeHero].helm.img && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].helm.img}`} alt={equipment[activeHero].helm.itemName} />}
                    {
                      equipment[activeHero].helm &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].helm.stats.dmg && <div>Урон: {equipment[activeHero].helm.stats.dmg}</div>}
                        {equipment[activeHero].helm.stats.def && <div>Защита: {equipment[activeHero].helm.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--weaponHuman" onClick={() => handleRemoveHeroItem('weapon')}>
                  <span>Оружие</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].weapon && <img className='backpack__itemImg' className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].weapon.img}`} alt={equipment[activeHero].weapon.itemName} />}
                    {
                      equipment[activeHero].weapon.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].weapon.stats.dmg && <div>Урон: {equipment[activeHero].weapon.stats.dmg}</div>}
                        {equipment[activeHero].weapon.stats.def && <div>Защита: {equipment[activeHero].weapon.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--glovesHuman" onClick={() => handleRemoveHeroItem('gloves')}>
                  <span>Перчатки</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].gloves && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment.human.gloves.img}`} alt={equipment[activeHero].gloves.itemName} />}

                    {
                      equipment[activeHero].gloves &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].gloves.stats.dmg && <div>Урон: {equipment[activeHero].gloves.stats.dmg}</div>}
                        {equipment[activeHero].gloves.stats.def && <div>Защита: {equipment[activeHero].gloves.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--cuirassHuman" onClick={() => handleRemoveHeroItem('cuirass')}>
                  <span>Кираса</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].cuirass && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment.human.cuirass.img}`} alt={equipment[activeHero].cuirass.itemName} />}
                    {
                      equipment[activeHero].cuirass &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].cuirass.stats.dmg && <div>Урон: {equipment[activeHero].cuirass.stats.dmg}</div>}
                        {equipment[activeHero].cuirass.stats.def && <div>Защита: {equipment[activeHero].cuirass.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--ringHuman" onClick={() => handleRemoveHeroItem('ring')}>
                  <span>Кольцо</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].ring && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment.human.ring.img}`} alt={equipment[activeHero].ring.itemName} />}
                    {
                      equipment[activeHero].ring &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].ring.stats.dmg && <div>Урон: {equipment[activeHero].ring.stats.dmg}</div>}
                        {equipment[activeHero].ring.stats.def && <div>Защита: {equipment[activeHero].ring.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--bootsHuman" onClick={() => handleRemoveHeroItem('boots')}>
                  <span>Сапоги</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].boots && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment.human.boots.img}`} alt={equipment[activeHero].boots.itemName} />}
                    {
                      equipment[activeHero].boots &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].boots.stats.dmg && <div>Урон: {equipment[activeHero].boots.stats.dmg}</div>}
                        {equipment[activeHero].boots.stats.def && <div>Защита: {equipment[activeHero].boots.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroSvg">
                  <svg width="278" height="643" viewBox="0 0 278 643" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M42.5048 169.042C44.9564 160.449 49.6374 150.507 50.2731 140.311C51.2224 125.112 55.7237 113.115 67.5658 103.01C73.6122 97.8528 77.1129 89.7072 82.7004 81.5445C87.1904 86.7534 90.292 90.3487 92.7037 93.1456C96.8544 85.191 100.84 77.5529 105.438 68.7373C102.328 58.6871 97.7239 46.4331 94.8247 33.7855C91.17 17.825 102.24 2.42906 117.656 0.282177C134.336 -2.04148 151.215 10.2839 152.125 26.2729C152.823 38.5412 152.265 50.8836 152.265 61.0678C162.522 69.5442 172.411 77.7183 183.212 86.6422C184.589 84.8061 186.873 81.7554 189.247 78.585C208.744 93.4706 226.869 108.011 229.785 135.068C230.817 144.639 239.173 153.424 244.509 163.16C241.003 163.785 236.214 164.64 230.124 165.726C231.533 174.516 233.571 182.77 233.905 191.09C234.09 195.706 231.433 200.439 230.036 205.111C229.529 206.805 228.035 208.864 228.554 210.104C235.495 226.714 233.029 243.242 229.309 260.038C228.762 262.507 232.499 266.299 234.84 268.965C246.251 281.955 243.774 287.049 230.25 297.274C222.479 303.15 219.705 315.652 214.71 325.186C213.339 327.806 211.697 330.366 210.853 333.16C209.707 336.95 207.985 341.146 208.618 344.802C215.759 385.929 223.154 427.013 230.957 468.018C231.855 472.742 235.182 477.255 238.166 481.287C251.288 499.027 264.696 516.555 278 534.161C276.774 535.409 275.548 536.658 274.323 537.91C262.355 527.96 250.385 518.009 237.608 507.386C237.348 508.492 237.488 510.668 236.613 511.209C206.594 529.79 221.829 560.009 218.049 585.104C216.007 598.641 219.178 612.948 217.268 626.522C216.464 632.247 209.137 637.63 203.758 641.876C201.323 643.797 196.406 642.651 192.611 642.751C168.448 643.387 166.339 640.521 172.63 617.655C175.253 608.13 178.871 598.237 178.48 588.657C177.699 569.512 174.463 550.466 172.223 531.21C153.539 531.21 137.512 531.21 120.296 531.21C118.865 524.638 117.454 518.157 115.823 510.67C113.608 512.458 111.975 513.094 111.741 514.066C108.54 527.381 104.107 540.61 102.855 554.127C101.453 569.266 101.843 584.799 103.52 599.933C105.501 617.801 104.925 619.295 87.5439 621.827C71.1976 624.207 55.0823 628.347 38.6933 630.177C33.9297 630.711 28.5788 625.969 23.4959 623.643C26.9453 619.779 30.0156 615.471 33.924 612.153C41.011 606.128 48.5997 600.691 53.2835 594.054C56.9752 584.608 62.3318 575.436 63.9282 565.648C65.7897 554.238 64.3615 542.292 64.3615 530.862C63.3837 529.93 62.8278 528.975 62.041 528.709C37.63 520.464 37.285 520.438 40.0446 494.513C44.1668 455.818 49.09 417.205 52.9984 378.487C53.6683 371.844 50.9801 364.862 49.8426 358.036C48.4999 358.079 47.1572 358.122 45.8145 358.165C43.9187 363.91 42.0201 369.657 40.1244 375.4C27.1962 370.658 27.735 363.921 42.6673 344.231C28.8211 326.027 30.4917 296.079 0 289.969C0.458972 284.834 -0.290777 279.657 1.64489 275.842C3.19855 272.78 7.80252 270.539 11.4714 269.629C13.0251 269.244 15.93 272.982 17.7403 275.234C22.2045 280.791 26.3866 286.573 30.6827 292.264C32.1138 291.352 33.542 290.442 34.9731 289.53C32.6953 284.235 29.4939 279.126 28.3935 273.598C27.2447 267.819 26.2811 260.839 28.4705 255.787C33.7501 243.607 41.9603 232.662 46.8265 220.362C48.8648 215.213 55.3189 207.489 45.1018 200.829C42.2881 198.996 45.4439 188.507 45.213 182.015C45.079 178.174 43.6736 174.379 42.5048 169.042Z" fill="#969696" />
                  </svg>
                </div>
              </div>
            }

            {/* Инвентарь эльф */}
            {
              activeHero === 'elf' &&
              <div className="backpack__heroItems">
                <div className="backpack__heroItemContainer backpack__heroItemContainer--helmHuman" onClick={() => handleRemoveHeroItem('helm')}>
                  <span>Шлем</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].helm && equipment[activeHero].helm.img && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].helm.img}`} alt={equipment[activeHero].helm.itemName} />}
                    {
                      equipment[activeHero].helm.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].helm.stats.dmg && <div>Урон: {equipment[activeHero].helm.stats.dmg}</div>}
                        {equipment[activeHero].helm.stats.def && <div>Защита: {equipment[activeHero].helm.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--weaponHuman" onClick={() => handleRemoveHeroItem('weapon')}>
                  <span>Оружие</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].weapon && <img className='backpack__itemImg' className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].weapon.img}`} alt={equipment[activeHero].weapon.itemName} />}
                    {
                      equipment[activeHero].weapon.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].weapon.stats.dmg && <div>Урон: {equipment[activeHero].weapon.stats.dmg}</div>}
                        {equipment[activeHero].weapon.stats.def && <div>Защита: {equipment[activeHero].weapon.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--glovesHuman" onClick={() => handleRemoveHeroItem('gloves')}>
                  <span>Перчатки</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].gloves && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].gloves.img}`} alt={equipment[activeHero].gloves.itemName} />}
                    {
                      equipment[activeHero].gloves.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].gloves.stats.dmg && <div>Урон: {equipment[activeHero].gloves.stats.dmg}</div>}
                        {equipment[activeHero].gloves.stats.def && <div>Защита: {equipment[activeHero].gloves.stats.def}</div>}
                      </div>
                    }

                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--cuirassHuman" onClick={() => handleRemoveHeroItem('cuirass')}>
                  <span>Кираса</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].cuirass && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].cuirass.img}`} alt={equipment[activeHero].cuirass.itemName} />}
                    {
                      equipment[activeHero].cuirass.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].cuirass.stats.dmg && <div>Урон: {equipment[activeHero].cuirass.stats.dmg}</div>}
                        {equipment[activeHero].cuirass.stats.def && <div>Защита: {equipment[activeHero].cuirass.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--ringHuman" onClick={() => handleRemoveHeroItem('ring')}>
                  <span>Кольцо</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].ring && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].ring.img}`} alt={equipment[activeHero].ring.itemName} />}
                    {
                      equipment[activeHero].ring.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].ring.stats.dmg && <div>Урон: {equipment[activeHero].ring.stats.dmg}</div>}
                        {equipment[activeHero].ring.stats.def && <div>Защита: {equipment[activeHero].ring.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--bootsHuman" onClick={() => handleRemoveHeroItem('boots')}>
                  <span>Сапоги</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].boots && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].boots.img}`} alt={equipment[activeHero].boots.itemName} />}
                    {
                      equipment[activeHero].ring.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].boots.stats.dmg && <div>Урон: {equipment[activeHero].boots.stats.dmg}</div>}
                        {equipment[activeHero].boots.stats.def && <div>Защита: {equipment[activeHero].boots.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroSvg">
                  <svg width="269" height="668" viewBox="0 0 269 668" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M265.686 611.683C264.916 610.268 263.492 609.583 262.067 611.012C261.189 611.892 260.227 611.978 259.17 611.792C256.416 611.309 253.679 611.399 250.947 611.929C249.6 612.19 248.409 611.879 247.246 611.154C240.061 606.673 233.532 601.338 227.179 595.771C226.618 595.279 226.191 594.703 226.027 593.952C224.044 584.84 221.326 575.912 220.645 566.497C219.754 554.179 219.078 541.852 218.441 529.522C217.918 519.418 217.809 509.448 221.061 499.538C223.553 491.94 224.926 483.941 225.675 475.896C225.938 473.062 225.739 470.384 224.533 467.822C222.423 463.342 220.535 458.75 217.982 454.493C216.767 452.468 216.191 450.283 216.382 447.987C217.257 437.418 216.403 426.873 216.042 416.322C215.937 413.245 216.04 413.126 219.089 413.438C223.624 413.901 227.947 415.386 232.416 416.165C234.8 416.581 237.405 416.29 239.083 415.046C240.398 414.07 238.21 412.084 237.839 410.471C237.784 410.234 237.705 410.002 237.64 409.767C233.417 394.444 227.787 379.676 220.214 365.685C219.108 363.643 218.5 361.526 218.262 359.219C217.643 353.244 216.889 347.286 216.557 341.28C215.855 328.556 213.033 316.373 207.078 305.019C206.384 303.697 206.245 302.23 206.075 300.776C205.45 295.434 205.593 290.065 205.584 284.704C205.581 282.654 205.022 280.906 203.752 279.303C201.68 276.687 199.514 274.131 197.017 271.948C192.345 267.861 190.235 262.175 189.104 256.652C186.98 246.293 185.153 235.847 185.539 225.059C185.928 214.145 183.534 203.434 180.47 192.945C180.236 192.144 179.988 191.388 180.364 190.586C182.219 186.628 181.76 182.329 182.164 178.161C182.317 176.593 181.404 175.566 180.024 174.948C176.235 173.249 176.338 173.369 179.52 170.483C184.185 166.253 187.048 161.311 184.639 154.711C184.251 153.646 184.581 152.63 184.946 151.627C186.416 147.582 187.871 143.531 189.354 139.491C196.405 120.277 202.758 100.802 210.349 81.7935C217.305 64.3724 224.714 47.1326 231.924 29.8129C234.367 25.5351 235.728 20.8736 236.766 16.098C238.641 12.1362 240.729 8.26855 242.221 4.13512C242.674 2.88246 242.927 1.42696 241.523 0.640943C240.153 -0.12606 238.268 -0.335242 237.227 0.747241C235.227 2.82736 233.167 5.09716 231.995 7.68147C228.754 14.8337 224.49 21.527 222.265 29.1415C222.041 29.9109 221.675 30.6696 221.233 31.3401C213.079 43.7262 206.143 56.8906 197.062 68.6911C185.965 83.111 173.503 96.3827 162.242 110.659C161.854 111.151 161.461 111.881 160.706 111.571C160.035 111.294 160.083 110.498 159.995 109.864C159.806 108.512 159.947 106.971 158.597 106.144C157.517 105.481 157.097 104.482 156.695 103.423C156.056 101.738 155.229 100.162 154.045 98.7968C151.626 96.0087 148.085 95.2261 144.778 96.781C143.734 97.2716 142.667 97.8323 143.255 99.3449C143.486 99.9378 143.441 100.448 142.776 100.763C140.476 101.856 136.233 99.6954 135.811 97.1955C135.552 95.66 135.125 94.1904 134.302 92.8543C133.503 91.5583 131.954 91.1365 131.011 90.0077C127.939 86.3302 127.938 86.3336 123.497 88.1046C122.443 88.5254 121.435 88.9774 120.284 88.1958C115.832 85.1726 111.104 85.9479 107.368 88.8628C104.664 90.9732 101.522 92.1605 98.9052 94.2562C98.4595 94.6126 97.9655 94.9637 97.3592 94.6127C96.603 94.1743 96.8356 93.4902 97.0351 92.8821C97.5222 91.3998 97.8011 89.8902 97.732 88.3304C97.6186 85.787 96.7013 83.6698 94.1607 82.7624C91.6118 81.852 89.3729 82.5912 87.5369 84.5495C85.8089 86.3921 85.0099 88.6727 84.4965 91.0902C84.3686 91.6919 84.5467 92.5247 83.7627 92.7602C82.97 92.9987 82.697 92.1683 82.2533 91.7533C79.1832 88.8818 75.7015 88.4839 72.5424 90.6733C67.8709 93.911 68.2704 100.276 73.4003 104.01C76.0917 105.969 79.2051 106.818 82.4241 107.421C84.9087 107.886 84.9812 108.178 83.4936 110.122C77.1336 118.432 75.7832 127.523 79.9404 137.108C81.5107 140.728 82.4143 144.254 82.1739 148.145C82.0893 149.516 82.3452 150.917 82.1715 152.27C82.0387 153.308 81.3832 154.441 80.3277 154.634C79.1915 154.842 79.0903 153.542 78.8202 152.762C72.8893 135.633 66.048 118.873 58.4928 102.403C57.9697 101.262 57.8943 100.149 57.9829 98.8768C58.3055 94.2435 58.2116 89.5723 56.9026 85.0985C54.7761 77.8288 52.7153 70.5016 48.3532 64.1291C48.0647 63.7078 47.8842 63.2363 47.2963 63.3577C46.7528 63.4698 46.4997 63.9462 46.4739 64.4397C46.4058 65.7347 46.2954 67.0444 46.4112 68.3288C46.6331 70.7922 47 73.2429 47.3031 75.6697C46.6165 75.8384 46.2204 75.5205 46.1148 75.1874C44.8131 71.0882 40.2448 70.7561 37.8166 67.9426C37.0891 67.1 35.7694 67.318 36.1052 68.5799C36.6307 70.5567 36.6312 72.7031 38.0881 74.4755C40.9338 77.938 42.7659 82.0593 44.9815 85.9289C45.1732 86.2634 45.3937 86.8032 45.2564 87.0699C44.127 89.27 45.8292 90.2188 47.1294 91.1853C51.1114 94.146 54.2539 97.8596 56.3026 102.307C63.4733 117.873 69.9789 133.727 75.9822 149.782C77.0285 152.579 78.6411 155.253 78.7633 158.308C78.8445 160.34 79.2878 162.14 80.4041 163.808C80.9579 164.635 81.4138 165.503 80.9297 166.535C80.062 168.384 79.0932 170.153 77.3788 171.392C75.2956 172.897 74.754 172.801 73.4927 170.465C64.0008 152.891 54.252 135.459 44.3732 118.1C43.6428 116.817 43.1484 115.52 43.11 113.977C42.9932 109.316 43.0589 104.758 40.3032 100.442C37.3509 95.8195 35.2745 90.6362 32.7942 85.7085C32.4346 84.9942 32.0424 84.1155 31.1052 84.156C30.2069 84.195 30.2327 85.2024 29.8726 85.7992C29.0303 87.4146 29.9461 88.9511 30.1232 90.5095C30.3188 92.2327 29.8663 93.3624 28.0001 93.5892C25.9466 91.8718 23.8892 90.1593 21.843 88.4337C21.3418 88.011 20.8401 87.4405 20.1612 87.9461C19.5092 88.4318 19.79 89.1607 20.0615 89.7322C20.5826 90.8303 21.1695 91.9006 21.7841 92.9494C24.6186 97.7874 27.8775 102.346 31.0361 106.97C31.531 107.695 32.438 108.4 32.1753 109.303C31.6405 111.139 32.7285 111.795 34.0239 112.456C35.7553 113.34 37.4652 114.266 39.1922 115.158C40.2224 115.691 41.1951 116.319 41.6239 117.439C42.3864 119.434 43.672 121.123 44.6949 122.964C53.4491 138.717 62.1945 154.475 70.9823 170.208C71.9215 171.89 72.9385 173.405 71.4134 175.292C71.1258 175.648 71.1122 176.467 71.3078 176.93C72.0047 178.578 71.2236 179.6 70.2052 180.801C68.4704 182.847 67.6027 185.399 69.1696 187.771C70.5375 189.841 69.8387 190.921 68.1419 191.828C65.9195 193.016 64.4222 194.633 63.3828 197.013C59.1965 206.6 56.8802 216.559 56.8291 227.032C56.8228 228.348 56.6607 229.564 55.9697 230.76C47.4593 245.489 41.1684 261.285 34.3047 276.791C32.5436 280.768 31.1115 283.497 26.2444 283.004C24.4225 282.819 22.186 283.182 20.9588 284.949C17.7199 289.617 15.7442 294.827 14.8425 300.439C14.6104 301.884 15.1199 303.042 15.9618 304.265C17.6021 306.65 20.2917 306.061 22.4016 306.992C27.658 309.312 33.2322 311.017 38.0857 314.165C46.4555 319.593 54.6671 325.267 63.0524 330.67C65.3522 332.152 66.0796 333.752 65.7731 336.474C63.9648 352.531 62.5166 368.612 62.303 384.797C62.1862 393.637 62.139 402.551 60.2164 411.238C57.1517 425.085 54.3167 438.985 49.1104 452.286C46.4535 459.074 44.3674 466.101 41.9377 472.994C35.8049 490.392 25.6906 505.224 13.046 518.394C9.75937 521.817 6.55744 525.432 2.53557 528.119C1.68448 528.687 1.01344 529.572 0.375978 530.401C-0.0940919 531.012 -0.183142 532.273 0.455783 532.308C2.42803 532.418 4.24262 534.245 6.2392 533.124C9.92433 531.056 13.4941 528.715 16.3102 525.548C19.4887 521.973 22.6459 518.386 26.0502 515.028C30.1514 510.982 34.2594 506.946 38.0112 502.563C38.7562 501.694 39.5772 500.829 39.5407 499.608C39.4998 498.233 40.0351 497.081 40.6477 495.929C40.6487 495.928 40.6492 495.927 40.6501 495.925C45.182 489.798 48.9172 483.189 52.3965 476.425C61.2106 461.211 68.9818 445.438 76.8869 429.538C77.6708 430.346 77.5895 430.853 77.5501 431.328C76.9253 438.87 77.0474 446.426 77.3088 453.972C77.5034 459.597 77.7219 465.178 75.5672 470.534C75.5672 470.534 75.5667 470.534 75.5667 470.535C72.9638 475.508 70.0621 480.304 66.5298 484.664C63.6655 488.2 61.1167 491.911 58.6719 495.756C51.1454 507.597 48.0953 520.597 47.9601 534.439C47.8764 543 49.2058 551.428 50.3236 559.89C52.581 576.979 52.9153 594.227 54.1717 611.399C54.2432 612.375 54.2632 613.381 53.7493 614.255C50.4243 619.91 50.6593 626.321 50.2997 632.484C50.126 635.465 50.7294 639.012 54.9367 640.078C57.0262 640.607 58.3215 642.355 58.6534 644.744C59.0437 647.556 59.6773 650.316 59.6563 653.194C59.6184 658.379 62.9877 662.028 66.3375 665.098C69.2543 667.77 73.4601 668.495 77.6032 667.689C82.4386 666.748 87.3335 666.189 92.0469 664.534C94.2794 663.749 95.3101 662.602 95.9174 660.436C97.0055 656.553 96.4969 652.711 96.1578 648.829C95.8478 645.283 93.9077 642.586 91.7447 640.023C90.2401 638.24 88.1569 636.955 87.2187 634.682C83.9642 626.801 80.7151 618.917 77.4358 611.046C76.8251 609.581 76.6625 608.139 76.8392 606.54C79.0796 586.274 81.2669 566.002 83.4474 545.73C83.5545 544.734 83.8202 543.819 84.2956 542.959C90.3009 532.089 96.8264 521.503 101.883 510.113C102.559 508.592 102.932 507.292 102.604 505.744C101.831 502.09 101.048 498.438 100.252 494.789C100.042 493.824 99.8001 492.848 100.327 491.938C101.627 489.691 101.79 487.148 102.306 484.691C104.188 475.712 107.178 467.276 112.927 459.881C121.036 449.449 128.178 438.421 131.151 425.241C131.394 424.165 131.989 423.423 133.024 423.239C136.392 422.643 137.381 420.37 137.506 417.303C137.576 415.604 137.919 413.917 138.106 412.221C138.826 405.682 139.563 399.213 143.858 393.713C145.368 391.779 146.064 389.208 147.138 386.931C147.415 386.343 147.71 385.764 148.002 385.184C148.494 384.207 149.228 383.827 150.153 384.556C151.943 385.968 154.075 386.487 156.214 386.926C158.765 387.45 159.96 388.86 159.875 391.507C159.833 392.791 160.055 394.103 160.298 395.375C163.381 411.506 167.304 427.428 171.958 443.179C174.283 451.049 177.373 458.648 179.718 466.519C183.226 478.295 184.744 490.19 183.239 502.384C182.037 512.126 182.222 521.832 183.294 531.549C184.189 539.653 186.395 547.447 190.81 554.267C197.918 565.246 203.106 576.835 205.223 589.844C206.751 599.235 207.881 608.666 208.958 618.107C209.284 620.969 210.509 622.68 213.174 623.692C216.244 624.858 219.558 624.867 222.617 625.929C223.959 626.396 224.898 626.349 225.779 625.177C227.221 623.258 228.624 623.493 230.657 624.729C240.747 630.869 251.297 634.929 263.38 630.998C266.275 630.057 268.987 627.765 269 624.767C269.015 620.188 267.895 615.737 265.686 611.683ZM87.3072 94.8355C87.4138 92.1307 87.7097 89.465 89.4376 87.2337C90.4235 85.9606 91.6756 84.9303 93.3962 85.6583C94.9612 86.3204 95.2643 87.795 95.1359 89.3475C94.9325 91.8104 94.2897 93.9763 91.569 94.8506C90.551 95.1778 89.8332 96.017 89.1223 96.8044C88.7588 97.2072 88.5028 97.9596 87.86 97.7553C87.0693 97.5037 87.3836 96.6616 87.314 96.0545C87.2688 95.6537 87.3058 95.2436 87.3072 94.8355ZM82.6786 105.502C79.8791 104.427 77.1219 103.25 74.7779 101.304C73.3433 100.112 72.4392 98.6334 72.2708 96.6152C72.3395 94.8584 73.2348 93.4765 74.9141 92.7008C76.7 91.8757 78.4139 92.1727 79.8903 93.4692C81.3846 94.7814 82.3009 96.5119 83.081 98.3033C83.7929 99.9383 84.4688 101.593 85.0635 103.273C85.3948 104.21 86.4688 105.345 85.5939 106.129C84.8026 106.839 83.6274 105.867 82.6786 105.502ZM57.631 293.962C56.2218 292.845 55.689 291.566 55.7985 289.752C56.088 284.965 57.9921 281.077 61.4553 277.76C71.665 267.983 79.3511 256.409 85.2975 243.622C85.7072 242.741 85.7671 241.196 87.1184 241.387C88.3306 241.558 88.207 243.035 88.533 243.995C89.1836 245.911 89.7783 247.846 90.4084 249.813C90.0585 250.681 89.7856 251.532 89.388 252.319C81.4742 267.991 76.0183 284.535 71.9331 301.569C71.1477 304.843 70.9794 304.874 68.3818 302.721C64.8232 299.772 61.2529 296.834 57.631 293.962ZM78.0406 425.085C77.5973 425.738 77.2377 426.448 76.8392 427.131C76.4061 427.875 75.9248 428.584 75.2372 429.151C75.2348 429.151 75.2324 429.151 75.2299 429.152C75.228 429.152 75.226 429.152 75.2246 429.152C75.2202 429.159 75.2168 429.167 75.2119 429.174L75.2825 429.15C72.3005 435.208 69.1147 441.155 65.7098 446.985C65.6461 447.094 65.5852 447.205 65.5215 447.313C61.9478 454.41 58.3673 461.504 54.8038 468.606C53.6038 470.998 52.4471 473.411 51.271 475.814C51.0982 476.104 50.9279 476.396 50.7566 476.688C50.3688 477.349 49.9722 478.005 49.5712 478.658C49.4009 478.935 49.2369 479.216 49.0608 479.488C48.8603 479.799 48.691 480.765 48.0005 479.847C52.7265 468.69 55.7016 456.986 58.8417 445.326C61.3293 436.09 63.2266 426.722 65.3327 417.4C65.3327 417.399 65.3327 417.399 65.3332 417.399C66.3711 410.646 67.4091 403.895 68.4529 397.108C68.9492 397.234 69.1833 397.225 69.2329 397.316C72.2363 402.856 75.5063 408.307 77.6543 414.221C78.881 417.602 77.9282 421.45 78.0406 425.085ZM85.3836 349.429C80.2353 357.779 75.7448 366.487 71.3711 375.259C71.2407 375.521 70.9648 375.711 70.447 376.265C70.0154 373.503 70.5794 371.285 70.7988 369.049C71.6777 360.093 72.9837 351.195 74.4436 342.319C74.9677 339.133 75.2251 339.008 77.808 341.005C80.1744 342.835 82.4357 344.8 84.7501 346.697C85.6693 347.451 86.0907 348.282 85.3836 349.429ZM115.145 311.232C109.244 317.267 103.469 323.415 98.4137 330.198C97.4181 331.534 96.5743 331.411 95.5077 330.232C90.771 325 85.9861 319.812 81.2163 314.61C80.6518 313.994 80.2002 313.337 80.1691 312.406C81.2192 308.152 82.2031 303.88 83.3321 299.648C86.281 288.593 88.7904 277.375 94.7539 267.393C95.1972 266.651 95.3646 265.398 96.3013 265.367C97.4853 265.328 97.5451 266.691 97.9096 267.527C103.133 279.509 108.463 291.443 114.027 303.271C114.493 304.261 115.214 305.24 114.454 306.464C114.014 307.174 114.541 307.721 115.105 308.079C116.755 309.13 116.176 310.178 115.145 311.232ZM174.175 128.003C173.942 125.329 173.434 122.526 175.003 119.939C180.685 110.572 186.492 101.276 191.901 91.7528C197.071 82.6497 202.128 73.4916 207.703 64.6215C212.373 57.1909 218.152 50.5449 222.645 43.0031C223.807 41.0536 224.925 39.0779 226.063 37.1143C226.358 37.2284 226.506 37.3742 226.573 37.5375C226.589 37.5746 226.6 37.6126 226.607 37.6516C226.687 38.0705 226.349 38.5805 226.47 38.9901C224.414 43.6701 222.548 48.4448 220.271 53.0146C205.599 82.4703 196.741 114.15 185.198 144.799C184.54 146.546 183.956 148.322 183.269 150.057C182.764 151.33 181.993 151.592 181.272 150.239C179.878 147.628 179.208 145.104 181.125 142.263C184.597 137.118 183.429 133.327 177.967 130.635C176.575 129.95 174.336 129.844 174.175 128.003Z" fill="#969696" />
                  </svg>

                </div>
              </div>
            }

            {/* Инвентарь эльф */}
            {
              activeHero === 'gnome' &&
              <div className="backpack__heroItems">
                <div className="backpack__heroItemContainer backpack__heroItemContainer--helmGnome" onClick={() => handleRemoveHeroItem('helm')}>
                  <span>Шлем</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].helm && equipment[activeHero].helm.img && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].helm.img}`} alt={equipment[activeHero].helm.itemName} />}
                    {
                      equipment[activeHero].helm.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].helm.stats.dmg && <div>Урон: {equipment[activeHero].helm.stats.dmg}</div>}
                        {equipment[activeHero].helm.stats.def && <div>Защита: {equipment[activeHero].helm.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--weaponGnome" onClick={() => handleRemoveHeroItem('weapon')}>
                  <span>Оружие</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].weapon && <img className='backpack__itemImg' className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].weapon.img}`} alt={equipment[activeHero].weapon.itemName} />}
                    {
                      equipment[activeHero].weapon.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].weapon.stats.dmg && <div>Урон: {equipment[activeHero].weapon.stats.dmg}</div>}
                        {equipment[activeHero].weapon.stats.def && <div>Защита: {equipment[activeHero].weapon.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--glovesGnome" onClick={() => handleRemoveHeroItem('gloves')}>
                  <span>Перчатки</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].gloves && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].gloves.img}`} alt={equipment[activeHero].gloves.itemName} />}
                    {
                      equipment[activeHero].gloves.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].gloves.stats.dmg && <div>Урон: {equipment[activeHero].gloves.stats.dmg}</div>}
                        {equipment[activeHero].gloves.stats.def && <div>Защита: {equipment[activeHero].gloves.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--cuirassGnome" onClick={() => handleRemoveHeroItem('cuirass')}>
                  <span>Кираса</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].cuirass && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].cuirass.img}`} alt={equipment[activeHero].cuirass.itemName} />}
                    {
                      equipment[activeHero].cuirass.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].cuirass.stats.dmg && <div>Урон: {equipment[activeHero].cuirass.stats.dmg}</div>}
                        {equipment[activeHero].cuirass.stats.def && <div>Защита: {equipment[activeHero].cuirass.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--ringGnome" onClick={() => handleRemoveHeroItem('ring')}>
                  <span>Кольцо</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].ring && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].ring.img}`} alt={equipment[activeHero].ring.itemName} />}
                    {
                      equipment[activeHero].ring.stats &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].ring.stats.dmg && <div>Урон: {equipment[activeHero].ring.stats.dmg}</div>}
                        {equipment[activeHero].ring.stats.def && <div>Защита: {equipment[activeHero].ring.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--bootsGnome" onClick={() => handleRemoveHeroItem('boots')}>
                  <span>Сапоги</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment[activeHero] && equipment[activeHero].boots && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${equipment[activeHero].boots.img}`} alt={equipment[activeHero].boots.itemName} />}
                    {
                      equipment[activeHero].boots &&
                      <div className="backpack__itemStats">
                        {equipment[activeHero].boots.stats.dmg && <div>Урон: {equipment[activeHero].boots.stats.dmg}</div>}
                        {equipment[activeHero].boots.stats.def && <div>Защита: {equipment[activeHero].boots.stats.def}</div>}
                      </div>
                    }
                  </div>
                </div>
                <div className="backpack__heroSvg">
                  <svg width="379" height="521" viewBox="0 0 379 521" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M378.982 492.011C378.016 487.059 379.67 481.659 376.455 477.095C378.189 473.004 378.494 469.3 374.566 466.014C373.481 465.105 373.397 462.996 372.854 461.438C372.567 460.271 372.279 459.102 371.992 457.935C373.814 451.134 369.039 449.44 364.167 447.821C363.933 440.866 359.392 435.381 357.693 428.927C357.668 428.758 357.629 428.589 357.557 428.42C356.939 422.604 355.245 416.862 356.339 410.926C356.505 410.417 356.627 409.898 356.696 409.395C358.511 401.565 359.993 393.797 351.977 387.825C351.077 384.938 350.176 382.05 349.276 379.162C350.428 372.629 347.215 367.053 345.419 361.166C345.404 360.791 345.285 360.354 345.041 359.84C343.247 354.722 343.481 348.985 340.305 344.288C341.58 340.366 337.685 337.477 338.301 333.566C339.883 323.53 337.002 314.727 330.337 307.121C333.633 300.342 330.309 294.844 326.907 289.361C325.534 288.408 326.212 286.934 325.977 285.693C325.892 282.884 323.451 281.275 322.524 278.895C322.137 278.519 321.749 278.142 321.361 277.766C320.953 277.036 320.544 276.307 320.136 275.579C320.417 273.681 320.204 271.679 321.322 269.958C322.625 267.988 326.608 266.151 321.627 263.866C321.627 263.866 321.627 263.867 321.625 263.867C321.625 263.867 321.625 263.866 321.627 263.866C321.513 257.649 321.398 251.433 321.285 245.216C322.652 243.774 325.617 243.97 325.337 240.804C324.956 236.501 327.186 232.742 328.28 228.746C329.653 226.937 331.518 226.166 333.742 226.153C343.251 225.228 343.251 225.228 344.124 214.974C345.588 214.207 347.025 213.381 348.521 212.681C351.81 211.143 351.1 209.594 348.602 207.985C348.256 205.977 347.424 203.3 349.589 202.421C353.407 200.872 352.804 197.987 352.79 195.114C352.772 191.433 352.316 187.779 355.86 185.018C357.941 183.397 356.761 180.921 356.217 178.79C356.22 178.041 356.224 177.293 356.228 176.544C356.231 173.461 358.122 170.642 357.499 167.471C362.434 162.954 360.737 157.92 358.634 152.855C358.315 148.134 359.233 143.632 360.861 139.213C362.907 133.656 362.32 128.628 357.508 124.611C357.074 122.072 355.317 120.6 353.546 118.867C348.43 113.861 340.959 111.341 337.97 104.082C336.884 101.443 334.846 99.4678 332.784 97.5576C332.392 87.099 328.425 78.4191 320.054 71.9285C318.394 70.5271 317.216 68.3309 314.549 68.5954C313.548 68.7744 311.267 67.7681 311.831 69.5005C313.662 75.1333 309.959 79.2678 308.658 84.035C307.251 84.1386 305.843 84.241 304.436 84.3446C301.226 83.5622 299.104 81.4932 297.664 78.6172C297.049 74.9216 298.708 71.7867 300.135 68.5943C300.562 68.2577 301.249 67.9966 301.372 67.5722C301.869 65.8499 300.516 66.3925 299.796 66.5242C295.802 67.2525 291.873 68.1992 288.482 70.6115C285.597 71.0482 283.322 72.8594 280.767 74.0402C280.467 73.7487 280.169 73.4572 279.87 73.1667C280.243 72.7626 280.617 72.3585 280.991 71.9533C284.818 69.0547 286.39 65.5978 283.907 61.0749C285.018 65.3997 282.227 67.9617 279.633 70.607C277.575 70.8017 275.982 69.2686 276.013 67.875C276.133 62.6879 271.267 62.5484 268.753 60.0865C268.159 59.5046 266.509 59.1297 266.554 58.8956C267.535 53.8538 262.433 52.53 260.739 49.1721C259.237 44.3183 257.736 39.4644 256.234 34.6106C256.174 32.411 255.187 30.5616 254.025 28.7808C254.025 28.7808 254.025 28.7808 254.025 28.7796C253.419 27.063 251.772 26.588 250.423 25.7561C249.434 23.802 248.549 21.7848 247.429 19.9094C246.014 17.541 245.364 14.1595 241.394 14.7336C241.272 11.0403 238.018 13.3749 236.443 12.4789C236.283 12.2752 236.102 12.0714 235.881 11.8643C235.472 11.629 235.061 11.3938 234.652 11.1574C231.975 9.75144 229.08 9.05128 226.133 8.52559C225.704 8.46256 225.281 8.41078 224.861 8.36688C225.265 8.36237 225.686 8.40627 226.133 8.52559C223.195 6.92716 219.813 7.46184 216.73 6.56357C216.757 6.20898 216.698 5.87016 216.553 5.54484C215.889 4.68709 215.218 3.83384 214.561 2.97045C211.987 -0.413287 209.61 -1.74044 207.734 3.54004C207.494 4.21769 206.957 4.78952 206.558 5.41089C205.339 7.26936 204.12 9.12895 202.902 10.9885C202.901 10.9897 202.9 10.9897 202.899 10.9908C202.622 11.324 202.344 11.6583 202.067 11.9926C198.472 12.7716 195.361 14.3768 193.031 17.3103C189.366 20.013 188.513 24.7847 185.14 27.8453C183.241 29.5676 185.13 34.3899 187.312 34.7659C187.284 35.1272 187.326 35.4796 187.439 35.824C184.623 38.3624 184.592 41.5368 185.368 44.8957C185.283 45.2289 185.21 45.5655 185.151 45.9043C184.184 46.4368 183.957 47.2675 184.195 48.2851C184.238 51.7859 185.13 55.092 186.496 58.2889C187.762 60.3848 188.406 62.6688 188.55 65.1036C187.079 67.0307 190.853 70.6464 186.031 71.7146C179.948 73.062 175.078 76.8476 170.61 81.088C169.9 81.4133 169.191 81.7386 168.481 82.064C165.531 83.6534 165.296 87 163.697 89.4629C163.441 89.7083 163.147 89.8963 162.817 90.0269C160.334 89.7511 158.474 93.2542 155.698 91.201C152.977 90.3308 150.704 90.9826 148.504 92.8399C145.1 95.716 141.612 98.4817 138.776 101.957C136.492 102.498 135.424 103.936 135.108 106.28C134.587 110.156 134.022 114.049 133.073 117.834C132.461 120.279 133.626 121.643 135.365 122.271C141.502 124.488 140.826 127.379 136.653 131.053C135.415 132.142 134.531 133.635 133.485 134.943C131.875 135.492 131.274 136.705 130.992 138.314C130.397 141.704 128.185 144.061 125.643 146.161C123.65 145.758 121.447 145.87 120.089 143.901V143.9C118.159 141.274 116.229 138.646 114.299 136.02C114.251 135.654 114.289 135.299 114.416 134.952C116.019 134.912 117.299 135.345 117.315 132.506C117.344 127.901 117.539 123.435 115.261 119.254C114.997 118.789 114.732 118.323 114.468 117.858C114.468 117.858 114.468 117.858 114.469 117.858C113.778 115.995 113.088 114.133 112.398 112.27C112.397 112.27 112.396 112.271 112.394 112.271C112.396 112.271 112.397 112.271 112.398 112.27C112.659 111.551 112.92 110.831 113.181 110.112C116.651 107.586 111.386 106.433 112.271 104.314C114.265 103.286 115.673 102.092 112.596 100.732C109.17 99.2179 105.344 99.0322 102.612 101.519C100.406 103.527 98.0455 103.737 95.5658 104.301C94.3305 102.47 93.0952 100.64 91.8599 98.8082C91.3063 96.4522 88.4926 95.1351 88.8875 92.3424L89.2621 92.4685L89.5861 92.2422C91.6484 92.5664 93.5598 92.1454 95.3419 91.0816C101.171 89.32 107.611 90.6235 113.173 87.5234C115.419 87.4131 116.087 90.1597 118.453 90.2025C125.022 90.3229 131.359 89.0397 137.687 87.5707C139.309 87.1936 138.975 86.077 138.584 84.9828C135.965 77.6491 134.699 69.8764 131.377 62.7724C129.578 55.2124 127.383 47.854 121.055 42.614C116.329 35.1914 111.091 28.1504 105.192 21.6182C100.69 16.6337 100.658 16.6641 97.2759 22.2744C97.2759 22.2756 97.2759 22.2756 97.2748 22.2767C95.7098 24.5742 91.3446 21.6283 90.7573 25.7584C90.7573 25.7584 90.7573 25.7584 90.7584 25.7584C90.7584 25.7584 90.7584 25.7584 90.7584 25.7595C88.6253 28.6671 86.8151 31.7019 86.94 35.4965C86.94 35.4965 86.94 35.4965 86.94 35.4976C84.655 35.9861 82.253 36.1786 80.5238 38.0607C76.3565 41.8474 72.1994 45.6454 68.0142 49.413C67.1243 50.2145 67.1682 50.9056 68.0142 51.6531C68.0142 51.6531 68.0142 51.6531 68.0142 51.6542C68.1211 52.0043 68.1953 52.3611 68.237 52.7247C67.5676 53.0523 66.8993 53.3798 66.231 53.7074C65.7843 53.3022 65.3366 52.8969 64.8899 52.4917C64.081 51.3041 62.9886 50.9473 62.6409 52.5773C61.913 55.9835 61.0006 51.706 60.3143 52.7225C54.6699 51.4021 54.7756 51.473 52.1362 55.4195C50.9133 57.2476 49.1897 58.7402 47.6922 60.3837C47.3401 60.7811 46.9891 61.1784 46.6369 61.5747C45.486 62.1319 44.2878 63.2485 43.1909 63.1551C35.1647 62.4741 27.0316 60.5109 19.7975 66.0829C17.5035 63.826 15.2432 63.9363 13.0156 66.182C13.0156 66.182 13.0145 66.182 13.0145 66.1831C12.6837 66.2169 12.3563 66.2721 12.0334 66.3475C9.40303 66.6953 5.76571 64.9055 5.17505 69.5826C3.36258 71.0921 -0.224119 72.999 0.0110188 74.0515C2.46703 85.0447 5.53507 95.9006 8.43435 106.795C14.9383 118.123 22.7508 128.469 31.8019 137.878C33.3432 139.481 35.0364 141.006 35.914 137.304C36.5868 136.489 37.426 134.878 37.9065 134.979C43.5914 136.172 44.6208 127.652 50.4138 129.091C51.3768 129.331 51.5804 127.82 51.5602 126.924C51.5197 125.078 51.3431 123.235 51.2227 121.39C57.2519 119.283 59.3175 113.578 62.5329 108.917C63.7817 108.535 63.5432 106.421 65.808 106.607C65.808 110.489 67.2593 115.31 65.5109 118.177C61.679 124.461 64.5513 128.416 68.1188 132.772C69.1483 140.687 73.5326 147.22 76.9269 154.161C76.9764 155.266 77.2532 156.415 77.0406 157.465C75.5825 164.658 78.5358 172.556 84.8204 175.883C92.1546 179.766 95.5298 186.062 97.3209 193.654C97.9172 201.816 103.44 206.361 109.62 210.421C111.914 212.501 114.589 213.622 117.704 213.641C119.599 214.259 121.485 214.329 123.354 213.533C126.018 213.421 128.305 214.121 130.698 215.539C133.443 217.166 136.254 219.081 140.115 217.747C144.072 216.379 147.372 217.365 149.923 221.566C152.693 226.128 146.179 224.968 146.799 227.8C143.92 230.668 140.973 233.473 138.196 236.436C137.133 237.57 135.318 239.285 136.146 240.532C139.642 245.795 136.003 250.164 133.89 253.83C130.818 259.158 133.871 258.961 137.306 259.168C137.227 261.079 134.685 262.493 136.773 264.373C137.918 269.067 133.234 269.731 131.3 272.296C129.837 272.914 128.347 273.513 128.914 275.599C128.591 276.331 128.268 277.062 127.946 277.794C128.22 278.221 128.492 278.647 128.765 279.074C125.046 287.225 119.675 294.331 114.537 301.584C114.135 301.962 113.733 302.341 113.332 302.72C111.057 304.417 108.453 305.994 110.88 309.415L111.002 309.336C109.856 316.819 104.659 322.122 100.955 328.244C99.6228 330.447 96.2667 331.747 97.4773 335.233C101.562 339.803 98.0556 344.253 97.2624 348.747C96.2251 351.017 95.1867 353.287 94.1494 355.557C93.444 358.497 90.3433 360.805 91.6112 364.265C91.6416 364.382 91.6855 364.507 91.7541 364.643C91.3738 366.433 90.9924 368.224 90.6122 370.014C89.4286 373.3 86.2661 376.205 88.1832 381.719C90.1475 378.038 90.3534 374.638 94.0639 374.693C96.7573 383.798 98.3549 393.258 102.86 401.772C102.926 404.728 102.993 407.684 103.06 410.64C101.629 413.767 101.568 417.667 97.3839 419.155C95.5692 419.801 96.5199 421.583 97.2197 422.884C94.6692 426.762 93.5137 431.444 90.305 434.936C89.3116 436.018 89.5895 436.917 90.5345 437.801C89.8168 438.482 89.099 439.163 88.3823 439.844C86.6553 441.505 87.336 442.369 89.3836 442.426C91.7102 442.491 94.0436 442.301 96.3725 442.221C96.3725 442.221 96.3725 442.221 96.3725 442.222C96.6571 442.299 96.9451 442.353 97.2388 442.384C98.0905 445.743 96.4276 446.602 93.9266 445.006C90.9362 443.098 88.0707 442.86 83.3612 443.827C86.3516 444.858 87.9615 445.413 89.5715 445.968C89.3251 446.169 89.0866 446.38 88.8301 446.568C88.6827 446.676 88.5072 446.745 88.3452 446.83H88.3441C85.0352 446.278 81.7253 445.877 78.4053 446.747C75.9504 446.57 77.143 449.194 75.9301 449.972C75.2798 451.587 75.5555 451.989 78.223 453.29C77.098 453.387 76.0044 453.482 74.9108 453.576C74.9108 453.576 74.9108 453.576 74.9097 453.576C72.7305 453.584 70.5512 453.591 68.372 453.599C65.709 455.103 63.6253 457.157 62.3248 459.958C61.4033 460.621 61.4169 461.555 61.5777 462.532C58.9856 465.646 61.8309 469.393 60.3998 472.642C59.6449 477.073 60.4369 480.443 65.8755 480.616C75.695 485.443 85.4932 483.632 95.2868 480.518C100.057 479.082 104.966 477.986 109.556 476.11C113.974 474.303 118.029 472.179 123.15 473.09C127.365 473.839 131.645 472.935 135.671 471.282C136.755 471.07 137.908 471.026 138.914 470.621C146.142 467.714 156.207 468.094 155.815 456.224C155.809 456.045 155.899 455.864 155.944 455.684C158.273 454.057 155.523 450.656 158.051 449.265C160.823 447.739 159.895 446.271 159.02 443.904C157.169 438.885 155.777 433.481 157.179 428.163C158.083 424.735 156.42 423.886 154.048 422.962C155.075 418.725 152.504 413.107 158.681 410.848C158.686 410.846 158.692 410.844 158.697 410.842L159.067 410.886L159.308 410.603C162.282 407.044 165.986 406.996 170.215 407.813C172.745 408.301 175.32 408.552 177.812 409.316C179.611 409.868 181.059 409.278 180.393 407.216C178.826 402.359 180.175 397.21 178.647 392.386C178.639 390.681 178.631 388.976 178.622 387.269C181.055 385.956 181.923 388.395 183.204 389.383C192.366 396.458 202.774 399.957 214.224 400.658C215.71 401.171 217.138 401.377 218.522 401.361C222.438 401.808 226.367 401.688 230.163 400.701C234.847 399.482 238.427 400.24 241.488 403.868C243.366 405.757 245.244 407.646 247.122 409.534C248.311 411.728 250.267 412.72 252.64 413.06C253.093 413.369 253.548 413.678 254.001 413.987C256.328 416.834 258.255 413.969 259.754 413.134C266.787 409.213 272.73 403.908 277.573 397.424C281.196 394.233 283.469 393.967 283.026 399.883C282.944 400.98 283.199 402.091 284.183 402.843C285.546 406.278 286.907 409.714 288.27 413.148C288.438 415.331 288.606 417.515 288.775 419.697C290.937 424.906 295.782 427.282 300.253 429.591C303.873 431.46 306.283 433.89 307.731 437.444C309.557 441.927 311.462 446.398 312.303 451.215C311.962 451.974 311.621 452.734 311.279 453.494C309.685 454.285 309.609 455.454 310.446 456.851C310.549 461.899 309.492 466.735 307.774 471.451C307.068 474.777 309.604 473.555 311.085 473.813C310.283 476.695 309.48 479.577 308.678 482.459C307.836 483.178 306.981 483.889 306.906 485.121C305.815 486.161 305.546 487.219 306.835 488.311C306.835 488.694 306.834 489.076 306.834 489.458C305.971 491.267 305.108 493.077 304.246 494.886C299.574 509.071 301.031 513.165 312.338 517.61C315.693 519.779 319.39 520.918 323.36 520.976C331.726 521.101 340.105 520.748 348.355 519.475C353.923 518.615 359.681 517.544 363.879 513.061C367.175 511.361 366.384 506.733 369.641 505.007C372.838 501.38 372.477 494.993 378.523 493.525C378.791 493.459 379.074 492.488 378.982 492.011ZM98.0432 357.377C98.059 357.333 98.0747 357.292 98.0916 357.248C98.1568 357.288 98.2075 357.33 98.2671 357.371C98.1917 357.372 98.113 357.381 98.0432 357.377ZM9.69104 96.6131C9.68767 96.6165 9.68767 96.6165 9.68429 96.6188C9.68654 96.6154 9.68767 96.6154 9.69104 96.6131ZM104.168 40.831C104.142 40.8963 104.114 40.948 104.089 41.019C104.09 41.0201 104.09 41.0201 104.092 41.0212C104.09 41.0212 104.09 41.0212 104.089 41.0212C103.982 40.9188 103.876 40.8152 103.769 40.7128C103.772 40.7026 103.777 40.6925 103.78 40.6813C103.9 40.7465 104.03 40.7949 104.168 40.831ZM72.5831 58.3924C72.6843 58.4555 72.7631 58.505 72.8587 58.5646C72.8092 58.6063 72.7608 58.6491 72.7113 58.6975C72.6686 58.595 72.627 58.4971 72.5831 58.3924ZM108.839 40.3357C108.816 40.3424 108.79 40.3413 108.766 40.3458C108.783 40.3278 108.799 40.3132 108.816 40.2952C108.824 40.3098 108.831 40.3233 108.839 40.3357C108.839 40.3368 108.839 40.3368 108.839 40.3357C108.839 40.3368 108.839 40.3368 108.839 40.3357ZM82.1292 56.2289C82.2507 55.8225 82.4094 55.4173 82.6344 55.0154C82.739 55.164 82.847 55.2822 82.9539 55.4162C82.6479 55.6255 82.3767 55.9002 82.1292 56.2289ZM127.813 167.547C127.846 167.558 127.88 167.568 127.912 167.579C127.89 167.594 127.867 167.61 127.845 167.626C127.836 167.599 127.824 167.574 127.813 167.547ZM135.583 156.62C135.512 156.528 135.436 156.448 135.364 156.358C135.448 156.382 135.529 156.413 135.613 156.435C135.603 156.496 135.593 156.558 135.583 156.62ZM295.536 102.306C295.542 102.329 295.542 102.351 295.549 102.375L295.55 102.377C295.489 102.373 295.428 102.37 295.368 102.365C295.424 102.346 295.481 102.334 295.536 102.306ZM175.041 208.345C175.092 208.334 175.14 208.323 175.191 208.313C175.175 208.375 175.162 208.436 175.145 208.498C175.11 208.449 175.072 208.403 175.041 208.345ZM212.372 27.045C212.349 26.9032 212.327 26.7591 212.306 26.615C212.387 26.6397 212.466 26.6645 212.554 26.6972C212.491 26.8131 212.447 26.9302 212.372 27.045ZM165.893 149.669C166.046 149.721 166.201 149.753 166.356 149.785C166.238 149.904 166.122 150.027 166.007 150.156C165.946 150.012 165.905 149.854 165.893 149.669ZM177.309 146.187C177.314 146.164 177.315 146.146 177.32 146.121C177.356 146.124 177.385 146.128 177.42 146.131C177.381 146.149 177.35 146.17 177.309 146.187ZM174.905 160.848C174.886 160.85 174.87 160.855 174.851 160.857C174.882 160.812 174.904 160.768 174.943 160.723C174.92 160.769 174.923 160.804 174.905 160.848ZM174.65 169.749C174.633 169.803 174.625 169.858 174.613 169.913C174.61 169.827 174.614 169.74 174.618 169.651C174.628 169.683 174.638 169.717 174.65 169.749ZM175.67 172.177C175.866 172.551 176.066 172.897 176.273 173.199C175.901 172.784 175.553 172.366 175.271 171.923C175.401 172.035 175.534 172.12 175.67 172.177ZM329.298 195.109C329.293 195.004 329.287 194.899 329.282 194.795C329.349 194.874 329.421 194.948 329.499 195.014C329.432 195.047 329.364 195.075 329.298 195.109ZM239.501 339.781C239.466 339.917 239.432 340.043 239.399 340.167C239.376 340.024 239.427 339.826 239.501 339.781ZM236.949 326.277C236.949 326.275 236.949 326.273 236.948 326.271C236.953 326.265 236.959 326.261 236.965 326.255C236.969 326.232 236.974 326.21 236.978 326.187C237.003 326.201 237.027 326.213 237.051 326.227C237.019 326.241 236.984 326.262 236.949 326.277ZM288.157 129.315C288.236 129.517 288.299 129.717 288.348 129.912C288.238 129.846 288.136 129.766 288.044 129.667C288.082 129.55 288.119 129.433 288.157 129.315ZM240.317 193.425C240.32 193.605 240.324 193.783 240.329 193.96C240.28 193.918 240.232 193.876 240.182 193.835C240.23 193.697 240.268 193.563 240.317 193.425ZM287.482 243.959C287.455 243.943 287.434 243.924 287.404 243.909C287.438 243.882 287.466 243.856 287.501 243.829C287.496 243.874 287.489 243.915 287.482 243.959ZM283.111 186.649C283.159 186.545 283.213 186.453 283.27 186.368C283.453 186.536 283.567 186.699 283.61 186.86C283.444 186.79 283.278 186.72 283.111 186.649C283.111 186.65 283.111 186.65 283.111 186.649ZM255.958 259.18C256.1 259.18 256.243 259.185 256.387 259.19C256.165 259.281 255.948 259.384 255.735 259.504C255.676 259.349 255.695 259.2 255.958 259.18ZM246.039 271.039C246.018 270.993 246.006 270.949 245.983 270.903C245.983 270.902 245.983 270.902 245.983 270.901C246.018 270.924 246.046 270.952 246.08 270.976C246.066 270.996 246.054 271.018 246.039 271.039ZM228.962 262.141C228.962 262.15 228.962 262.159 228.962 262.168C228.953 262.159 228.944 262.151 228.935 262.143C228.944 262.142 228.952 262.143 228.962 262.141ZM242.583 239.631C242.593 239.619 242.605 239.609 242.614 239.598C242.624 239.616 242.633 239.634 242.644 239.651C242.624 239.644 242.603 239.638 242.583 239.631ZM242.599 239.57C242.601 239.574 242.603 239.578 242.606 239.582C242.602 239.583 242.598 239.583 242.594 239.585C242.596 239.579 242.597 239.576 242.599 239.57ZM235.887 240.734C235.9 240.744 235.914 240.752 235.927 240.762C235.912 240.764 235.897 240.768 235.881 240.77C235.881 240.758 235.881 240.745 235.881 240.733C235.882 240.729 235.885 240.726 235.886 240.723C235.887 240.727 235.887 240.731 235.887 240.734ZM269.636 239.553C269.644 239.555 269.651 239.561 269.659 239.563C269.651 239.57 269.644 239.576 269.636 239.581C269.635 239.571 269.636 239.563 269.636 239.553ZM281.948 201.284C281.95 201.27 281.95 201.259 281.952 201.246C281.963 201.25 281.969 201.252 281.979 201.257C281.969 201.265 281.958 201.274 281.948 201.284ZM279.966 205.067C280.03 204.642 280.291 204.577 280.661 204.705C280.453 204.852 280.219 204.973 279.966 205.067ZM244.491 214.346C244.434 214.146 244.378 213.945 244.303 213.738C244.444 213.719 244.587 213.691 244.734 213.649C244.707 213.896 244.615 214.126 244.491 214.346ZM239.109 226.239C239.861 226.572 240.521 226.914 239.335 227.829C239.256 227.299 239.181 226.769 239.109 226.239ZM225.622 286.857C225.636 286.849 225.648 286.846 225.662 286.838C225.662 286.839 225.752 286.942 225.752 286.941C225.753 286.943 225.756 286.946 225.757 286.948C225.756 286.949 225.753 286.949 225.752 286.95C225.752 286.948 225.753 286.946 225.753 286.942C225.71 286.914 225.665 286.886 225.622 286.857ZM231.554 293.172C231.29 293.124 231.048 293.006 230.842 292.768C231.069 292.909 231.308 293.043 231.554 293.172ZM256.05 259.872C256.043 259.876 256.038 259.88 256.023 259.872C256.032 259.872 256.041 259.872 256.05 259.872ZM218.814 273.501C218.977 273.801 219.14 274.101 219.303 274.401C218.943 274.468 218.506 274.594 217.974 274.762C218.265 274.324 218.54 273.912 218.814 273.501ZM247.054 299.236C247.054 299.237 247.054 299.237 247.054 299.236C247.054 299.237 247.054 299.236 247.054 299.236C247.096 299.155 247.133 299.074 247.173 298.993C247.198 299.054 247.23 299.119 247.257 299.181C247.187 299.196 247.125 299.223 247.054 299.236ZM247.047 201.286C247.033 201.317 247.024 201.342 247.01 201.373C247.015 201.345 247.019 201.315 247.024 201.287C247.033 201.287 247.04 201.287 247.047 201.286ZM267.83 255.162C267.706 255.213 267.587 255.273 267.465 255.328C267.534 255.172 267.647 255.094 267.83 255.162ZM291.244 303.852V303.851H291.245C291.244 303.851 291.244 303.852 291.244 303.852ZM288.702 227.201C288.702 227.2 288.703 227.198 288.703 227.197C288.705 227.198 288.707 227.2 288.71 227.201C288.707 227.201 288.704 227.201 288.702 227.201ZM291.942 191.154C291.93 191.133 291.916 191.11 291.904 191.089C291.939 191.091 291.974 191.093 292.009 191.094C291.987 191.115 291.964 191.135 291.942 191.154ZM317.638 173.052C317.692 173.088 317.749 173.115 317.804 173.148C317.779 173.514 317.621 173.302 317.638 173.052ZM190.776 265.469C190.785 265.48 190.794 265.493 190.802 265.504C190.794 265.521 190.79 265.537 190.783 265.554C190.749 265.578 190.72 265.6 190.688 265.623C190.717 265.571 190.746 265.52 190.776 265.469ZM190.806 265.495C190.799 265.486 190.793 265.478 190.786 265.469C190.783 265.469 190.78 265.468 190.776 265.468C190.777 265.466 190.78 265.464 190.781 265.461C190.783 265.465 190.784 265.467 190.786 265.469C190.797 265.469 190.804 265.471 190.815 265.471C190.811 265.479 190.81 265.487 190.806 265.495ZM223.187 303.374C222.998 303.299 222.808 303.15 222.618 302.956C222.629 302.943 222.64 302.93 222.652 302.917C222.852 303.093 223.026 303.245 223.187 303.374ZM280.395 298.97C280.408 299.063 280.42 299.15 280.432 299.245C280.357 299.167 280.291 299.089 280.219 299.012C280.278 298.999 280.34 298.987 280.395 298.97ZM246.488 177.294C246.708 177.123 246.927 176.953 247.146 176.782C247.194 176.93 247.229 177.097 247.262 177.266C246.978 177.267 246.719 177.276 246.488 177.294ZM229.151 65.9512C229.098 65.9445 229.045 65.9389 228.992 65.9321C228.992 65.9321 228.992 65.9321 228.992 65.931C229.07 65.7452 229.195 65.6147 229.345 65.5111C229.28 65.6608 229.216 65.8072 229.151 65.9512ZM286.453 342.016C286.455 342.022 286.459 342.029 286.462 342.034C286.45 342.034 286.438 342.033 286.427 342.033C286.427 342.033 286.439 342.024 286.453 342.016ZM313.469 193.448C313.474 193.457 313.48 193.466 313.486 193.475C313.465 193.48 313.447 193.477 313.427 193.482C313.441 193.472 313.455 193.458 313.469 193.448ZM328.28 169.609C328.215 169.674 328.15 169.741 328.084 169.806C328.092 169.711 328.114 169.621 328.123 169.527C328.176 169.556 328.23 169.584 328.28 169.609ZM326.101 148.472C326.077 148.45 326.056 148.43 326.032 148.408C326.092 148.271 326.166 148.158 326.261 148.083C326.208 148.202 326.155 148.329 326.101 148.472ZM273.015 118.091C272.925 118.084 272.837 118.076 272.747 118.071C272.83 118.028 272.914 117.992 272.996 117.95C273.003 117.996 273.005 118.047 273.015 118.091ZM234.278 328.656C234.286 328.649 234.293 328.644 234.299 328.637C234.305 328.828 234.321 329.03 234.351 329.242C234.304 329.044 234.285 328.85 234.278 328.656ZM278.701 319.547C278.701 319.543 278.7 319.537 278.7 319.532C278.702 319.532 278.706 319.531 278.708 319.531C278.706 319.537 278.703 319.542 278.701 319.547ZM286.349 341.892C286.381 341.919 286.404 341.946 286.438 341.973C286.439 341.976 286.44 341.978 286.441 341.982C286.439 341.993 286.435 342.003 286.432 342.014C286.414 342.02 286.399 342.024 286.381 342.029C286.371 341.984 286.36 341.938 286.349 341.892ZM332.95 156.572C333.07 156.301 333.19 156.044 333.309 155.767C333.338 156.206 333.404 156.596 333.497 156.951C333.309 156.834 333.127 156.707 332.95 156.572ZM288.559 107.27C288.235 106.966 287.919 106.654 287.609 106.335C288.015 106.61 288.323 106.926 288.559 107.27ZM140.472 380.602C140.486 380.619 140.499 380.63 140.513 380.646C140.503 380.646 140.49 380.645 140.479 380.646C140.476 380.63 140.474 380.618 140.472 380.602ZM268.741 317.294C268.751 317.304 268.758 317.314 268.769 317.324C268.752 317.328 268.737 317.335 268.721 317.34C268.727 317.323 268.733 317.31 268.741 317.294ZM312.088 99.5961C312.114 99.7357 312.138 99.8742 312.178 100.025C312.094 99.9474 312.028 99.8652 311.958 99.7841C312.001 99.72 312.044 99.6569 312.088 99.5961ZM319.823 108.759C320.047 108.923 320.268 109.11 320.479 109.336C320.203 109.084 319.961 108.912 319.735 108.777C319.763 108.771 319.794 108.765 319.823 108.759ZM161.856 215.651C162.685 212.637 160.558 210.469 159.639 207.957C162.632 207.198 165.618 206.433 168.482 205.264C168.64 205.124 168.771 204.968 168.915 204.819C173.113 207.025 170.285 210.595 170.199 213.634C169.909 213.854 169.603 214.051 169.253 214.18C167.111 215.749 165.917 217.539 166.102 219.654C165.144 217.947 164.268 216.167 162.011 215.663C161.98 215.685 161.951 215.705 161.921 215.726C161.899 215.701 161.878 215.677 161.856 215.651ZM184.454 314.791C184.274 315.311 184.161 315.871 184.104 316.484C183.935 315.953 184.032 315.262 184.454 314.791ZM325.838 407.39C325.837 407.392 325.837 407.392 325.835 407.393C325.835 407.392 325.835 407.392 325.835 407.39C325.837 407.39 325.838 407.39 325.838 407.39ZM307.886 105.457C307.886 105.456 307.886 105.454 307.886 105.453C307.886 105.452 307.886 105.452 307.886 105.451C307.886 105.451 307.886 105.451 307.887 105.452C307.892 105.454 307.895 105.456 307.9 105.459C307.894 105.459 307.891 105.457 307.886 105.457ZM287.363 104.828C287.359 104.833 287.357 104.837 287.355 104.842C287.352 104.838 287.348 104.836 287.346 104.833C287.35 104.832 287.356 104.829 287.363 104.828ZM265.053 104.64C265.055 104.542 265.057 104.455 265.06 104.358C265.131 104.406 265.208 104.44 265.285 104.478C265.207 104.534 265.131 104.585 265.053 104.64ZM217.824 15.6409C217.756 15.588 217.687 15.5362 217.62 15.4822C217.699 15.4979 217.778 15.525 217.857 15.5644C217.848 15.5914 217.833 15.6139 217.824 15.6409ZM100.96 119.474C100.967 119.282 100.975 119.089 100.982 118.897C101.07 119.115 101.16 119.272 101.25 119.403C101.155 119.436 101.058 119.46 100.96 119.474ZM93.6802 150.038C93.732 150.027 93.7815 150.021 93.831 150.024C93.7815 150.027 93.7297 150.036 93.6802 150.038ZM109.929 352.153C109.88 352.243 109.823 352.329 109.77 352.416C109.613 352.405 109.457 352.391 109.299 352.374C109.508 352.297 109.717 352.217 109.929 352.153ZM337.118 491.679C337.118 491.679 337.12 491.679 337.121 491.679C337.121 491.68 337.119 491.68 337.118 491.679C337.118 491.68 337.118 491.679 337.118 491.679ZM337.127 491.679C337.125 491.679 337.125 491.679 337.124 491.679C337.107 491.677 337.091 491.673 337.073 491.67C337.084 491.659 337.095 491.653 337.106 491.642C337.114 491.654 337.121 491.666 337.127 491.679ZM219.77 15.633C219.752 15.633 219.733 15.633 219.715 15.6341C219.719 15.606 219.721 15.579 219.724 15.5509C219.739 15.5779 219.753 15.606 219.77 15.633ZM81.4047 96.0109C81.4902 96.1449 81.5768 96.2777 81.6488 96.4207C81.5509 96.442 81.4542 96.4443 81.3563 96.4623C81.3721 96.3058 81.3889 96.1572 81.4047 96.0109ZM152.27 446.777C152.23 446.741 152.19 446.703 152.15 446.668C152.271 446.668 152.384 446.666 152.506 446.666C152.426 446.706 152.349 446.738 152.27 446.777ZM142.443 423.225C142.544 423.172 142.643 423.131 142.743 423.082C142.728 423.165 142.715 423.248 142.707 423.325C142.619 423.29 142.531 423.261 142.443 423.225ZM110.422 390.396C110.422 390.086 110.422 389.772 110.422 389.429C110.548 389.782 110.674 390.099 110.8 390.395C110.67 390.379 110.545 390.382 110.422 390.396ZM245.721 371.763C245.803 371.608 245.865 371.45 245.963 371.297C246.183 371.38 246.357 371.507 246.496 371.662C246.259 371.711 246.006 371.749 245.721 371.763ZM276.208 377.03C276.252 377.048 276.301 377.062 276.342 377.083C276.297 377.076 276.251 377.068 276.206 377.062C276.206 377.052 276.208 377.04 276.208 377.03ZM356.049 479.376C356.059 479.375 356.07 479.373 356.08 479.372C356.076 479.378 356.069 479.382 356.065 479.389C356.06 479.384 356.055 479.381 356.049 479.376ZM303.918 89.8648C303.789 89.9875 303.603 90.0798 303.428 90.1214C302.808 90.2667 302.242 90.4096 301.701 90.5537C302.552 90.0179 303.469 89.6352 304.446 89.3954C304.271 89.5429 304.096 89.6982 303.918 89.8648ZM260.314 87.6078C260.307 87.6078 260.302 87.6067 260.295 87.6067L260.294 87.6078L260.295 87.6067C260.324 87.5741 260.356 87.5448 260.385 87.5122C260.386 87.5212 260.385 87.5291 260.385 87.5381C260.361 87.5617 260.338 87.5842 260.314 87.6078ZM216.73 11.9454C216.715 11.906 216.693 11.8778 216.679 11.8362H216.678C216.678 11.835 216.679 11.835 216.679 11.8339C216.719 11.8317 216.757 11.8227 216.797 11.8193C216.775 11.8621 216.752 11.9015 216.73 11.9454ZM112.514 147.077C112.959 146.862 113.281 146.66 113.521 146.466C113.421 146.985 113.359 147.394 113.356 147.711C113.074 147.504 112.796 147.286 112.514 147.077ZM50.1696 74.0571C50.1707 74.074 50.1719 74.0909 50.1741 74.1078C50.1404 74.1438 50.1066 74.181 50.1066 74.181C50.0807 74.1618 50.0537 74.1449 50.0279 74.1258C50.0751 74.1033 50.1224 74.0808 50.1696 74.0571ZM29.1096 125.092C29.1107 125.098 29.1118 125.104 29.1141 125.109C28.96 125.315 28.9307 125.113 29.1096 125.092ZM95.1923 437.688C95.1462 437.747 95.1001 437.793 95.055 437.847C95.0247 437.744 94.9954 437.641 94.9932 437.563C95.0776 437.601 95.1484 437.641 95.1923 437.688ZM109.733 446.73C109.721 446.75 109.707 446.768 109.695 446.789C109.699 446.765 109.701 446.739 109.704 446.714C109.713 446.72 109.724 446.726 109.733 446.73ZM109.808 438.765C109.809 438.765 109.809 438.765 109.81 438.765C109.81 438.766 109.81 438.767 109.81 438.768C109.81 438.767 109.809 438.766 109.808 438.765ZM321.252 264.481C321.233 264.463 321.222 264.441 321.204 264.423C321.259 264.39 321.313 264.354 321.36 264.303C321.321 264.36 321.295 264.426 321.252 264.481ZM334.801 112.671C334.803 112.708 334.8 112.738 334.804 112.775C334.804 112.777 334.804 112.778 334.804 112.779C334.759 112.755 334.714 112.731 334.668 112.708C334.68 112.706 334.69 112.707 334.701 112.704C334.736 112.691 334.766 112.684 334.801 112.671ZM193.253 22.5558C193.185 22.6009 193.118 22.647 193.05 22.6921C193.05 22.6943 193.05 22.6954 193.05 22.6966C193.05 22.611 193.049 22.5266 193.049 22.441C193.115 22.4827 193.182 22.5266 193.253 22.5558ZM111.71 112.486C111.709 112.483 111.709 112.48 111.708 112.477C111.716 112.475 111.723 112.473 111.73 112.47C111.723 112.475 111.718 112.482 111.71 112.486ZM45.2452 126.417C45.5602 126.351 45.8741 126.242 46.2004 126.068C46.2319 126.247 46.2634 126.425 46.3118 126.619C45.927 126.612 45.5782 126.53 45.2452 126.417ZM83.6435 458.718C83.549 458.88 83.4545 459.044 83.36 459.206C83.3679 459.137 83.3803 459.072 83.3792 459C83.3252 458.821 83.2588 458.658 83.18 458.513C83.3353 458.582 83.4894 458.65 83.6435 458.718ZM123.798 397.857C123.939 397.742 124.077 397.64 124.217 397.53C124.239 397.664 124.265 397.794 124.303 397.909C124.133 397.894 123.969 397.868 123.798 397.857Z" fill="#969696" />
                  </svg>

                </div>
              </div>
            }


          </div>
          <div className="backpack__column">
            <h3>Сундук добычи</h3>
            <div className="backpack__nav">
              <div className="backpack__navItem">Эссенции</div>
              <div className="backpack__navItem">Ускорения</div>
              <div className="backpack__navItem">Вещи</div>
              <div className="backpack__navItem">Квестовые</div>
            </div>
            <div className="backpack__itemsContainer">
              <div className="backpack__slots">
                {
                  BackpackSlots()
                }
              </div>
              <div className="backpack__items">
                {
                  backpack && items.map(item => (
                    <div className="backpack__item"
                      onDragStart={(e) => dragStartHandler(e, item)}
                      onDragLeave={(e) => dragEndHandler(e)}
                      onDragEnd={(e) => dragEndHandler(e)}
                      onDragOver={(e) => dragOverHandler(e)}
                      onDrop={(e) => dropHandler(e, item)}
                      draggable={true}
                      onClick={() => handleClickItemInventory(item)}
                    >
                      <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${item.img}`} alt={item.itemName} />
                      {
                        item.stats &&
                        <div className="backpack__itemStats">
                          {item.stats.dmg && <div>Урон: {item.stats.dmg}</div>}
                          {item.stats.def && <div>Защита: {item.stats.def}</div>}
                        </div>
                      }

                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
