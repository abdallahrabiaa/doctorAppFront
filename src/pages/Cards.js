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
  const status = {
    waiting: "warning",
    canceld: "danger",
    finshed: "success"
  }
  const BooleanState = {
    false: "danger",
    true: "success"
  }
  // setup pages control for every table
  const [pageTable1, setPageTable1] = useState(1)
  const [pageTable2, setPageTable2] = useState(1)
  const [query, setQuery] = useState("")
  // setup data for every table
  const [dataTable1, setDataTable1] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentApponitement, setCurrentAppointement] = useState({});
  const [cost, setCost] = useState(0)
  const [isOnline, setIsOnline] = useState(false)
  const [date, setDate] = useState()
  const [finshed, setFinshed] = useState(false)
  const [canceled, setCanceled] = useState(false)
  const [refresh, setRefresh] = useState("")
  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setCurrentAppointement({})
    setDate();
    setCost()
    setIsOnline()
    setIsOnline()
    setCanceled(false)
    setFinshed(false)

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
    appointment.edit({
      online: isOnline,
      state: (canceled && "canceled") || (finshed ? "finshed" : "waiting")
    }, currentApponitement._id).then(data => {
      if (data) {
        setRefresh(new Date());
        closeModal()
      }
    })
  }
  const isMounted = useRef(false)
  const populate = "patient doctor"
  useEffect(() => {
    isMounted.current = true;
    return () => isMounted.current = false
  }, [])
  useEffect(() => {
    if (isMounted.current) {
      const type = Auth.getType();
      const id = Auth.getCurrentUser() && Auth.getCurrentUser()._id;
      const q = type == "doctor" ? { doctor: id } : { patient: id }
      appointment.get(query, populate, pageTable1, q).then(data => {
        if (!data) return;
        setDataTable1(data.results)
        setTotalResults(data.total)

      })
    }
  }, [pageTable1, query, refresh])
  const userType = Auth.getType()
  return (
    <>
      <PageTitle>appointments</PageTitle>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>uodate status </ModalHeader>
        <ModalBody>

          {
            userType === "patient" ?
              <>
                <Label className="mt-4 flex align-center justify-end">
                  <span className="mt-auto ml-2 m-auto">cancel</span>
                  <Toggle className="mt-4" defaultChecked={canceled} onChange={(e) => setCanceled(e.target.checked)} ></Toggle>
                </Label>

                <Label className="mt-4 flex align-center justify-end">
                  <span className="mt-auto ml-2 m-auto">online</span>
                  <Toggle className="mt-4" defaultChecked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} ></Toggle>
                </Label>

              </>
              : <>

                <Label className="mt-4 flex align-center justify-end">
                  <span className="mt-auto ml-2 m-auto">finshed</span>
                  <Toggle className="mt-4" defaultChecked={finshed} onChange={(e) => setFinshed(e.target.checked)} ></Toggle>
                </Label>

              </>
          }


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

      <SectionTitle> my appointments</SectionTitle>
      {/* <SearchInput query={query} setQuery={setQuery}></SearchInput> */}
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>time</TableCell>
              <TableCell>day</TableCell>
              <TableCell>{userType === "doctor" ? "patient" : "doctor"}</TableCell>
              <TableCell>status</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>online</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((app, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {/* <Avatar className="hidden mr-3 md:block" name={app._id} alt="User avatar" /> */}
                    <div>
                      <p className="font-semibold"> {new Date(app.date).toLocaleTimeString()}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{app._id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(app.date).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {userType === "doctor" ? (app.patient && app.patient.name) : (app.doctor && app.doctor.name) || "main"}</span>
                </TableCell>
                <TableCell>
                  <Badge type={status[app.state]} className="text-sm">  {(app.state) || "not Available"}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">$ {app.cost}</span>
                </TableCell>
                <TableCell>
                  <Badge type={BooleanState[app.online]} className="text-sm">  {String(app.online)} </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button onClick={() => {
                      setCurrentAppointement(app)
                      setIsOnline(app.online)
                      setCost(app.AppointmentCost)
                      if (app.state === "waiting") {
                        setCanceled(false)
                        setFinshed(false)
                      } else if (app.state === "finished") {
                        setCanceled(false)
                        setFinshed(true)
                      }
                      else {
                        setCanceled(true)
                        setFinshed(false)
                      }

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
