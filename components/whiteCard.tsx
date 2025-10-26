"use client";
import React from 'react';

export default function Card( {title, text} : {title: string, text: string}) {
    return (
         
        <div className="py-10 text-center my-5 rounded-lg shadow-lg p-6">
            <p className='font-bold text-lg mb-3 text-gray-800'>{title}</p>
            <p className='text-gray-600 text-sm'>{text}</p>
        </div>
    );
}