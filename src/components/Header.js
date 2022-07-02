import React, { useContext, useState } from 'react'
import { SidebarContext } from '../context/SidebarContext'
import Auth from '../services/auth.service'
import { doctor, patient } from '../services/model.service'
import Avatar from 'react-avatar'
import Toggle from 'react-toggle'
import { PayPalButton } from 'react-paypal-button-v2'

import {
  SearchIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  MenuIcon,
  OutlinePersonIcon,
  OutlineCogIcon,
  OutlineLogoutIcon,
} from '../icons'
import {
  Badge, Input, Dropdown, DropdownItem, WindmillContext,

  Modal, ModalHeader, ModalBody, ModalFooter
  , Label, Button
} from '@windmill/react-ui'
import notification from 'utils/notification'
const { useRef, useEffect } = React;
function Header() {
  const { mode, toggleMode } = useContext(WindmillContext)
  const { toggleSidebar } = useContext(SidebarContext)
  const currentUser = Auth.getCurrentUser()
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [gender, setGender] = useState(currentUser.gender)
  const [name, setName] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [date, setDate] = useState(currentUser.DateOfBirth)
  const [cost, setCost] = useState(currentUser.AppointmentCost)
  const [to, setTo] = useState(currentUser.workHours && currentUser.workHours.to)
  const [from, setFrom] = useState(currentUser.workHours && currentUser.workHours.from)
  const [adress, setAdress] = useState(currentUser.address)
  const [money, setMoney] = useState(10)
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false)
  function openModal() {
    setIsModalOpen(true)
  }
  function openSecondModal() {
    setIsSecondModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }
  function closeSecondModal() {
    setIsSecondModalOpen(false)
  }

  function handleNotificationsClick() {
    setIsNotificationsMenuOpen(!isNotificationsMenuOpen)
  }

  function handleProfileClick() {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }
  async function EditUser() {
    try {
      if (Auth.getType() === "patient") {
        patient.edit({
          gender: gender,
          name: name,
          email: email,
          DateOfBirth: date
        }, Auth.getCurrentUser()._id).then(data => {
          if (data) closeModal()
        })
        return;
      }
      if (Auth.getType() === "doctor") {
        doctor.edit({
          name: name,
          email: email,
          AppointmentCost: cost,
          adress: adress
        }, Auth.getCurrentUser()._id).then(data => {
          if (data) closeModal()
        })
        return;
      }


    } catch (e) {
      console.log(e)
    }
  }

  return (
    <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Edit your profile</ModalHeader>
        <ModalBody>
          <Label>
            <span>Name</span>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder={"your name"} />
          </Label>
          <Label>
            <span>Email</span>
            <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder={"your email"} />
          </Label>
          {Auth.getType() === "doctor" ?
            <>
              <Label>
                <span>Appointment Cost </span>
                <Input className="mt-1" value={cost} onChange={(e) => setCost(e.target.value)} type="number" />
              </Label>
              <Label>
                <span>Adress</span>
                <Input className="mt-1" value={adress} onChange={(e) => setAdress(e.target.value)} type="text" placeholder={"your name"} />
              </Label>
              <Label>
                <span>work hour to </span>
                <Input className="mt-1" value={to} onChange={(e) => setTo(e.target.value)} type="number" />
              </Label>
              <Label>
                <span>work hour from </span>
                <Input className="mt-1" value={from} onChange={(e) => setFrom(e.target.value)} type="number" />
              </Label>
            </> :
            <>
              <Label>
                <span>Date of Birth</span>
                <Input className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} type="date" placeholder={date} />
              </Label>
            </>
          }


          <Label>
            <span>ID</span>
            <Input className="mt-1" value={currentUser._id} disabled type="text" placeholder={"your name"} />
          </Label>
          <Label>
            <span>joined</span>
            <Input className="mt-1" value={new Date(currentUser.createdAt).toLocaleDateString()} disabled type="text" placeholder={"your name"} />
          </Label>
          <Label className="mt-4 flex align-center justify-end">
            <span className="mt-auto ml-2 m-auto">gender</span>
            <Toggle className="mt-4" defaultChecked={gender} onChange={(e) => setGender(e.target.checked)} ></Toggle>
          </Label>

        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={EditUser}  >Accept</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={EditUser} block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isSecondModalOpen} onClose={closeSecondModal}>
        <ModalHeader>Add more balance</ModalHeader>
        <ModalBody>
          <Label>
            <span>charge amount </span>
            <Input className="mt-1" value={money} onChange={(e) => setMoney(e.target.value)} type="number" />
          </Label>
          <PayPalButton style={{ color: "blue", size: 'large', label: 'checkout', width: "100%" }}
            // options={{clientId:"AUSNFmwWaHepTygzkr7eJUoyYCt3R6qWf5diI_aD3k0NOOl40PqMf3JMkJ19PHf4q9FHY06c6VjQDqO0",currency:'USD'}}

            createOrder={(data, actions) => {
              console.log(data)
              //data)
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    currency_code: "USD",
                    value: money
                  }
                }],
                // application_context: {
                //   shipping_preference: "NO_SHIPPING" // default is "GET_FROM_FILE"
                // }
              });
            }}

            onApprove={async (data, actions) => {
              //data)
              // Capture the funds from the transaction
              await actions.order.capture().then(function (details) {
                // Show a success message to your buyer

                Auth.getType() === "patient" ?
                  patient.edit({
                    balance: (Auth.getCurrentUser().balance || 0) + +money,
                  }, Auth.getCurrentUser()._id)
                  :
                  doctor.edit({
                    balance: (Auth.getCurrentUser().balance || 0) + +money,
                  }, Auth.getCurrentUser()._id)
                //details)


                //  alert("Transaction completed by " + details.payer.name.given_name);

                // OPTIONAL: Call your server to save the transaction


              });
            }}
            onError={async (data, actions) => {
              //data)
              // Capture the funds from the transaction
              notification(' Error has occuerd ', data.message, "danger");

              await actions.order.capture().then(function (details) {
                // Show a success message to your buyer

                //details)

                alert("Transaction completed by " + details.payer.name.given_name);

                // OPTIONAL: Call your server to save the transaction


              })
            }}
            options={{
              clientId: "sb"
            }}
          />
        </ModalBody>

      </Modal>
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-purple"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        {/* <!-- Search input --> */}
        <div className="flex justify-center flex-1 lg:mr-32">

        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === 'dark' ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          {/* <!-- Notifications menu --> */}
          <li className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple"
              onClick={handleNotificationsClick}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <BellIcon className="w-5 h-5" aria-hidden="true" />
              {/* <!-- Notification badge --> */}
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"
              ></span>
            </button>

            <Dropdown
              align="right"
              isOpen={isNotificationsMenuOpen}
              onClose={() => setIsNotificationsMenuOpen(false)}
            >

            </Dropdown>
          </li>
          {/* <!-- Profile menu --> */}
          <li className="relative">
            <button
              className="rounded-full focus:shadow-outline-purple focus:outline-none"
              onClick={handleProfileClick}
              aria-label="Account"
              aria-haspopup="true"
            >
              <Avatar
                className="align-middle"
                name={currentUser.name || currentUser.email}
                size={32}
                alt="user-avatar"
                aria-hidden="true"
              />
            </button>
            <Dropdown
              align="right"
              isOpen={isProfileMenuOpen}
              onClose={() => setIsProfileMenuOpen(false)}
            >
              <DropdownItem onClick={openModal} tag="a" href="#">
                <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Profile</span>
              </DropdownItem>
              <DropdownItem onClick={openSecondModal} tag="a" href="#">
                <OutlinePersonIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>charge balance</span>
              </DropdownItem>
              <DropdownItem onClick={Auth.logout}>
                <OutlineLogoutIcon className="w-4 h-4 mr-3" aria-hidden="true" />
                <span>Log out</span>
              </DropdownItem>
            </Dropdown>
          </li>
        </ul>
      </div>
    </header>
  )
}

export default Header
