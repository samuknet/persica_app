import array
import standaloneDMX as dmx
import persica.persica as persica
import time
import sys
dids = [sys.argv[1], sys.argv[2], sys.argv[3]]

def redF(i):
	mul5 = i * 5
	def f():
		dmx.setChannel(1 + mul5, 255)
		dmx.setChannel(2 + mul5, 255)
		dmx.setChannel(3 + mul5, 255)
		dmx.setChannel(4 + mul5, 0)
		dmx.setChannel(5 + mul5, 0)

	return f 
def greenF(i):
	mul5 = i * 5
	def f():
		dmx.setChannel(1 + mul5, 255)
		dmx.setChannel(2 + mul5, 255)
		dmx.setChannel(3 + mul5, 0)
		dmx.setChannel(4 + mul5, 255)
		dmx.setChannel(5 + mul5, 0)

	return f 
def blueF(i):
	mul5 = i * 5
	def f():
		dmx.setChannel(1 + mul5, 255)
		dmx.setChannel(2 + mul5, 255)
		dmx.setChannel(3 + mul5, 0)
		dmx.setChannel(4 + mul5, 0)
		dmx.setChannel(5 + mul5, 255)
	return f 

def blackoutF(i):
	mul5 = i * 5
	def f():
		dmx.setChannel(1 + mul5, 255)
		dmx.setChannel(2 + mul5, 255)
		dmx.setChannel(3 + mul5, 0)
		dmx.setChannel(4 + mul5, 0)
		dmx.setChannel(5 + mul5, 0)

	return f 

ps = []
for i in range(0, 3):

	app = persica.Persica(dids[i])
	ps.append(app)
	time.sleep(2)
	app.register_function("red", redF(i))
	app.register_function("green", greenF(i))
	app.register_function("blue", blueF(i))
	app.register_function("blackout", blackoutF(i))

while True:
	
	for i in range(0, 3):
		ps[i].execute_functions()

	time.sleep(0.5)

	