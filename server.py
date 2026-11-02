import http.server
import socketserver
import json
import os
from datetime import datetime

PORT = 8080

class SteampunkServerHandler(http.server.SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/api/save':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                q1 = data.get('pregunta1', 'No seleccionada')
                q2 = data.get('pregunta2', 'No seleccionada')
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                txt_entry = (
                    "=====================================================\n"
                    "         REGISTRO DE RESPUESTAS • ALE\n"
                    "=====================================================\n"
                    f"Fecha y Hora: {timestamp}\n\n"
                    "Pregunta 1 (Cancelación de uni / deberes):\n"
                    f"-> Respuesta: {q1}\n\n"
                    "Pregunta 2 (Acompañar en la tarde / café / despensa):\n"
                    f"-> Respuesta: {q2}\n\n"
                    "=====================================================\n\n"
                )

                # Guardar en archivo .txt
                with open('respuestas_ale.txt', 'a', encoding='utf-8') as f:
                    f.write(txt_entry)

                print(f"[Steampunk Server] Respuestas guardadas en respuestas_ale.txt ({timestamp}): Q1={q1}, Q2={q2}")

                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                response_json = json.dumps({'status': 'ok', 'file': 'respuestas_ale.txt'})
                self.wfile.write(response_json.encode('utf-8'))
            except Exception as e:
                print(f"[Steampunk Server Error]: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    # Permitir reutilización rápida de socket
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SteampunkServerHandler) as httpd:
        print(f"Servidor Steampunk con guardado de .txt activo en http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass

