# Stick 'em All - Example Static Server

This directory contains the following things:

1. A `launch-server.sh` file. It is used to launch an HTTP server which just serves static files.
2. The `content/` directory, where files will be located. The contents of this file, except for index.html, are ignored.

## Launching the example server

Run the following script in a bash terminal: `./launch-server.sh`. It will start an HTTP server listening on port 8000.
Specify a different port if you don't want port 8000, e.g. `./launch-server.sh 9999`.

Stop the server with Ctrl+C.

## Setup

There are examples that make sense (specially, comparing to the `contracts/` instructions and sample tasks):

1. In your /etc/hosts, use the `callofthevoid.home` fake domain to 127.0.0.1.
2. In this project, inside the `content/` directory, unpack the contents of `sample.zip` 
   file into that `images/` directory.
3. You're ready to launch the server for the purpose of serving these example resources.