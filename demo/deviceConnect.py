import sys
import time
import persica.persica as persica
DID_CONST = sys.argv[1] ## HARD CODED DEVICE ID OF THIS TERMINAL (FOR NOW)
app = persica.Persica(DID_CONST)
time.sleep(2)