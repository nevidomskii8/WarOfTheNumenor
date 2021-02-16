import getRandomInt from './getRandomInt'

export default function getCountByLvl (lvl) {
  if(lvl === 'Слабый') return getRandomInt(1,9)
}