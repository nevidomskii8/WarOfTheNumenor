export const getChanceAttack = (evasion) => {
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

export const getChanceMagic = (percents) => {
  const attackChance = Math.random() * 100;
  let chance = false;
  if (attackChance <= percents) {
    chance = true
  } else {
    chance = false
  }
  return chance;
}