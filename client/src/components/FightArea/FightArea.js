import React, { useState, useEffect } from 'react'
import heroImg from '../../assets/png/hero.png'
import './FightArea.scss'
import getRandomInt from '../../helpers/getRandomInt'
import { getChanceAttack, getChanceMagic } from '../../helpers/getChance'
import config from '../../config/default.json'
import noneImg from '../../assets/png/none.png'
import { useDispatch } from 'react-redux'
import { selectedCreepInLocation, selectLocLvl, selectLocation, fetchLocation } from '../../redux/actions/locationAction'
import { fetchHero } from '../../redux/actions/heroAction'
import {mathCount} from '../../helpers/mathCount'

export default function FightArea({ heroData, creepData }) {
  const dispatch = useDispatch()
  const [hero, setHero] = useState({})
  const [creeps, setCreeps] = useState({})
  const [logs, setLogs] = useState([]) // [[heroDmg,creepDmg], ...]
  const [fightResult, setFightResult] = useState('')
  const [clickCounter, setClickCounter] = useState(0)
  const [heroHpBar, setHeroHpBar] = useState(100)
  const [creepHpBar, setCreepHpBar] = useState(100)
  const [loot, setLoot] = useState([])
  useEffect(() => {
    heroData && setHero(heroData)
  }, [heroData])

  //all creeps
  useEffect(() => {
    creepData.name && setCreeps({
      name: creepData.name,
      hp: creepData.hp * creepData.count,
      dmg: {
        min: creepData.dmg.min * creepData.count,
        max: creepData.dmg.max * creepData.count
      },
      buff: creepData.buff,
      evasion: creepData.evasion,
      buffLoot: creepData.buffLoot,
      loot: creepData.loot,
      crit: {
        chance: creepData.crit.chance,
        dmg: creepData.crit.dmg
      },
      img: creepData.img,
      count: creepData.count
    })

  }, [creepData])

  const prepareLootArr = () => {
    const lootArr = creeps.loot.map(item => {
      if (getChanceMagic(item.chance)) {
        return item
      } else {
        return
      }
    })

    return lootArr
  }

  const handleAttackCreep = () => {
    if (fightResult) return

    //evasion chance
    const isAttackHero = getChanceAttack(creeps.evasion)
    const isAttackCreeps = getChanceAttack(hero.buffHp.evasion)

    let creepHpAfterAttack = creeps.hp;
    let heroDefAfterAttack = hero.def;
    // army Damage
    let allHeroDmg, horsemenDmg, archersDmg, infantryDmg, mageDmg, humanDmg, elfDmg, gnomeDmg, valarDmg, morgoteDmg, critical, surprise;
    //hero attack
    if (isAttackHero) {
      horsemenDmg = getRandomInt(hero.army.horsemen.minDmg * hero.army.horsemen.count, hero.army.horsemen.maxDmg * hero.army.horsemen.count)
      archersDmg = getRandomInt(hero.army.archers.minDmg * hero.army.archers.count, hero.army.archers.maxDmg * hero.army.archers.count)
      infantryDmg = getRandomInt(hero.army.infantry.minDmg * hero.army.infantry.count, hero.army.infantry.maxDmg * hero.army.infantry.count)

      //magic
      mageDmg = getChanceMagic(hero.heroMagic.mage.chance) ? hero.heroMagic.mage.dmg : 0
      humanDmg = getChanceMagic(hero.heroMagic.human.chance) ? hero.heroMagic.human.dmg : 0
      elfDmg = getChanceMagic(hero.heroMagic.elf.chance) ? hero.heroMagic.elf.dmg : 0
      gnomeDmg = getChanceMagic(hero.heroMagic.gnome.chance) ? hero.heroMagic.gnome.dmg : 0
      valarDmg = getChanceMagic(hero.heroMagic.valar.chance) ? hero.heroMagic.valar.dmg : 0
      morgoteDmg = getChanceMagic(hero.heroMagic.morgote.chance) ? hero.heroMagic.morgote.dmg : 0

      const magicDmg = mageDmg + humanDmg + elfDmg + gnomeDmg + valarDmg + morgoteDmg
      allHeroDmg = horsemenDmg + archersDmg + infantryDmg + magicDmg

      critical = getChanceMagic(hero.buffAttack.crit.chance)
      if (critical) {
        allHeroDmg = parseInt((allHeroDmg * hero.buffAttack.crit.dmg) / 100 + allHeroDmg)
      }

      surprise = getChanceMagic(hero.buffAttack.surprise.chance)
      if (surprise) {
        allHeroDmg = parseInt((allHeroDmg * hero.buffAttack.surprise.dmg) / 100 + allHeroDmg)
      }

      creepHpAfterAttack = creepHpAfterAttack - allHeroDmg


      if (creepHpAfterAttack <= 0) {
        setCreeps({ ...creeps, hp: 0 })
        setCreepHpBar(0)
        setLoot(prepareLootArr())
      } else {
        setCreeps({ ...creeps, hp: creepHpAfterAttack })
        setCreepHpBar(parseInt((creepHpAfterAttack / creeps.hp) * 100))
      }

    } else {
      allHeroDmg = 'Промах'
    }


    //creep attack
    let creepDmg;
    if (isAttackCreeps) {
      creepDmg = creepHpAfterAttack > 0 ? getRandomInt(creeps.dmg.min, creeps.dmg.max) : 0  /// if draw(ничья) dmg = 0
      heroDefAfterAttack = hero.def - creepDmg

      if (heroDefAfterAttack <= 0) {
        setHeroHpBar(0)
        setHero({ ...hero, def: 0 })
      } else if (creepDmg === 0) {
        setHero({ ...hero, def: heroDefAfterAttack })
      }
      else {
        setHero({ ...hero, def: heroDefAfterAttack })
        setHeroHpBar(parseInt((heroDefAfterAttack / hero.def) * 100))
      }

    } else {
      creepDmg = 'Промах'
    }


    setLogs([...logs, { allHeroDmg: allHeroDmg, horsemenDmg: horsemenDmg, archersDmg: archersDmg, infantryDmg: infantryDmg, creepDmg: creepDmg, mageDmg: mageDmg, humanDmg: humanDmg, elfDmg: elfDmg, gnomeDmg: gnomeDmg, valarDmg: valarDmg, morgoteDmg: morgoteDmg, critical: critical, surprise: surprise }])

    if (creepHpAfterAttack <= 0) setFightResult('Победа')
    if (heroDefAfterAttack <= 0) setFightResult('Поражение')
    if (heroDefAfterAttack <= 0 && creepHpAfterAttack <= 0) setFightResult('Ничья')
  }

  const handleChangeActiveLvl = (lvl) => {
    dispatch(fetchLocation(lvl))
    dispatch(selectLocLvl(lvl))
    dispatch(selectLocation(''))
    dispatch(selectedCreepInLocation(''))
  }

  const handleStartNewFight = () => {
    dispatch(fetchHero('admin'))
    dispatch(selectLocLvl(''))
    dispatch(selectLocation(''))
    dispatch(selectedCreepInLocation(''))
    setFightResult('')
    setHeroHpBar(100)
    setCreepHpBar(100)
    setLogs([])
  }

  return (
    <div className='fightArea'>
      <h2 className='fightArea__title'>Поле сражения</h2>
      {fightResult &&
        <h3 className={`fightArea__fightResult ${fightResult === 'Поражение' && 'fightArea__fightResult--defeat'}`}>{fightResult}</h3>
      }
      {fightResult &&
        <button className={`fightArea__fightResult fightArea__btnReset ${fightResult === 'Поражение' && 'fightArea__fightResult--defeat'}`} onClick={() => handleStartNewFight()}>Начать новый бой</button>
      }
      <div className="fightArea__fight">
        {hero &&
          <div className="fightArea__hero fightArea__item">
            <div className='fightArea__itemTitle'>
              Оборона:{hero.def}
              <div className="fightArea__hitBar fightArea__hitBar--hero" style={{ 'width': heroHpBar + '%' }}></div>
            </div>
            <img src={heroImg} alt="hero" />
          </div>
        }

        <div className="fightArea__btnContainer">
          <span className='fightArea__vs'>VS</span>
          <button className='fightArea__btnAttack' onClick={() => handleAttackCreep()} disabled={!creepData.name}>Атака</button>
        </div>

        {creepData.name &&
          <>
            <div className="fightArea__creep fightArea__item">
              <div className='fightArea__hpBar fightArea__itemTitle'>
                {creeps.name} Здоровье:{mathCount(creeps.hp)}
                <div className="fightArea__hitBar" style={{ 'width': creepHpBar + '%' }}></div>
              </div>
              <img className="fightArea__creepImg" src={`${config.serverUrl}/api/images/${creeps.img}`} alt={creeps.name} />
            </div>
          </>
        }
        {!creepData.name &&
          <>
            <div className="fightArea__creep fightArea__item">
              <img className="fightArea__creepImg fightArea__creepImg--none" src={noneImg} alt='Поле' />
              <div className="fightArea__btnContainer">
                <button className="fightArea__btnStart" onClick={() => handleChangeActiveLvl('Слабый')}>Поиск равного соперника</button>
              </div>

            </div>
          </>
        }
      </div>
      <div className="fightArea__logsContainer">
        <h3>Логи:</h3>
        <div className="fightArea__logs">
          {
            logs.map((log, index) => (
              <p key={index}>
                <span>
                  Урон всего:
                  {log.critical && <span>Критический урон</span>}
                  {log.critical && log.surprise && <span>+</span>}
                  {log.surprise && <span>Внезапный урон</span>}
                  {log.allHeroDmg}
                </span>
                <span>Урон крипа: {log.creepDmg} </span>
                {log.allHeroDmg > 0 &&
                  <>
                    <span>
                      Урон всадников:{log.horsemenDmg} Урон лучников:{log.archersDmg} Урон пехоты:{log.infantryDmg}
                    </span>
                    {log.mageDmg > 0 && <span>Урон мага:{log.mageDmg}</span>}
                    {log.humanDmg > 0 && <span>Урон человека:{log.humanDmg}</span>}
                    {log.elfDmg > 0 && <span>Урон эльфа:{log.elfDmg}</span>}
                    {log.gnomeDmg > 0 && <span>Урон гнома:{log.gnomeDmg}</span>}
                    {log.valarDmg > 0 && <span>Воля валар:{log.valarDmg}</span>}
                    {log.morgoteDmg > 0 && <span>Воля моргота:{log.morgoteDmg}</span>}
                  </>
                }

              </p>
            ))
          }
        </div>
      </div>
      <div className="fightArea__logsContainer">


        {
          fightResult === 'Победа' &&
          <>
            <h2>Добыча:</h2>
            <div className="fightArea__loot">
              {loot && loot.map(item => (
                <img src={`${config.serverUrl}/api/images/${item.img}`} alt={item.itemName} className='fightArea__lootItem' title={item.itemName} />
              ))}
            </div>
            <button>Забрать все</button>
          </>
        }
      </div>

    </div>
  )
}
