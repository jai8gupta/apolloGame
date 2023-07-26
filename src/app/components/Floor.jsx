import React from 'react'
import Matter from 'matter-js'

const Floor = (x, y, height, width, img_source, label) => {

    let floor = Matter.Bodies.rectangle(x, y, height, width, {
        render:{
            sprite:{
                texture: img_source
            }
        
        },
        friction:0,
       
        label: label,
        // density: 1        
    })
    
   
    return floor
}

export default Floor