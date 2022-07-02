import React from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import { appointment, category } from 'services/model.service'
import Auth from 'services/auth.service'
import Toggle from 'react-toggle'
import AsyncSelect from 'react-select/async';

import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter
  , Label, Input
} from '@windmill/react-ui'
import notification from 'utils/notification'

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function SidebarContent() {
  const { useRef, useState, useEffect } = React;

  // setup pages control for every table
  const [pageTable1, setPageTable1] = useState(1)
  const [pageTable2, setPageTable2] = useState(1)
  const [query, setQuery] = useState("")
  // setup data for every table
  const [dataTable1, setDataTable1] = useState([])
  const [dataTable2, setDataTable2] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDoctor, setCurrentDoctor] = useState({});
  const [cost, setCost] = useState(0)
  const [isOnline, setIsOnline] = useState(false)
  const [date, setDate] = useState()
  const [cate, setCate] = useState({})
  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setCurrentDoctor({})
    setDate();
    setCost()
    setIsOnline()
  }
  const [defaultCategories, setDefaultCategories] = useState([])

  // pagination setup
  const resultsPerPage = 10
  const [totalResults, setTotalResults] = useState(10)

  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p)
  }

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p)
  }

  function takeAppointment() {
    if (Auth.getType() === "doctor") return notification('you should be patient to do this action ')
    appointment.Random({
      online: isOnline,
      doctor: currentDoctor && currentDoctor._id,
      patient: Auth.getCurrentUser() && Auth.getCurrentUser()._id,
      category: cate._id,
      cost: currentDoctor.AppointmentCost,
      date: date
    }).then(data => {
      console.log(data);
      if (data) closeModal()
    })
  }
  const isMounted = useRef(false)
  const populate = "category"
  useEffect(() => {
    isMounted.current = true;
    return () => isMounted.current = false
  }, [])
  useEffect(() => {
    if (isMounted.current) {
      category.get().then(data => {

        const { results } = data
        let tempUsers = [];
        for (let cat of results) {
          tempUsers.push({ value: cat._id, label: cat.name })
        }
        setDefaultCategories(tempUsers);

      })

    }
  }, [isMounted.current])
  async function handleCategory(inputValue, callback) {
    const { results } = await category.get();
    let tempUsers = [];
    for (let cat of results) {
      tempUsers.push({ value: cat._id, label: cat.name })
    }
    callback(tempUsers)
  }
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      <a className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200" href="#">
        A25
      </a>
      <ul className="mt-6">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="relative px-6 py-3" key={route.name}>
              <NavLink
                exact
                to={route.path}
                className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                activeClassName="text-gray-800 dark:text-gray-100"
              >
                <Route path={route.path} exact={route.exact}>
                  <span
                    className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                    aria-hidden="true"
                  ></span>
                </Route>
                <Icon className="w-5 h-5" aria-hidden="true" icon={route.icon} />
                <span className="ml-4">{route.name}</span>
              </NavLink>
            </li>
          )
        )}
      </ul>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>take  appointment with {currentDoctor.name}</ModalHeader>
        <ModalBody>
          <Label>
            <span>Date</span>
            <Input className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" min={new Date()} placeholder={new Date()} />
          </Label>
          <Label>

            <span>category</span>
            <AsyncSelect
              isMulti={false}
              defaultOptions={defaultCategories}
              value={cate}
              onChange={(c) => setCate(c)}
              loadOptions={handleCategory}
              placeholder={"search for users..."}
              className="bg-inherit" />
          </Label>
          <Label>
            <span>Cost</span>
            <Input className="mt-1" value={cost} onChange={(e) => setCost(e.target.value)} type="number" disabled placeholder={"what you will pay"} />
          </Label>
          <Label className="mt-4 flex align-center justify-end">
            <span className="mt-auto ml-2 m-auto">online</span>
            <Toggle className="mt-4" defaultChecked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} ></Toggle>
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
            <Button onClick={takeAppointment} >Accept</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={takeAppointment} block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <div className="px-6 my-6">
        <Button onClick={openModal}>
          Fast Appointment
          <span className="ml-2" aria-hidden="true">
            +
          </span>
        </Button>
      </div>
    </div >
  )
}

export default SidebarContent
