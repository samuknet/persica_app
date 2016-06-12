import cv2
import sys
import os
import time
sys.path.insert(0, '../')
import persica.persica as persica

cascPath = './haarcascade_frontalface_alt.xml'
faceCascade = cv2.CascadeClassifier(cascPath)
DID_CONST = sys.argv[1]
app = persica.Persica(DID_CONST)

time.sleep(2)

def arm():
    global armed
    armed = True
    os.system("say 'System armed.'")
    app.sendLog(1, "device armed")

def disarm():
    global armed
    armed = False
    os.system("say 'System disarmed.'")
    app.sendLog(1, "device disarmed")
def alarm():
    os.system("say 'Red alert, intruder detected.'")
    app.sendLog(3, "Red alert, intruder detected.")


time.sleep(2)

app.register_function("Arm", arm)
print ("connected")
app.register_function("Disarm", disarm)
app.register_function("Alarm", alarm)
app.sendLog(1, "device Started")

armed = False


video_capture = cv2.VideoCapture(0)


    
count = 0
timeout = 50
last = 0
while True:
    # Capture frame-by-frame
    
    ret, frame = video_capture.read()
    if not ret:
        os.system("say 'Red alert, camera disconnected.'")
        app.sendLog(5, "Camera disconnected disarmed")
        app.stop()
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    mean = cv2.mean(gray)
    if mean[0] < 40 :
        os.system("say 'Orange alert, environment too dark.'")
        app.sendLog(4, 'Orange alert, environment too dark.')
        break   
    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
        #flags=cv2.cv.CV_HAAR_SCALE_IMAGE
    )
    app.updateVariable("Number of people", len(faces))
    print (count, len(faces), armed)

    if armed and len(faces):
        count += 1
    else:
        count = 0

    print 
    if count > 5 and time.time() - timeout > last:
        last = time.time()

        alarm()


    # Draw a rectangle around the faces
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # Display the resulting frame
    cv2.imshow('Video', frame)
    app.execute_functions()
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# When everything is done, release the capture
app.stop()
video_capture.release()
cv2.destroyAllWindows()