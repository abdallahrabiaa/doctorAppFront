import React, { useState, useEffect } from 'react'

import CTA from '../components/CTA'
import InfoCard from '../components/Cards/InfoCard'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import PageTitle from '../components/Typography/PageTitle'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
import response from '../utils/demo/tableData'
import { doctor, patient, appointment, chat } from '../services/model.service'

import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../utils/demo/chartsData'
const { useRef } = React;
function Dashboard() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [totalDoctors, setTotalDoctors] = useState(0)
  const [totalPatients, setTotalPatients] = useState(0)
  const [totalAppointment, setTotalAppointment] = useState(0)
  const [totalChats, setTotalChats] = useState(0)
  const [patientsPerMonth, setPatientsPerMonth] = useState({});
  const [doctorsPerMonth, setDoctorsPerMonth] = useState({})
  const [patientPerMonth, setPatientPerMonth] = useState({})
  const isMounted = useRef()
  useEffect(() => {
    isMounted.current = true;
    return () => isMounted.current = false
  }, [])
  useEffect(() => {
    if (isMounted.current) {

      doctor.get().then(data => {
        if (!data) return;

        setTotalDoctors(data.total)

      })
      patient.get().then(data => {
        if (!data) return;

        setTotalPatients(data.total)

      })
      appointment.get().then(data => {
        if (!data) return;

        setTotalAppointment(data.total)

      })
      chat.get().then(data => {
        if (!data) return;

        setTotalChats(data.total)

      })
      doctor.getStats().then(data => {
        if (!data) return;
        console.log(data)
        const { results } = data
        console.log(results)
        if (results && results.length) {
          let labels = []
          const datasets = [
            {
              label: 'users',
              data: [],
              borderColor: '#AE9C6E',

            }];

          for (let month of results) {

            datasets[0].data.push(month.count);
            labels.push(`${month._id.month} - ${month._id.year}`)
          }
          let data = { labels, datasets };
          setDoctorsPerMonth(data)
        }
      })

      patient.getStats().then(data => {
        if (!data) return;
        const { results } = data
        console.log(results)
        if (results && results.length) {
          let labels = []
          const datasets = [
            {
              label: 'users',
              data: [],
              backgroundColor: []

            }];

          for (let month of results) {

            datasets[0].data.push(month.count);
            labels.push(`${month._id.month} - ${month._id.year}`)
            datasets[0].backgroundColor.push(getRandomColor())
          }
          let data = { labels, datasets };
          setPatientPerMonth(data)
        }
      })
    }
  }, [])
  // pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // pagination change control
  function onPageChange(p) {
    setPage(p)
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total doctors" value={totalDoctors}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="total Appointments" value={totalAppointment}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total patients" value={totalPatients}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="total chats" value={totalChats}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      <PageTitle>Charts</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="patient per month">
          <Doughnut data={patientPerMonth} />
        </ChartCard>

        <ChartCard title=" doctors Traffic per month">
          <Line data={doctorsPerMonth} />
        </ChartCard>
      </div>
    </>
  )
}

export default Dashboard

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
