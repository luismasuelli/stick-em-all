#!/bin/bash
DIR=$(dirname "$0")
PORT=${1:-8000}
(cd $DIR/content && python3 server.py $PORT --bind "0.0.0.0")