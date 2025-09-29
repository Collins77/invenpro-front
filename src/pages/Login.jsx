import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { loginUser } from '../api'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await loginUser({ email, password })
      toast.success('Login successful 🎉')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='bg-white flex flex-col items-center justify-center'>
      <div className='h-[100vh] w-full flex items-center justify-center'>
        <form 
          onSubmit={handleSubmit} 
          className='p-4 rounded-md shadow-md w-[350px] bg-white'
        >
          <div className='flex flex-col gap-1 mb-[10px] pb-4 border-b border-gray-200'>
            <h1 className='font-semibold text-lg'>Login to your account</h1>
            <p className='text-sm text-gray-500'>
              Enter your email below to login to your account
            </p>
          </div>

          <div className='flex flex-col gap-2 mb-[20px]'>
            <label className='text-sm font-semibold'>Email Address</label>
            <Input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='m@example.com' 
              required
            />
          </div>

          <div className='flex flex-col gap-2 mb-[30px]'>
            <label className='text-sm font-semibold'>Password</label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              required
            />
          </div>

          <Button 
            type="submit"
            className='bg-black text-white w-full flex items-center justify-center'
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
