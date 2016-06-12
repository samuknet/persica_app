from socketIO_client import SocketIO, BaseNamespace
import time
import threading 
import subprocess

IP = 'localhost'

class Namespace(BaseNamespace):


    def register_cmd_callbacks(self, handle, app):
        self.cmdCallbacks.append(handle)
        self.emit('device-register-cmd', {"cmd":handle})
        print ("register cmd " + handle)
        self.app = app
        



    def on_connect(self):
        self.cmdCallbacks = []
        print ("connected")
        
    
    def on_disconnect(self):
        print('disconnected')

    def on_cmd(self, cmd):
        handle =  (cmd['cmd'])
        if handle in self.cmdCallbacks:
            self.app.register_to_execute(handle)

        


class WsThread(threading.Thread):


    def __init__(self, did):
        super(WsThread, self).__init__()
        self.ready = False
        self.did = did
        self.condition = threading.Condition()

    def _set_ready(self):
        self.condition.acquire()
        self.ready = True
        self.condition.notify_all()
        self.condition.release()


    def run(self):
        self.socketIO = SocketIO(IP, 3000, params={'did': self.did})
        self.device_namespace = self.socketIO.define(Namespace, '/device')
        self._set_ready() 
        self.socketIO.wait()


    def register_cmd_callbacks(self, handle, app):
        self.condition.acquire()
        while not self.ready:
            self.condition.wait()
        self.device_namespace.register_cmd_callbacks(handle, app)
        self.condition.release()

    def stop(self):
        self.condition.acquire()
        self.socketIO.disconnect()
        self.condition.release()


    def sendLog(self,critical,log):
        self.condition.acquire()
        while not self.ready:
            self.condition.wait()
        self.device_namespace.emit('device-log', {'critical':critical, 'log':log})
        
        self.condition.release()
    
    def sendVar(self,handle, value):
        self.condition.acquire()
        while not self.ready:
            self.condition.wait()
        self.device_namespace.emit('device-updateVariable', {'handle':handle, 'value':value})
        self.condition.release()

    def __del__(self):
        self.stop()

class Connection(object):

    def __init__(self, did):
        self.thread = WsThread(did)
        self.thread.start()


    def sendLog(self,critical,log):
        self.thread.sendLog(critical,log)

    
    def updateVariable(self,handle, value):
        self.thread.sendVar(handle,value)

    def close(self):
        self.thread.stop()

    def register_cmd_callbacks(self, handle, app):
        self.thread.register_cmd_callbacks(handle, app)


