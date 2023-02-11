import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Modal, Snackbar, SpeedDial, SpeedDialAction, SpeedDialIcon, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import pixels from 'image-pixels'
function App() {

  useEffect(() => {
    test('../P5by6.png').then(rta => {
      setMypix(rta)
    })
  }, [])


  async function test(path) {
    var { data, width, height } = await pixels(path)
    console.log("h: " + height)
    console.log("w: " + width)

    var normalArray = Array.from(data);
    let biDimPixels = []

    let dicPixels = {}


    for (let i = 0; i < height; i++) {
      let auxH = []
      for (let j = 0; j < width; j++) {
        let aux = []
        for (let k = 0; k < 4; k++) {
          aux.push(normalArray.shift())
        }



        // auxH.push(rgbToHex(aux[0], aux[1], aux[2]))
        dicPixels[String.fromCharCode((65 + i)) + (j + 1)] = aux
      }
      biDimPixels.push(auxH)
    }
    console.log(dicPixels)
    return dicPixels
  }

  const [r, setR] = useState(50)
  const [g, setG] = useState(50)
  const [b, setB] = useState(50)
  const [openQr, setOpenQr] = useState(false)
  const [openSeat, setOpenSeat] = useState(false)
  const [mypix, setMypix] = useState()

  //Toast
  const [openToast, setOpenToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastSeverity, setToastSeverity] = useState("success")


  const [seat, setSeat] = useState("Not setted yet")
  const [seatAux, setSeatAux] = useState("Not setted yet")

  let invertColor = (hex) => {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
      g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
      b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
  }

  let padZero = (str, len) => {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  let rgbToHex = (r, g, b) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  let openToastr = (message, severity) => {
    setToastMessage(message)
    setToastSeverity(severity)
    handleOpenToast(true)
  }

  let handleOpenQr = () => {
    setOpenQr(true)
  }
  let handleCloseQr = () => {
    setOpenQr(false)
  }
  let handleOpenToast = () => {
    setOpenToast(true)
  }
  let handleCloseToast = () => {
    setOpenToast(false)
  }
  let handleOpenSeat = () => {
    setOpenSeat(true)
  }
  let handleCloseSeat = () => {
    setSeatAux("")
    setOpenSeat(false)
  }

  let actions = [
    {
      name: "Show QR",
      icon: "QR",
      click: handleOpenQr
    },
    {
      name: "Chage seat",
      icon: "Seat",
      click: handleOpenSeat
    },
  ]


  return (
    <div className='h-100'>
      <div className='h-100' style={{
        backgroundColor: rgbToHex(r, g, b),
        color: invertColor(rgbToHex(r, b, g))
      }}>
        <button onClick={() => {
          test('../P5by6.png').then(rta => {
            setMypix(rta)
          })
        }}>P5*6 B&W</button>
        <button onClick={() => {
          test('../colors4by4.png').then(rta => {
            setMypix(rta)
          })
        }}>Colors 4*4</button>
        R: {r}<input type="range" min={0} max={255} onChange={(v) => setR(v.target.value)} />
        G: {g}<input type="range" min={0} max={255} onChange={(v) => setG(v.target.value)} />
        B: {b}<input type="range" min={0} max={255} onChange={(v) => setB(v.target.value)} />

        <br />
        {/* <button onClick={() => { alert("Show") }}>Show</button> */}
        <p>Hex: {rgbToHex(r, g, b)}</p>
        <p>Inverted: {invertColor(rgbToHex(r, b, g))}</p>

        <SpeedDial
          ariaLabel="Options"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.click}
            />
          ))}
        </SpeedDial>
      </div>
      <Dialog
        open={openQr}
        onClose={handleCloseQr}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Show this QR Code to persons nearby to you"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img alt='QR' src='./qr.png' style={{
              height: "40vh"
            }}></img>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseQr} autoFocus>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSeat}
        onClose={handleCloseSeat}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to change your seat? - Actual seat: " + seat}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              autoFocus
              margin="dense"
              id="seat"
              label="Seat number"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => {
                setSeatAux(e.target.value)
                if (mypix[e.target.value]) {
                  setR(mypix[e.target.value][0])
                  setG(mypix[e.target.value][1])
                  setB(mypix[e.target.value][2])
                }
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSeat}>Close</Button>
          <Button onClick={() => {
            //Set the seat and send request
            if (seatAux !== "") {

              // setR(getRandomInt(0, 255))
              // setG(getRandomInt(0, 255))
              // setB(getRandomInt(0, 255))

              setSeat(seatAux)
              openToastr("Seat uptades successfully", "success")
            } else {
              openToastr("You cannot set an empty seat", "error")
            }
            //Start loading page
            handleCloseSeat()
          }} autoFocus>Set</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openToast} autoHideDuration={6000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toastSeverity} sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
