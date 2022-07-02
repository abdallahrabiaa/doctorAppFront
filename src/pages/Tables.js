import React, { useState, useEffect } from 'react'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import CTA from '../components/CTA'
import { category, chat } from '../services/model.service'
import Auth from '../services/auth.service'
import Toggle from 'react-toggle'
import Avatar from 'react-avatar'
import io from 'socket.io-client';
import config from '../utils/config'
import AsyncSelect from 'react-select/async';
import Peer from 'simple-peer'
import { CopyToClipboard } from "react-copy-to-clipboard"

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
  , Input, Label,

} from '@windmill/react-ui'
import { EditIcon, TrashIcon, ChatIcon, CameraIcon, } from '../icons'

import response from '../utils/demo/tableData'
import SearchInput from 'components/searchInput'
import notification from 'utils/notification'
// make a copy of the data, for the second table
const response2 = response.concat([])
const socket = io(config.API_URL);
function Tables() {
  const { useRef, useState, useEffect } = React;
  const status = {
    waiting: "warning",
    canceld: "danger",
    finshed: "success"
  }
  const chatState = {
    patient: "default",
    doctor: "success"

  }
  // setup pages control for every table
  const [pageTable1, setPageTable1] = useState(1)
  const [pageTable2, setPageTable2] = useState(1)
  const [query, setQuery] = useState("")
  // setup data for every table
  const [dataTable1, setDataTable1] = useState([])
  const [dataTable2, setDataTable2] = useState([])
  const [currentChat, setCurrentChat] = useState({})
  // pagination setup
  const [me, setMe] = useState("")
  const [stream, setStream] = useState()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [callAccepted, setCallAccepted] = useState(false)
  const [idToCall, setIdToCall] = useState("")
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState("")
  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()
  const resultsPerPage = 10
  const [totalResults, setTotalResults] = useState(10)
  const [messages, setMessages] = useState([])
  const messageRef = useRef(null)
  const [isVideo, setIsVideo] = useState(false)
  const [defaultCategories, setDefaultCategories] = useState([])
  // pagination change control
  function onPageChangeTable1(p) {
    setPageTable1(p)
  }

  // pagination change control
  function onPageChangeTable2(p) {
    setPageTable2(p)
  }
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)

  }

  const isMounted = useRef(false)
  const populate = "doctor patient appointment"
  useEffect(() => {
    isMounted.current = true;
    return () => isMounted.current = false
  }, [])
  useEffect(() => {
    if (isMounted.current) {
      chat.get(query, populate, pageTable1).then(data => {
        if (!data) return;
        setDataTable1(data.results)
        socket.emit('register-rooms', Ids(data.results))
        setTotalResults(data.total)

      })
    }
  }, [pageTable1, query, messages])
  const type = Auth.getType();
  const id = Auth.getCurrentUser() && Auth.getCurrentUser()._id;
  const q = type == "doctor" ? { doctor: id } : { patient: id };
  const [message, setMessage] = useState();
  function Ids(Objects) {
    if (!Objects) return []
    let cache = [];
    for (let object of Objects) {
      cache.push(object._id);
    }
    return cache;
  }
  socket.on('update-messages', messages => {
    setMessages(messages)
  })


  useEffect(() => {


    socket.on('disconnect', () => {
    });

    socket.on('pong', () => {
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('pong');
    };
  }, [message]);
  useEffect(() => {
    if (isModalOpen) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        setStream(stream)
        myVideo.current.srcObject = stream
      })

      socket.on("me", (id) => {
        setMe(id)
        console.log(id)
        navigator.clipboard.writeText(id)
      })

      socket.on("callUser", (data) => {
        setReceivingCall(true)
        setCaller(data.from)
        setName(data.name)
        setCallerSignal(data.signal)
      })

    }
  }, [isModalOpen])
  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      })
    })
    peer.on("stream", (stream) => {

      userVideo.current.srcObject = stream

    })
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller })
    })
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream
    })

    peer.signal(callerSignal)
    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }
  return (
    <>
      <PageTitle>Chats</PageTitle>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>chat with {type === "doctor" ? currentChat.patient && currentChat.patient.name : currentChat.doctor && currentChat.doctor.name} </ModalHeader>
        {
          !isVideo ?
            <ModalBody>
              <div ref={messageRef} style={{ maxHeight: "70vh", overflow: "scroll", minHeight: "300px", display: "flex", flexDirection: "column" }}>
                {messages.length && messages.map(message =>
                  <>
                    {
                      message.type === "doctor" ?
                        <TableCell className="ml-auto flex  align-center justify-center">
                          <Badge type={chatState[message.type]} className="text-lg  block flex items-center justify-center">{message.message}</Badge>
                          <div className="flex flex-col justify-center align-center">
                            <span className="text-xs">{currentChat[message.type] && currentChat[message.type].name}</span>
                            <span className="text-xs">{new Date(message.date).toLocaleTimeString()}</span>
                          </div>

                        </TableCell> :
                        <TableCell className="mr-auto flex align-center  flex-row-reverse	 justify-center">
                          <Badge type={chatState[message.type]} className="text-lg">{message.message}</Badge>
                          <div className="flex flex-col justify-center align-center">
                            <span className="text-xs">{currentChat[message.type] && currentChat[message.type].name}</span>
                            <span className="text-xs">{new Date(message.date).toLocaleTimeString()}</span>
                          </div>


                        </TableCell>
                    }

                  </>
                )}
              </div>

              <Label>
                <span>message</span>
                <Input className="mt-1" value={message} onChange={(e) => setMessage(e.target.value)} type="text" placeholder={"ex. how are you?"} />
              </Label>
            </ModalBody> :

            <ModalBody>
              <>
                <div className="container">
                  <div className="video-container">
                    <div className="video">
                      {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                      {callAccepted && !callEnded ?
                        <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                        null}
                    </div>
                  </div>
                  <div className="myId">


                  </div>
                  <div>
                    {receivingCall && !callAccepted ? (
                      <div className="caller">
                        <h1 >{name} is calling...</h1>
                        <Button variant="contained" color="primary" onClick={answerCall}>
                          Answer
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </>
            </ModalBody>

        }

        {!isVideo &&
          <ModalFooter>

            <div className="hidden sm:block">
              <Button layout="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button onClick={() => {
                socket.emit('send-message', { ID: currentChat._id, message: message, type: type })
                setMessages([...messages, { ID: currentChat._id, message: message, type: type, date: new Date() }])
                setMessage("")
                console.log(messageRef.current)
                messageRef.current.scrollIntoView({ behavior: "smooth" });

              }} >Send</Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button block size="large" layout="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button onClick={() => {
                socket.emit('send-message', { ID: currentChat._id, message: message, type: type })
                setMessages([...messages, { ID: currentChat._id, message: message, type: type, date: new Date() }])
                setMessage("")
                console.log(messageRef.current)
                messageRef.current.scrollIntoView({ behavior: "smooth" });

              }} block size="large">
                Send
              </Button>
            </div>
          </ModalFooter>
        }
      </Modal>


      <SectionTitle> your Chats</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Chat</TableCell>
              <TableCell>type</TableCell>
              <TableCell>status</TableCell>
              <TableCell>created</TableCell>
              <TableCell>call</TableCell>

            </tr>
          </TableHeader>
          <TableBody>
            {dataTable1.map((chat, i) => (
              chat.patient && chat.doctor &&
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold"> with {type === "patient" ? chat.doctor.name : chat.patient.name} {new Date(chat.appointment.date).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{chat._id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm"> {(chat.type) || "main"}</span>
                </TableCell>
                <TableCell>
                  <Badge type={status[chat.appointment.state]}>{chat.appointment.state}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{new Date(chat.createdAt).toLocaleDateString()}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="Edit">
                      <ChatIcon onClick={() => {
                        if (chat.appointment.state !== "waiting") return notification(`${chat && chat.appointment && chat.appointment.state} appointment chat `, " make new appointment to can chat or make video again")
                        if (!chat.appointment.online) return notification(`your appointment on office !  `, " make new appointment to can chat or make video ")

                        setCurrentChat(chat)
                        setMessages(chat.messages)
                        setIsVideo(false)
                        openModal()
                      }} className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete">
                      <CameraIcon className="w-5 h-5" onClick={() => {
                        if (chat.appointment.state !== "waiting") return notification(`${chat && chat.appointment && chat.appointment.state} appointment chat `, " make new appointment to can chat or make video again")
                        if (!chat.appointment.online) return notification(`your appointment on office !  `, " make new appointment to can chat or make video ")

                        setIsVideo(true)
                        openModal()
                      }} aria-hidden="true" />
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
