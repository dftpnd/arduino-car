#!/usr/bin/env python
# -*- coding: utf-8 -*-

import socket
import json

from Raspi_MotorHAT import Raspi_MotorHAT

mh = Raspi_MotorHAT(addr=0x6f)


sock = socket.socket()
sock.bind(('', 1337))
sock.listen(1)
conn, addr = sock.accept()

print 'connected:', addr

while True:
    res = conn.recv(1024)
    left_motor = mh.getMotor(1)
    right_motor = mh.getMotor(2)

    try:
        parts = res.split('\n')

        for part in parts:
            if part != '':
                action = json.loads(part)
                print 'action', action       
       
                left_motor.setSpeed(action['left']['speed'])
                right_motor.setSpeed(action['right']['speed'])
        
                left_motor.run(action['left']['forward'])
                right_motor.run(action['right']['forward'])
    
    
        conn.send(res.upper())
    except Exception as e:
        print(format(Exception))