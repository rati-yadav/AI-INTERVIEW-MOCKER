"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
  const path = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/questions', label: 'Questions' },
    { href: '/dashboard/upgrade', label: 'Upgrade' },
    { href: '/dashboard/how', label: 'How it Works?' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
      <Image src={'/logo.svg'} width={160} height={100} alt='logo' />
      <ul className='hidden md:flex gap-6'>
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`transition-all hover:text-primary hover:font-bold ${
                path === item.href ? 'text-primary font-bold' : 'text-gray-700'
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <UserButton />
    </div>
  )
}

export default Header