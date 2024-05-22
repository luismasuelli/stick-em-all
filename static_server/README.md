# Stick 'em All - Static Server

This directory contains the following things:

1. A `launch-server.sh` file. It is used to launch an HTTP server which just serves static files.
2. The `content/` directory, where files will be located. The contents of this file, except for index.html, are ignored.

## Launching the server

Run the following script in a bash terminal: `./launch-server.sh`. It will start an HTTP server listening on port 8000.
Specify a different port if you don't want port 8000, e.g. `./launch-server.sh 9999`.

Stop the server with Ctrl+C.

## Fake domains

If you want, you can edit your `/etc/hosts` file (if using Windows, use Git Bash) to create a fake local domain, e.g.:

```
... whatever you have previously ...
127.0.0.1	your-custom-domain.private
```

With this, you'd be able to access your server via http://localhost:8000 or http://your-custom-domain.private:8000.
Following the example, if using custom port 999, then it would be: http://localhost:9999 or http://your-custom-domain.private:9999.
