"use client"

import React, { Component, Fragment } from 'react'
import Matter from 'matter-js'
import Floor from './Floor'
import Image from 'next/image'

export class Game extends Component {

    constructor(props) {
        super(props)
        this.divRef = React.createRef()
        this.windowRef = typeof window != "undefined" && window
        this.floor_y = this.windowRef.innerHeight
        this.ground_width = 151
        this.ground_height = 151
        this.enemyHeight = (this.windowRef.innerHeight /2) - 50
        this.enemyBottomHeight = this.enemyHeight + 180
        this.choice = 1
        this.state = {
            didCollide : false,
            count: 0,
            tries: 3
        }
        this.player = null
        this.gameEngine = null
    }

    generateRandomNumber(max, min){
        return Math.round(Math.random()* (max - min) + min)
    }
    
    componentDidMount(){
        var Engine = Matter.Engine,
        World = Matter.World,
        Render = Matter.Render;
        
        const engine = this.gameEngine = Engine.create({})
        engine.gravity.y = 0.4
        const Hurdle_Array = [["hurdle_1.png","Collision_Ground"],["hurdle_1.png","Collision_Ground"], ["hurdle_3.png","No_Collision_Ground"]]
        let offset = 0

        for (let i = 0; i < 500; i++) { 
            let choice = this.generateRandomNumber(Hurdle_Array.length - 1,0)
            let ground = Floor(offset, this.floor_y, this.ground_width, this.ground_height,`assets/Mobile_Size/${Hurdle_Array[choice][0]}`, `${Hurdle_Array[choice][1]}`)
            offset+=250
            World.add(engine.world, [ground])
            
        }



        let spawnEnemy = setInterval(()=>{
            let enemy = Matter.Bodies.circle(this.windowRef.innerWidth + 200, this.enemyHeight, 30, {
                render:{
                    sprite: {
                        texture: "assets/0.5x/Green.png"
                    }
                },
                label: "virus"
            })
            World.add(engine.world, [enemy])
        },2000)

        let spawnBottomEnemy = setInterval(()=>{
                let enemy = Matter.Bodies.circle(this.windowRef.innerWidth + 200, this.enemyBottomHeight, 15, {
                    render:{
                        sprite: {
                            texture: "assets/0.5x/orangeVirus.png"
                        }
                    },
                    label: "virus_bottom"
                })
                World.add(engine.world, [enemy])
        },5000)

        let spawnTopEnemy = setInterval(()=>{
            let enemy = Matter.Bodies.circle(this.windowRef.innerWidth + 200, this.enemyHeight - 150, 15, {
                render:{
                    sprite: {
                        texture: "assets/0.5x/dual.png"
                    }
                },
                label: "virus_top"
            })
            World.add(engine.world, [enemy])
        },7000)

        let collision = null

        let moveEnemy = setInterval(()=>{
            engine.world.bodies.map((body)=>{
                if (body.label === "virus") {
                    body.force.x = -0.001
                    body.position.y = this.enemyHeight
                    collision = Matter.Collision.collides(this.player, body)
                    if (collision?.collided) {
                        this.setState({didCollide: true})
                        console.log("collision");
                        engine.world.bodies.forEach(body => body.isStatic = true) 
                        clearInterval(moveFloor)
                        clearInterval(moveEnemy)
                        clearInterval(spawnEnemy)
                        clearInterval(spawnBottomEnemy)
                        clearInterval(spawnTopEnemy)

                    }
                }
                if (body.label === "virus_bottom") {
                    body.position.x -= 0.01
                    body.position.y = this.enemyBottomHeight                    
                    
                    collision = Matter.Collision.collides(this.player, body)
                    if (collision?.collided) {
                        this.setState({didCollide: true})
                        console.log("collision");
                        engine.world.bodies.forEach(body => body.isStatic = true) 
                        clearInterval(moveFloor)
                        clearInterval(moveEnemy)
                        clearInterval(spawnEnemy)
                        clearInterval(spawnBottomEnemy)
                        clearInterval(spawnTopEnemy)

                    }
                }
                if (body.label === "virus_top") {
                    body.position.x -= 0.01
                    body.position.y = this.enemyHeight - 150                  
                    
                    collision = Matter.Collision.collides(this.player, body)
                    if (collision?.collided) {
                        this.setState({didCollide: true})
                        engine.world.bodies.forEach(body => body.isStatic = true) 
                        clearInterval(moveFloor)
                        clearInterval(moveEnemy)
                        clearInterval(spawnEnemy)
                        clearInterval(spawnBottomEnemy)
                        clearInterval(spawnTopEnemy)
                    }
                }

                if (body.label === "virus_top" || body.label === "virus_bottom" || body.label === "virus") {
                    if (body.position.x < -100) {
                        World.remove(engine.world, body)
                        this.setState({count: this.state.count +1})
                    }
                }
            })
        }, 1)
        

        
        this.player = Matter.Bodies.rectangle(100, 100, 84, 90, {
            label: "this.player",
            render:{
                sprite: {
                    texture: "assets/0.5x/Player.png"
                }
            },
            isStatic : false,
            friction:0,
        })
        World.add(engine.world, [this.player])


        this.windowRef.addEventListener("keypress", (e)=> {
            if (e.key === " ") {
                this.player.force.y = -0.2
            }
        })
        this.windowRef.addEventListener("click", (e)=> {
                this.player.force.y = -0.2
        })
        this.windowRef.addEventListener("touchstart", ()=> {
                this.player.force.y = -0.2
        })

        



        let moveFloor = setInterval(()=> {
            engine.world.bodies.forEach((body)=>{
                if (body.label === "No_Collision_Ground" || body.label === "Collision_Ground" || body.label === "Collision_Ground") {
                    body.position.x -= 0.05
                    if (body.position.x < -250) {
                        World.remove(engine.world, body)
                        console.log(engine.world.bodies);
                    }

                    collision = Matter.Collision.collides(this.player, body)
                    if (collision?.collided) {
                        console.log("collision");
                        engine.world.bodies.forEach(body => body.isStatic = true) 
                        this.setState({didCollide: true})
                        clearInterval(moveFloor)
                        clearInterval(moveEnemy)
                        clearInterval(spawnEnemy)
                        clearInterval(spawnBottomEnemy)
                        clearInterval(spawnTopEnemy)

                    }

                    body.position.y = this.floor_y              
                }
            })  
            if (this.player.position.y < -100) {
                engine.world.bodies.forEach(body => body.isStatic = true) 
                this.setState({didCollide: true})
                clearInterval(moveFloor)
                clearInterval(moveEnemy)
                clearInterval(spawnEnemy)
                clearInterval(spawnBottomEnemy)
                clearInterval(spawnTopEnemy)

            }          
        },1)    



        const render = Render.create({
            element: this.divRef.current,
            engine: engine,
            options: {
              width: this.windowRef.innerWidth,
              height: this.windowRef.innerHeight,
              wireframes: false,
              background: "white",
            }
          });



    Matter.Runner.run(engine);
    Render.run(render);


    }


    render() {
        return (
            <>
                <Fragment>
                    <div className='fixed inset-0 pl-4 h-10 flex flex-1 '>Score: {this.state.count}</div>
                    <div className='-z-50 w-screen h-screen' ref={this.divRef}></div>
                    {
                this.state.didCollide ? (
                    <div className={`fixed inset-0 bg-blue-300 rounded-lg bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center m-auto`}>
                        <Image alt='winner' src="/assets/Mobile_Size/asset_WIN.png" width={100} height={100}/>
                        <span className='text-3xl text-yellow-600'>Your Score: {this.state.count}</span>
                        <span className='text-3xl text-yellow-600'>Tries Left: {this.state.tries}</span>
                        <button className='border border-purple-400 h-10 rounded-md w-36 bg-purple-600 font-bold text-white' onClick={()=> {
                            this.setState({tries: this.state.tries - 1})
                            this.windowRef.location.reload()
                            
                        }
                            }>Play Again</button>
                    </div>
                ) : (null)}
                </Fragment> 
            </>
        )
    }
}

export default Game