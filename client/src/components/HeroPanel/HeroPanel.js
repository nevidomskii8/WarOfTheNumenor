import React from 'react'
import './HeroPanel.scss'
export default function HeroPanel({ hero }) {
  const armyCount = hero && hero.army.horsemen.count + hero.army.archers.count + hero.army.infantry.count

  return (
    <>
      {
        hero &&
        <div className='heroPanel'>
          <h2>Имя: {hero.login}</h2>
          <div className="heroPanel__container">
            <p>Мощь:{hero.power}</p>
            <p>Уровень:{hero.level}</p>
          </div>
          <div className="heroPanel__container">
            <p>Урон армии:{hero.attack.minDmg} - {hero.attack.maxDmg}</p>
            <p>Защита:{hero.def}</p>
          </div>
          <div className="heroPanel__army heroPanel__infoContainer">
            <h3 className="heroPanel__title">Войско:</h3>
            <p>Кол-во: {armyCount}</p>
            <p>Атака: {armyCount * 1} - {armyCount * 3}</p>
            <p>Здоровье: {hero.army.horsemen.minionHp}</p>
            <p>Всадники: {hero.army.horsemen.count} Урон:{hero.army.horsemen.minDmg} - {hero.army.horsemen.maxDmg} Здоровье: {hero.army.horsemen.minionHp}</p>
            <p>Лучники: {hero.army.archers.count} Урон:{hero.army.archers.minDmg} - {hero.army.archers.maxDmg} Здоровье: {hero.army.archers.minionHp}</p>
            <p>Пехота: {hero.army.infantry.count} Урон:{hero.army.infantry.minDmg} - {hero.army.infantry.maxDmg} Здоровье: {hero.army.infantry.minionHp}</p>
          </div>
          <div className="heroPanel__magic heroPanel__infoContainer">
            <h3 className="heroPanel__title">Магия и способности героев:</h3>
            <p>Маг: {hero.heroMagic.mage.chance}% урон {hero.heroMagic.mage.dmg}</p>
            <p>Человек: {hero.heroMagic.human.chance}% урон {hero.heroMagic.human.dmg}</p>
            <p>Эльф: {hero.heroMagic.elf.chance}% урон {hero.heroMagic.elf.dmg}</p>
            <p>Гном: {hero.heroMagic.gnome.chance}% урон {hero.heroMagic.gnome.dmg}</p>
            <p>Воля Валар: {hero.heroMagic.valar.chance}% урон {hero.heroMagic.valar.dmg}</p>
            <p>Воля Моргота: {hero.heroMagic.morgote.chance}% урон {hero.heroMagic.morgote.dmg}</p>
          </div>
          <div className="heroPanel__buffAttack heroPanel__infoContainer">
            <h3 className="heroPanel__title">Усиление атаки:</h3>
            <p>Крит шанс: {hero.buffAttack.crit.chance}% </p>
            <p>Крит урон: {hero.buffAttack.crit.dmg}%</p>
            <p>Шанс внезапности: {hero.buffAttack.surprise.chance}%</p>
            <p>Урон внезапности: {hero.buffAttack.surprise.dmg}%</p>
          </div>
          <div className="heroPanel__buffHp heroPanel__infoContainer">
            <h3 className="heroPanel__title">Усиление здоровья:</h3>
            <p>Защита: {hero.buffHp.def}% ув. здор.</p>
            <p>Броня: {hero.buffHp.armour}% к (здор.+защ.)</p>
            <p>Уворот: {hero.buffHp.evasion}%</p>
          </div>
        </div>
      }
    </>
  )
}
