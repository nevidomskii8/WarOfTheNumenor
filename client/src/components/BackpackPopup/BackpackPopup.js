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


export default function BackpackPopup() {
  const dispatch = useDispatch()
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

  // const sortItems = (a,b) => {
  //   if(a.order>b.order){
  //     return 1
  //   } else {
  //     return -1
  //   }
  // }

  const handleClickItemInventory = (item) => {
    console.log(equipment)
    if(item.type === 'essense') return

    if(item.type === 'weapon') {
      setEquipment({ ...equipment, mag: { ...equipment.mag, weapon: item } })
      setItems(items.filter(it => it.itemName !== item.itemName))
    }
 
    if(item.type === 'helm') {
      setEquipment({ ...equipment, mag: { ...equipment.mag,helm: item } })
      setItems(items.filter(it => it.itemName !== item.itemName))
    }
    if(item.type === 'cuirass') {
      setEquipment({ ...equipment, mag: { ...equipment.mag,cuirass: item } })
      setItems(items.filter(it => it.itemName !== item.itemName))
    }
    if(item.type === 'gloves') {
      setEquipment({ ...equipment, mag: { ...equipment.mag,gloves: item } })
      setItems(items.filter(it => it.itemName !== item.itemName))
    }
    if(item.type === 'ring') {
      setEquipment({ ...equipment, mag: { ...equipment.mag,ring: item } })
      setItems(items.filter(it => it.itemName !== item.itemName))
    }
    if(item.type === 'boots') {
      setEquipment({ ...equipment, mag: { ...equipment.mag,boots: item } })
      setItems(items.filter(it => it.itemName !== item.itemName))
    }
    


  }

  return (
    <div className='backpack'>
      <div className="backpack__modal">
        <button className="backpack__btnClose" onClick={() => dispatch(openBackpack(false))}>close</button>
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

            {activeHero === 'mag' &&
              <div className="backpack__heroItems">
                <div className="backpack__heroItemContainer backpack__heroItemContainer--helm">
                  <span>Шлем</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment.mag && equipment.mag.helm && <img src={`${config.serverUrl}/api/images/${equipment.mag.helm.img}`} alt={equipment.mag.helm.itemName} width="105px" height="105px" />}
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--weapon">
                  <span>Оружие</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment.mag && equipment.mag.weapon && <img src={`${config.serverUrl}/api/images/${equipment.mag.weapon.img}`} alt={equipment.mag.weapon.itemName} width="105px" height="105px" />}
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--gloves">
                  <span>Перчатки</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment.mag && equipment.mag.gloves && <img src={`${config.serverUrl}/api/images/${equipment.mag.gloves.img}`} alt={equipment.mag.gloves.itemName} width="105px" height="105px" />}
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--cuirass">
                  <span>Кираса</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment.mag && equipment.mag.cuirass && <img src={`${config.serverUrl}/api/images/${equipment.mag.cuirass.img}`} alt={equipment.mag.cuirass.itemName} width="105px" height="105px" />}
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--ring">
                  <span>Кольцо</span>
                  <div className="backpack__heroItem">
                    {equipment && equipment.mag && equipment.mag.ring && <img src={`${config.serverUrl}/api/images/${equipment.mag.ring.img}`} alt={equipment.mag.ring.itemName} width="105px" height="105px" />}
                  </div>
                </div>
                <div className="backpack__heroItemContainer backpack__heroItemContainer--boots">
                  <span>Сапоги</span>
                  <div className="backpack__heroItem">
                  {equipment && equipment.mag && equipment.mag.boots && <img src={`${config.serverUrl}/api/images/${equipment.mag.boots.img}`} alt={equipment.mag.boots.itemName} width="105px" height="105px" />}
                  </div>
                </div>
                <div className="backpack__heroSvg">
                  <svg width="318" height="637" viewBox="0 0 318 637" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M296.874 588.408C295.991 586.188 295.109 583.968 294.404 582.198C290.098 582.977 286.111 583.874 282.074 584.383C277.523 584.956 275.093 586.718 276.06 591.82C276.845 595.952 276.388 600.437 271.955 602.068C260.42 606.311 258.388 615.444 258.088 626.079C257.894 632.961 253.184 637.337 246.32 636.98C236.643 636.475 226.971 635.542 217.35 634.354C211.221 633.596 210.215 628.261 209.164 623.406C208.322 619.518 207.675 615.58 207.117 611.64C206.577 607.827 203.922 606.782 200.935 607.589C191.306 610.192 181.722 612.997 172.236 616.076C160.912 619.752 149.922 624.67 137.477 622.614C128.186 621.079 124.972 616.673 126.412 605.831C127.131 600.407 126.865 597.849 120.798 598.208C115.026 598.551 109.231 598.825 103.455 598.7C101.122 598.65 98.6819 597.737 96.5212 596.726C92.4457 594.818 88.7335 591.945 84.5107 590.593C78.9792 588.821 77.0695 585.175 76.8352 579.996C76.1071 563.904 75.4226 547.808 74.7012 531.715C74.4585 526.294 73.4861 525.8 64.1502 526.993C64.1502 535.851 64.0983 544.886 64.1619 553.921C64.2841 571.767 64.3912 589.613 64.6808 607.456C64.7628 612.561 65.3084 617.673 65.9009 622.751C66.4131 627.146 64.2841 629.62 60.4949 630.98C56.4931 632.418 53.5959 630.325 52.0712 627.065C50.5816 623.879 49.2962 620.227 49.2995 616.78C49.3096 603.887 48.1815 590.653 50.6787 578.186C53.7834 562.689 50.4561 547.497 51.7799 532.234C51.9557 530.201 51.4653 528.111 51.3013 526.241C50.7322 525.866 50.4443 525.522 50.1247 525.489C38.9477 524.322 35.6321 519.829 37.4481 508.259C38.6163 500.812 37.7694 499.681 30.1206 498.464C24.5037 497.57 23.1313 495.59 23.7372 489.902C24.2376 485.208 24.4535 480.486 24.8552 474.959C18.8885 474.241 13.1176 473.604 7.36508 472.837C-0.615101 471.772 -1.12056 470.246 1.22429 462.966C7.89062 442.276 14.0046 421.408 20.6057 400.697C21.8894 396.668 23.8058 392.556 26.4368 389.293C34.5258 379.267 43.1872 369.704 51.4134 359.784C52.8712 358.027 54.0963 355.428 54.0963 353.217C54.1047 331.431 52.7959 309.75 50.1447 288.074C48.6367 275.748 49.82 263.097 49.7196 250.592C49.6376 240.54 49.4234 230.492 49.3146 220.441C49.2661 215.961 49.097 211.59 43.9102 209.342C43.2608 210.647 42.752 212.06 41.9118 213.231C41.321 214.056 40.3453 214.726 39.3963 215.107C39.0414 215.249 37.7393 214.27 37.7945 213.984C38.0289 212.787 38.4339 211.535 39.1168 210.535C40.1076 209.086 41.7043 207.998 42.4993 206.475C45.6944 200.352 40.5846 199.141 36.6832 197.319C37.3811 196.505 37.987 195.798 38.5929 195.091C36.8757 194.662 35.1601 194.23 32.3534 193.527C36.5276 191.98 39.2272 186.986 43.7194 192.985C44.0625 191.678 44.737 190.581 44.5144 189.717C42.1997 180.739 41.0432 172.703 46.6517 163.508C49.7698 158.396 47.8284 149.366 46.3471 142.494C44.2232 132.64 42.6365 122.987 44.486 112.985C44.5897 112.427 44.64 111.852 44.6467 111.284C44.7487 102.473 44.8877 93.6616 44.8927 84.8506C44.8944 83.169 44.7588 81.2817 44.0123 79.8375C40.1444 72.3587 41.1737 65.562 45.1571 58.2855C46.4576 55.9118 45.3663 51.0842 43.686 48.4531C39.182 41.3989 38.8373 36.9959 44.5546 30.5335C47.6844 26.9964 48.9932 23.7836 45.8199 19.5945C45.0383 18.5632 44.7839 16.6609 45.1036 15.3587C46.2266 10.8103 47.7062 6.34374 49.6008 0C52.7591 5.62662 55.0286 9.78222 57.4086 13.8726C59.3049 17.1323 62.0548 20.0877 63.1544 23.578C65.1009 29.7596 65.9662 36.2738 67.5043 42.5958C68.7328 47.6424 70.5186 52.5602 71.5915 57.6336C72.0618 59.8551 72.2961 63.2585 71.0341 64.5072C66.7261 68.7681 67.6231 73.4252 68.7077 78.2812C70.4718 86.1695 69.814 93.466 65.5595 100.717C61.9326 106.897 58.7057 113.049 61.2899 121.409C63.2297 127.685 61.4037 135.084 61.5075 141.979C61.6079 148.577 61.8891 155.185 62.4648 161.754C62.5602 162.843 64.4214 164.262 65.7352 164.68C76.2661 168.03 77.759 171.731 71.8091 181.145C70.1672 183.743 70.0818 185.483 71.8861 188.238C73.5296 190.75 73.8811 194.215 74.3916 197.328C75.1247 201.786 75.1113 206.4 76.2142 210.746C76.5824 212.197 79.3976 213.967 81.1014 213.975C87.346 214.004 93.7847 212.21 99.7966 213.215C109.946 214.91 113.782 210.477 116.738 201.605C118.666 195.82 123.625 191.036 127.257 185.826C128.01 184.746 129.096 183.858 129.682 182.706C131.953 178.231 133.589 174.699 131.609 168.491C128.383 158.379 130.069 147.205 133.652 136.742C136.348 128.871 138.74 120.89 141.055 112.897C142.796 106.887 138.007 99.1645 130.402 95.141C125.699 92.6536 120.674 90.5859 116.443 87.455C113.196 85.0529 108.115 80.1032 108.841 78.3581C110.599 74.1323 114.691 69.8429 118.91 67.9173C125.009 65.134 131.983 63.9087 138.717 62.9793C143.925 62.2605 146.069 59.4807 147.868 55.1044C150.13 49.5982 152.926 44.2875 155.832 39.0821C156.788 37.372 158.789 36.2354 160.338 34.8663C163.663 31.9243 167.971 29.5874 170.172 25.9667C179.762 10.1884 194.479 6.68641 211.374 7.20127C216.995 7.37344 222.646 6.63794 229.003 6.27687C227.49 9.34426 225.888 13.6102 223.429 17.3078C220.726 21.3698 217.399 25.0624 214.048 28.6396C208.994 34.0355 209.626 37.3921 216.517 40.533C217.963 41.1917 219.218 42.2698 221.459 43.7475C217.817 46.8216 214.83 49.3457 212.744 51.1059C215.195 59.3252 217.258 66.249 219.586 74.0604C220.232 74.0955 221.834 74.2459 223.436 74.2643C234.703 74.3914 244.243 78.4283 251.521 87.0922C256.128 92.5784 255.482 95.92 249.191 99.3551C246.772 100.676 243.857 101.164 241.113 101.797C236.429 102.877 231.702 103.771 226.992 104.744C226.994 105.445 226.998 106.147 226.999 106.847C229.778 107.385 232.584 108.494 235.331 108.362C246.99 107.798 257.308 111.994 266.682 117.978C270.607 120.484 272.813 125.771 275.612 129.922C279.592 135.824 283.64 141.704 287.225 147.847C293.216 158.114 297.885 168.508 296.625 181.232C294.891 198.75 294.688 216.421 293.883 234.028C293.825 235.327 293.877 236.804 294.426 237.933C299.005 247.322 297.715 257.064 296.93 266.97C295.729 282.09 295.47 297.28 294.516 312.423C294.148 318.28 292.462 324.07 292.293 329.919C292.039 338.75 292.524 347.608 292.809 356.451C293.139 366.648 294.342 376.876 293.848 387.026C292.493 414.842 298.667 441.773 302.359 469.015C304.5 484.812 305.887 500.709 307.621 516.561C307.787 518.072 307.46 519.997 308.265 521.024C314.989 529.586 311.887 540.01 313.963 549.421C314.98 554.031 316.723 558.488 317.638 563.113C319.014 570.067 316.51 572.63 309.38 572.056C307.487 571.904 305.616 571.291 303.733 571.281C301.097 571.266 296.55 570.928 296.183 571.943C295.142 574.819 295.54 578.343 295.897 581.553C296.136 583.712 297.268 585.772 297.999 587.876C297.626 588.05 297.249 588.229 296.874 588.408ZM62.2841 243.531C63.0807 253.184 63.9494 262.398 64.5753 271.629C65.4574 284.642 66.1453 297.669 66.9604 310.688C67.029 311.793 67.1395 313.126 67.7822 313.894C68.311 314.526 69.9061 314.942 70.5689 314.591C71.2015 314.255 71.7187 312.613 71.4291 311.888C70.999 310.81 69.814 310.031 69.3454 309.539C70.7597 307.866 72.8836 306.502 72.8166 305.252C72.2894 295.277 71.5513 285.301 70.4149 275.38C70.0467 272.171 66.6993 268.637 67.4742 266.086C69.9362 257.977 67.8993 250.406 67.0223 242.266C65.2716 242.732 64.018 243.068 62.2841 243.531Z" fill="#969696" />
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
