import React, { useState, useEffect } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import CTA from '../components/CTA'
import { doctor } from '../services/model.service'
import Avatar from 'react-avatar'
import { appointment } from '../services/model.service'
import Auth from '../services/auth.service'

import Toggle from 'react-toggle'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Modal, ModalHeader, ModalBody, ModalFooter
  , Label, Input
} from '@windmill/react-ui'
import { EditIcon, TrashIcon } from '../icons'

import response from '../utils/demo/tableData'
import SearchInput from 'components/searchInput'
// make a copy of the data, for the second table
const response2 = response.concat([])

function Tables() {
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
    appointment.create({
      online: isOnline,
      doctor: currentDoctor && currentDoctor._id,
      patient: Auth.getCurrentUser() && Auth.getCurrentUser()._id,
      cost: currentDoctor.AppointmentCost,
      date: date
    }).then(data => {
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

      doctor.get(query, populate, pageTable1).then(data => {
        if (!data) return;
        setDataTable1(data.results)
        setTotalResults(data.total)

      })
    }
  }, [pageTable1, query])
  return (
    <>
      <PageTitle>Doctors</PageTitle>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>take  appointment with {currentDoctor.name}</ModalHeader>
        <ModalBody>
          <Label>
            <span>adress</span>
            <Input className="mt-1" value={currentDoctor.adress} disabled />
          </Label>
          <Label>
            <span>Date</span>
            <Input className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} type="datetime-local" min={new Date()} placeholder={new Date()} />
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

      <SectionTitle> doctors Available</SectionTitle>
      <SearchInput query={query} setQuery={setQuery}></SearchInput>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Doctor</TableCell>
              <TableCell>Specialty</TableCell>
              <TableCell>phone</TableCell>

              <TableCell>Available</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <Avatar className="hidden mr-3 md:block" name={user.name} alt="User avatar" />
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{user._id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {(user.category && user.category.name) || "main"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {(user.phone) || "not Available"}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {user.workHours.from}am - {user.workHours.to}pm</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {user.AppointmentCost}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button onClick={() => {
                      setCurrentDoctor(user)
                      setCost(user.AppointmentCost)

                      openModal()
                    }} layout="link" size="icon" aria-label="Edit">
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onChange={onPageChangeTable1}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>


    </>
  )
}

export default Tables
