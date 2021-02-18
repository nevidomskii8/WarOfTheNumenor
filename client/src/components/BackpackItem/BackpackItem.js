import React from 'react'
import { useDrag } from 'react-dnd'
import config from '../../config/default.json'
const ItemTypes = {
  ITEM: 'item'
}



export default function BackpackItem({ isDragging, text,item }) {
  const [{ opacity }, dragRef] = useDrag({
    item: { type: ItemTypes.ITEM, text },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1
    })
  })
  
  return (
    <div ref={dragRef} style={{ opacity,cursor: 'pointer' }} >
      {item && <img className='backpack__itemImg' src={`${config.serverUrl}/api/images/${item.img}`} alt={item.itemName} />}
    </div>
  )
}


