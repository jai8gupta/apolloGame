"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

const Win = ({count, windowRef}) => {
    const [username, setUsername] = useState("");
    const [number, setNumber] = useState("");
    const [mes, setRes] = useState("");


    const postData = async() =>{
        try {
            await fetch("http://localhost:3001/win",{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify({
                    username: username,
                    number: number,
                    score: `${count}`,
                })
            }).then(response => response.json())
            .then((solvedResponse)=> setRes(solvedResponse))
            
        } catch (error) {
            console.log(error);
        }
    }
    
    
    return (
        <div className={`fixed inset-0 bg-blue-300 rounded-lg bg-opacity-25 backdrop-blur-sm flex flex-col justify-center items-center m-auto`}>
            <div className='mt-72'>
            <Image alt='winner' src="/assets/Mobile_Size/asset_WIN.png" width={100} height={100} />
            <span className='text-3xl text-yellow-600'>Your Score: {count}</span>
            <div className='flex flex-col h-[30rem] space-y-5  justify-center items-center '>
                <input key="name" onChange={(e)=>{
                    setUsername(e.target.value)
                }} placeholder='Name' className='w-72 h-12 pl-6 rounded-lg appearance-none outline-none' type='text' />
                <input key="number" onChange={(e)=>{
                    setNumber(e.target.value)
                }} placeholder='Number' className='w-72 h-12 pl-6 rounded-lg border appearance-none outline-none' type='number' />
                <span className='text-red-500 text-lg'>{mes.message}</span>
            </div>
            <div className='mb-72'>
            <button className='border mb-10 border-red-400 h-10 rounded-md w-36 bg-red-600 font-bold text-white' onClick={() => {
                postData()
            }
            } disabled={mes ? true : false}>Submit</button>


            <button className='border border-purple-400 h-10 rounded-md w-36 bg-purple-600 font-bold text-white' onClick={() => {
                windowRef.location.reload()
            }
            }>Play Again</button>
            </div>

            </div>
            
        </div>
    )
}

export default Win
