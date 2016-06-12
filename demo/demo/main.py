import serial
from persica import Persica
#ser = serial.Serial('/dev/tty.usbmodem1422', timeout=1, rtscts=1)  # open serial port
     # write a string
  
ser  = None

def led1():
	ser.write(b'f')
def led2():
	ser.write(b'b')
def off():
	ser.write(b's')

if __name__ == '__main__':
	app = Persica(420)
	time.sleep(1)
	app.register_function("led1", led1)
	app.register_function("led2", led2)
	app.register_function("off", off)
	app.sendLog(1, "device ON")



	while True:
		print ("test")
		app.execute_functions()

		data = ser.read(10)
		if (len(data)):
			s = sum([int(ch) - 48 for ch in data ]) 

			dist = s / len(data)
			print ("dist: " + str(dist))
			app.updateVariable("distance", int(dist*10))
			if (dist < 4): 
				app.sendLog(3, "close to hitting wall")

		time.sleep(0.5)
