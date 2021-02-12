import React, { useState, useEffect } from 'react'
import creepImg from '../../assets/png/creep.png'
import heroImg from '../../assets/png/hero.png'
import './FightArea.scss'

export default function FightArea({ heroData, creepData, creepsCount }) {
  const [hero, setHero] = useState({})
  const [creeps, setCreeps] = useState({})
  const [logs, setLogs] = useState([]) // [[heroDmg,creepDmg],...]
  const [fightResult, setFightResult] = useState('')
  const [clickCounter, setClickCounter] = useState(0)
  useEffect(() => {
    heroData && setHero(heroData)
  }, [heroData])

  //all creeps
  useEffect(() => {
    creepData && setCreeps({
      name: creepData.name,
      hp: creepData.hp * creepsCount,
      dmg: {
        min: creepData.dmg.min * creepsCount,
        max: creepData.dmg.max * creepsCount
      },
      buff: creepData.buff,
      evasion: creepData.evasion,
      buffLoot: creepData.buffLoot,
      loot: creepData.loot,
      crit: {
        chance: creepData.crit.chance,
        dmg: creepData.crit.dmg
      },
      count: creepsCount
    })

  }, [creepData])

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
  }

  const getChanceAttack = (evasion) => {
    const attackChance = Math.random() * 100;
    let chance;
    if (attackChance >= evasion) {
      chance = true
    }
    if (attackChance < evasion) {
      chance = false
    }
    return chance
  }

  const getChanceMagic = (percents) => {
    const attackChance = Math.random() * 100;
    let chance = false;
    if (attackChance <= percents) {
      chance = true
    } else {
      chance = false
    }
    return chance;
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
      setCreeps({ ...creeps, hp: creepHpAfterAttack })
    } else {
      allHeroDmg = 'Промах'
    }

    let creepDmg;
    if (isAttackCreeps) {
      creepDmg = creepHpAfterAttack > 0 ? getRandomInt(creeps.dmg.min, creeps.dmg.max) : 0  /// if draw(ничья) dmg = 0
      heroDefAfterAttack = hero.def - creepDmg
      setHero({ ...hero, def: heroDefAfterAttack })
    } else {
      creepDmg = 'Промах'
    }


    setLogs([...logs, { allHeroDmg: allHeroDmg, horsemenDmg: horsemenDmg, archersDmg: archersDmg, infantryDmg: infantryDmg, creepDmg: creepDmg, mageDmg: mageDmg, humanDmg: humanDmg, elfDmg: elfDmg, gnomeDmg: gnomeDmg, valarDmg: valarDmg, morgoteDmg: morgoteDmg, critical: critical, surprise: surprise }])

    if (creepHpAfterAttack <= 0) setFightResult('Победа')
    if (heroDefAfterAttack <= 0) setFightResult('Поражение')
    if (heroDefAfterAttack <= 0 && creepHpAfterAttack <= 0) setFightResult('Ничья')
  }

  return (
    <div className='fightArea'>
      <h2 className='fightArea__title'>Поле сражения</h2>
      {fightResult &&
        <h3 className={`fightArea__fightResult ${fightResult === 'Поражение' && 'fightArea__fightResult--defeat'}`}>{fightResult}</h3>
      }
      {fightResult &&
        <button className={`fightArea__fightResult fightArea__btnReset ${fightResult === 'Поражение' && 'fightArea__fightResult--defeat'}`} onClick={() => window.location.reload()}>Начать новый бой</button>
      }
      <div className="fightArea__fight">
        {hero &&
          <div className="fightArea__hero fightArea__item">
            <div className='fightArea__itemTitle'>Оборона:{hero.def}</div>
            <img src={heroImg} alt="hero" />
          </div>
        }

        <div className="fightArea__btnContainer">
          <span className='fightArea__vs'>VS</span>
          <button className='fightArea__btnAttack' onClick={() => handleAttackCreep()}>Атака</button>
        </div>

        {creeps &&
          <>
            <div className="fightArea__creep fightArea__item">
              <div className="fightArea__infoContainer">
                <div className='fightArea__creepInfo fightArea__itemTitle'>{creeps.name} Здоровье:{creeps.hp} </div>
                <img src={creepImg} alt="creep" />
              </div>
              <div className='fightArea__infoContainer'>
                <h3>Кол-во: {creeps.count}</h3>
                <div>Усиление: {creeps.buff}</div>
                <div>Уворот: {creeps.evasion}%</div>
                {creeps.crit && <div>Шанс крита: {creeps.crit.chance}%</div>}
                {creeps.crit && <div>Урон крита: {creeps.crit.dmg}%</div>}
                <div>Увеличение добычи: 0%</div>
                {creeps.dmg && <div>Атака: {creeps.dmg.min} - {creeps.dmg.max}</div>}
                {creepData && <div>Здоровье: {creepData.hp * creepsCount}</div>}
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
    </div>
  )
}
