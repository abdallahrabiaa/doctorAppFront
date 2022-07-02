import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Input, Label, Button } from '@windmill/react-ui'
import Auth from '../services/auth.service'
import Toggle from 'react-toggle'
function Login() {
  const { useState } = React;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState(false);
  const history = useHistory();
  function SignUp() {
    Auth.signUp(email, password, name, type && "doctor").then((data) => {
      if (data)
        history.push('/login')
    })
  }
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Create account
              </h1>

              <Label>
                <span>Name</span>
                <Input className="mt-1" type="email" value={name} onChange={(e) => setName(e.target.value)} placeholder="john@doe.com" />
              </Label>
              <Label>
                <span>Email</span>
                <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@doe.com" />
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="***************" type="password" />
              </Label>


              <Label className="mt-6" check>
                <Input type="checkbox" />
                <span className="ml-2">
                  I agree to the <span className="underline">privacy policy</span>
                </span>
              </Label>

              <Button onClick={SignUp} block className="mt-4">
                Create account
              </Button>

              <hr className="my-8" />
              <Label className="mt-4 flex align-center justify-end">
                <span className="mt-auto ml-2 m-auto">doctor?</span>
                <Toggle className="mt-4" defaultChecked={type} onChange={(e) => setType(e.target.checked)} ></Toggle>
              </Label>
              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  Already have an account? Login
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
