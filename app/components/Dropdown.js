"use client"
import React from 'react'
import Link from 'next/link'
import { useRef, useEffect } from 'react'

const Dropdown = () => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                dropdownRef.current.removeAttribute('open');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function deleteALL() {
        const ans = confirm("Are you sure you want to delete all registered vehicles? This action cannot be undone.")
        if (ans) {
            localStorage.removeItem("car.me")
            alert("All registered vehicles have been deleted.")
            window.location.reload()
        }
    }

    return (
        <div className="relative inline-block mr-1 w-50 text-center">
            <details className="Dropdown-wrapper" ref={dropdownRef}>
                <summary className="list-none cursor-pointer px-4 py-2 bg-white border border-amber-600 rounded-md shadow-sm hover:bg-gray-50 flex items-center gap-1 flex-row text justify-center">
                    Menu
                </summary>

                <button onClick={deleteALL}>Delete all cars</button>

            </details>
        </div>
    )
}

export default Dropdown
