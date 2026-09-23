import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { useToast } from '../components/Toast'

function UserIcon() {
  return <svg className="h-[17px] w-[17px] fill-none stroke-[#c6d1df] stroke-[1.8]" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 19c.9-3.1 3.4-4.7 7.5-4.7s6.6 1.6 7.5 4.7" /></svg>
}

function MailIcon() {
  return <svg className="h-[17px] w-[17px] fill-none stroke-[#c6d1df] stroke-[1.8]" aria-hidden="true" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="14" rx="2" /><path d="m4.5 7 7.5 6 7.5-6" /></svg>
}

function LockIcon() {
  return <svg className="h-[17px] w-[17px] fill-none stroke-[#c6d1df] stroke-[1.8]" aria-hidden="true" viewBox="0 0 24 24"><rect x="4.5" y="10" width="15" height="10" rx="2" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></svg>
}

function EyeIcon({ hidden }) {
  return <svg className="h-[17px] w-[17px] fill-none stroke-[#b7c2d3] stroke-[1.8]" aria-hidden="true" viewBox="0 0 24 24"><path d="M2.8 12s3.2-5 9.2-5 9.2 5 9.2 5-3.2 5-9.2 5-9.2-5-9.2-5Z" /><circle cx="12" cy="12" r="2.2" />{hidden && <path d="m4 4 16 16" />}</svg>
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function RegisterPage() {
  const { onAuthenticated } = useOutletContext()
  const { showToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setMessage('')
    if (form.get('password') !== form.get('confirmPassword')) {
      setMessage('Passwords do not match')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: form.get('userName'),
          email: form.get('email'),
          password: form.get('password'),
          confirmPassword: form.get('confirmPassword'),
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to create account')
      onAuthenticated(data.token, data.message)
    } catch (error) {
      setMessage(error.message)
      showToast(error.message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-[minmax(380px,46%)_1fr] bg-[#081522] text-[#f4f7ff] max-[760px]:block">
      <section className="relative grid min-h-screen place-items-center overflow-hidden border-r border-[rgba(110,139,177,.2)] bg-[radial-gradient(circle_at_53%_37%,#10253b_0,#091625_34%,#050d17_83%)] max-[760px]:min-h-[390px]" aria-label="ChatAI introduction">
        <div className="relative z-[2] -mt-12 text-center max-[760px]:-mt-5 max-[760px]:scale-[.84]">
          <div className="robot" aria-hidden="true"><div className="antenna"><span /></div><div className="robot-ear robot-ear-left" /><div className="robot-ear robot-ear-right" /><div className="robot-head"><div className="robot-face"><span /><span /></div></div></div>
          <h1 className="mb-2 mt-[22px] text-[clamp(2.6rem,4vw,3.7rem)] font-extrabold leading-none tracking-[-2.5px]">Chat<span className="text-[#5854ff] [text-shadow:0_0_20px_rgba(88,84,255,.45)]">AI</span></h1>
          <p className="m-0 text-[clamp(1rem,1.45vw,1.25rem)] font-semibold">Your personal AI assistant</p>
          <p className="mt-[22px] text-[.8rem] leading-[2.35] text-[#a6b1c1]">Ask anything, get instant answers.<br />Smarter. Faster. Together.</p>
        </div>
        <div className="wave wave-one" /><div className="wave wave-two" />
      </section>

      <section className="relative grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_80%_42%,#10243a,#091623_66%)] max-[760px]:min-h-[510px] max-[760px]:py-[54px] max-[760px]:pb-[70px]">
        <div className="w-[min(calc(100%-64px),390px)] py-8 max-[760px]:w-[min(calc(100%-44px),390px)]">
          <header><h2 className="m-0 text-2xl tracking-[-.5px]">Create Account</h2><p className="mb-[25px] mt-2 text-[.82rem] text-[#97a5b8]">Sign up to get started with ChatAI</p></header>
          <form onSubmit={handleSubmit}>
            <label className="mb-[9px] flex h-[46px] items-center rounded-[9px] border border-[#1b3551] bg-[rgba(18,40,62,.68)] px-3 shadow-[inset_0_1px_rgba(255,255,255,.03)] transition focus-within:border-[#5d66ff] focus-within:shadow-[0_0_0_3px_rgba(93,102,255,.12)]"><span className="mr-2.5 grid w-5 place-items-center"><UserIcon /></span><span className="sr-only">User name</span><input className="min-w-0 flex-1 border-0 bg-transparent text-[.76rem] text-[#e9effa] outline-none ring-0 placeholder:text-[#b8c2d0] focus:border-0 focus:outline-none focus:ring-0" name="userName" type="text" placeholder="User name" required autoComplete="name" /></label>
            <label className="mb-[9px] flex h-[46px] items-center rounded-[9px] border border-[#1b3551] bg-[rgba(18,40,62,.68)] px-3 shadow-[inset_0_1px_rgba(255,255,255,.03)] transition focus-within:border-[#5d66ff] focus-within:shadow-[0_0_0_3px_rgba(93,102,255,.12)]"><span className="mr-2.5 grid w-5 place-items-center"><MailIcon /></span><span className="sr-only">Email address</span><input className="min-w-0 flex-1 border-0 bg-transparent text-[.76rem] text-[#e9effa] outline-none ring-0 placeholder:text-[#b8c2d0] focus:border-0 focus:outline-none focus:ring-0" name="email" type="email" placeholder="Email address" required autoComplete="email" /></label>
            <label className="mb-[9px] flex h-[46px] items-center rounded-[9px] border border-[#1b3551] bg-[rgba(18,40,62,.68)] px-3 shadow-[inset_0_1px_rgba(255,255,255,.03)] transition focus-within:border-[#5d66ff] focus-within:shadow-[0_0_0_3px_rgba(93,102,255,.12)]"><span className="mr-2.5 grid w-5 place-items-center"><LockIcon /></span><span className="sr-only">Password</span><input className="min-w-0 flex-1 border-0 bg-transparent text-[.76rem] text-[#e9effa] outline-none ring-0 placeholder:text-[#b8c2d0] focus:border-0 focus:outline-none focus:ring-0" name="password" type={showPassword ? 'text' : 'password'} placeholder="Password" required autoComplete="new-password" /><button className="grid place-items-center border-0 bg-transparent p-1 text-[#b7c2d3] hover:text-white focus:outline-none focus:ring-0" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}><EyeIcon hidden={!showPassword} /></button></label>
            <label className="mb-[9px] flex h-[46px] items-center rounded-[9px] border border-[#1b3551] bg-[rgba(18,40,62,.68)] px-3 shadow-[inset_0_1px_rgba(255,255,255,.03)] transition focus-within:border-[#5d66ff] focus-within:shadow-[0_0_0_3px_rgba(93,102,255,.12)]"><span className="mr-2.5 grid w-5 place-items-center"><LockIcon /></span><span className="sr-only">Confirm password</span><input className="min-w-0 flex-1 border-0 bg-transparent text-[.76rem] text-[#e9effa] outline-none ring-0 placeholder:text-[#b8c2d0] focus:border-0 focus:outline-none focus:ring-0" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm password" required autoComplete="new-password" /><button className="grid place-items-center border-0 bg-transparent p-1 text-[#b7c2d3] hover:text-white focus:outline-none focus:ring-0" type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}><EyeIcon hidden={!showConfirmPassword} /></button></label>
            <button className="mt-4 h-10 w-full rounded-[9px] border-0 bg-[linear-gradient(100deg,#5849ee,#6257ff_55%,#704dff)] text-[.77rem] font-semibold text-white shadow-[0_7px_19px_rgba(80,69,242,.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Create account'}</button>
            {message && <p className="mt-3 text-center text-[.72rem] text-[#ff9c9c]" role="alert">{message}</p>}
          </form>
          <p className="mt-[17px] text-center text-[.71rem] text-[#abb6c6]">Already have an account? <a className="text-[#b8b7ff] underline underline-offset-2 hover:text-white" href="/login">Login</a></p>
        </div>
      </section>
    </main>
  )
}

export default RegisterPage