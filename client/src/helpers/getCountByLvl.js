import getRandomInt from './getRandomInt'

export default function getCountByLvl (lvl) {
  if(lvl === 'Слабый') return [1,9]
  if(lvl === 'Обычный') return [10,99]
  if(lvl === 'Средний') return [100,999]
  if(lvl === 'Сильный') return [1000,9999]
  if(lvl === 'Мощный') return [10000,99999]
  if(lvl === 'Великий') return [100000,999999]
  if(lvl === 'Эпический') return [1000000,9999999]
  if(lvl === 'Невероятный') return [10000000,99999999]
  if(lvl === 'Легендарный') return [100000000,999999999]
}