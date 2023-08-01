"use client"

import React, { Component, Fragment } from 'react'
import Matter from 'matter-js'
import Floor from './Floor'
import Win from './Win.js'
export class Game extends Component {

    constructor(props) {
        super(props)
        this.divRef = React.createRef()
        this.windowRef = typeof window != "undefined" && window
        this.floor_y = this.windowRef.innerHeight
        this.ground_width = 151
        this.ground_height = 151
        this.enemyHeight = (this.windowRef.innerHeight / 2) - 50
        this.enemyBottomHeight = this.enemyHeight + 180
        this.choice = 1
        this.state = {
            didCollide: false,
            count: 0,
            chances: 0,
        }
        this.player = null
        this.gameEngine = null
    }



    generateRandomNumber(max, min) {
        return Math.round(Math.random() * (max - min) + min)
    }
    updateStorage() {
        let setval = Number(localStorage.getItem("chances")) - 1
        this.setState({
            chances: setval
        })
        localStorage.setItem("chances", setval)
    }

    componentDidMount() {
        let chanceToPlay = localStorage.getItem("chances");
        this.setState({chances: localStorage.getItem("chances")});
        let date = localStorage.getItem("dates")
        if (chanceToPlay === "undefined" || chanceToPlay === "NaN" || Number(chanceToPlay) < 0) {
            localStorage.setItem("chances", "3")
        }
        if (date === "" || !date) {
            localStorage.setItem("dates", new Date())
        } else {
            let currDate = new Date()
            if (date.slice(8, 10) != currDate.toString().slice(8, 10)) {
                this.setState({
                    chances: 3
                })
                localStorage.setItem("chances", "3")
                localStorage.setItem("dates", currDate)
            }
        }


        var Engine = Matter.Engine,
            World = Matter.World,
            Render = Matter.Render;

        const engine = this.gameEngine = Engine.create({})
        engine.gravity.y = 0.4
        const Hurdle_Array = [["hurdle_1.png", "Collision_Ground"], ["hurdle_1.png", "Collision_Ground"], ["hurdle_3.png", "No_Collision_Ground"]]
        let offset = 0

        for (let i = 0; i < 500; i++) {
            let choice = this.generateRandomNumber(Hurdle_Array.length - 1, 0)
            let ground = Floor(offset, this.floor_y, this.ground_width, this.ground_height, `assets/Mobile_Size/${Hurdle_Array[choice][0]}`, `${Hurdle_Array[choice][1]}`)
            offset += 250
            World.add(engine.world, [ground])

        }



        let spawnEnemy = setInterval(() => {
            let enemy = Matter.Bodies.circle(this.windowRef.innerWidth + 200, this.enemyHeight, 30, {
                render: {
                    sprite: {
                        texture: "assets/0.5x/Green.png"
                    }
                },
                label: "virus"
            })
            World.add(engine.world, [enemy])
        }, 2000)

        let spawnBottomEnemy = setInterval(() => {
            let enemy = Matter.Bodies.circle(this.windowRef.innerWidth + 200, this.enemyBottomHeight, 15, {
                render: {
                    sprite: {
                        texture: "assets/0.5x/orangeVirus.png"
                    }
                },
                label: "virus_bottom"
            })
            World.add(engine.world, [enemy])
        }, 5000)

        let spawnTopEnemy = setInterval(() => {
            let enemy = Matter.Bodies.circle(this.windowRef.innerWidth + 200, this.enemyHeight - 150, 15, {
                render: {
                    sprite: {
                        texture: "assets/0.5x/dual.png"
                    }
                },
                label: "virus_top"
            })
            World.add(engine.world, [enemy])
        }, 7000)

        let collision = null

        let moveEnemy = setInterval(() => {
            engine.world.bodies.map((body) => {
                if (body.label === "virus") {
                    body.force.x = -0.001
                    body.position.y = this.enemyHeight
                    collision = Matter.Collision.collides(this.player, body)
                    if (collision?.collided) {
                        this.setState({ didCollide: true })
                        this.updateStorage()
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
                        this.setState({ didCollide: true })
                        this.updateStorage()
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
                        this.setState({ didCollide: true })
                        this.updateStorage()
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
                        this.setState({ count: this.state.count + 1 })
                    }
                }
            })
        }, 1)



        this.player = Matter.Bodies.circle(100, 100, 42, {
            label: "this.player",
            render: {
                sprite: {
                    texture: "assets/0.5x/Player.png"
                }
            },
            isStatic: false,
            friction: 0,
        })
        World.add(engine.world, [this.player])


        this.windowRef.addEventListener("keypress", (e) => {
            if (e.key === " ") {
                this.player.force.y = -0.2
            }
        })
        this.windowRef.addEventListener("click", (e) => {
            this.player.force.y = -0.2
        })
        this.windowRef.addEventListener("touchstart", () => {
            this.player.force.y = -0.2
        })





        let moveFloor = setInterval(() => {
            engine.world.bodies.forEach((body) => {
                if (body.label === "No_Collision_Ground" || body.label === "Collision_Ground" || body.label === "Collision_Ground") {
                    body.position.x -= 0.05
                    if (body.position.x < -250) {
                        World.remove(engine.world, body)
                    }

                    collision = Matter.Collision.collides(this.player, body)
                    if (collision?.collided) {
                        engine.world.bodies.forEach(body => body.isStatic = true)
                        this.setState({ didCollide: true })
                        this.updateStorage()
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
                this.setState({ didCollide: true })
                this.updateStorage()
                clearInterval(moveFloor)
                clearInterval(moveEnemy)
                clearInterval(spawnEnemy)
                clearInterval(spawnBottomEnemy)
                clearInterval(spawnTopEnemy)

            }
        }, 1)



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
                    <div className='fixed inset-0 pl-4 space-x-10 h-16 w-96 flex flex-1 align-middle  bg-blue-300 border rounded-md text-black'>
                        <span className='text-white '>Score: {this.state.count} </span>
                        <span className='text-white '>Tries : {!!!this.state.chances ? "" : this.state.chances}</span>

                        <button className='w-36 h-10 rounded-xl bg-amber-300 align-middle justify-center'>
                            <span class="absolute -top-0 h-3 w-3">
                                <span class="animate-ping absolute left-[5.7rem] -top-0 inline-flex h-5 w-5 rounded-full bg-purple-400 opacity-75"></span>
                                <span class="relative inline-flex left-24 rounded-full h-3 w-3 bg-purple-500"></span>
                            </span>
                            Play Again
                            </button>
                        
                    </div>
                    <div className='-z-50 w-screen h-screen' ref={this.divRef}></div>
                    {
                        this.state.didCollide && (this.state.chances === 0) ? (
                            <Win count={this.state.count} windowRef={this.windowRef} />
                        ) : (null)}
                </Fragment>
            </>
        )
    }
}

export default Game