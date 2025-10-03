import React from 'react'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[url('/assets/images/side-image.jpg')] bg-no-repeat bg-cover h-dvh">
      <div className="w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout