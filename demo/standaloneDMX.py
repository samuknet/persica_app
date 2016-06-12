import serial,time
import copy


dmxData=[chr(0)]*513 #This is for the serial communications only.  The first item is a spacer byte required after the serial header is sent.  This array needs to be kept to keep the state of all the channels
dmxOpen = chr(126)
dmxClose = chr(231)

dmxIntensity = chr(6)+chr(1)+chr(2) #the label for the set DMX intensity command
ser = serial.Serial("/dev/tty.usbserial-6AXYDES1")
ser.timeout=0.5


def setChannelBuffer(chan,intensity):
    if(chan!=0):
        dmxData[chan]=chr(intensity)

def updateDMX():
    serialData="".join(dmxData)
    ser.write(dmxOpen+dmxIntensity+serialData+dmxClose)

def getChannel(chan):
    return int(ord(dmxData[chan]))
    
 
def setChannel(chan,intensity):
    setChannelBuffer(chan,intensity)
    updateDMX()



def blackout():
    for x in range(2,512):
        setChannelBuffer(x,0)
    updateDMX()


def fadeChannelTo(chan,intensity):
    for x in range(1,intensity):
        setChannel(chan,x)
        time.sleep(0.05)

def setChannelsFull(startCh, endCh):
    for i in range(startCh, endCh):
        setChannel(i, 255)

def red():
     setChannelBuffer(1, 255)
     setChannelBuffer(2, 255)
     setChannelBuffer(3, 255)
     updateDMX()
    
def full():
    for i in range(1, 256):
        setChannelBuffer(i, 255)
        updateDMX()

def li_red(i):
     setChannelBuffer(1 + i *5, 255)
     setChannelBuffer(2 + i *5, 255)
     setChannelBuffer(3 + i *5, 255)
     updateDMX()
