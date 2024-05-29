import http.server
import socketserver
import argparse

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def run_server(port, bind):
    Handler = CORSRequestHandler
    with socketserver.TCPServer((bind, port), Handler) as httpd:
        print(f"Serving on {bind} port {port}")
        httpd.serve_forever()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simple HTTP Server with CORS")
    parser.add_argument('port', type=int, help="Port number to run the server on")
    parser.add_argument('--bind', default='0.0.0.0', help="IP address to bind the server to (default: 0.0.0.0)")

    args = parser.parse_args()
    run_server(args.port, args.bind)
