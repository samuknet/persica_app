import time
import connection as connection
import serial
       # close port
import Queue
__all__ = ['foo']
class Persica:
	def __init__(self, did):
		self.functions = {}
		self.queue = Queue.Queue()

		self.conn = connection.Connection(did)
		
	def register_function(self, handle, function):
		self.functions[handle] = function
		self.conn.register_cmd_callbacks(handle, self)

	def register_to_execute(self, cmd):
		self.queue.put(self.functions[cmd])


	def execute_functions(self):
		while not self.queue.empty():
			fn = self.queue.get()
			fn()
	def updateVariable(self,name, value):
		self.conn.updateVariable(name, value)
	def sendLog(self, critical, log):
		self.conn.sendLog(critical, log)
	def stop(self):
		self.conn.close()

if __name__ == '__main__':
	pass





