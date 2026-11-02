import http.server
import socketserver
import json
import os
import mimetypes
from datetime import datetime

PORT = 8080

class SteampunkServerHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS and Accept-Ranges on all responses
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def do_GET(self):
        """
        Soporte para peticiones HTTP 206 Partial Content (Range Requests).
        Crítico para que Safari en iOS (iPhone) y Chrome en Android puedan
        reproducir y streamear audio (.wav / .mp3) sin colgarse.
        """
        range_header = self.headers.get('Range')
        filepath = self.translate_path(self.path)

        if os.path.isfile(filepath) and range_header and range_header.startswith('bytes='):
            try:
                file_size = os.path.getsize(filepath)
                range_val = range_header.strip().split('=')[1]
                parts = range_val.split('-')
                start = int(parts[0]) if parts[0] else 0
                end = int(parts[1]) if len(parts) > 1 and parts[1] else file_size - 1
                if end >= file_size:
                    end = file_size - 1
                content_length = (end - start) + 1

                self.send_response(206)
                mimetype, _ = mimetypes.guess_type(filepath)
                if not mimetype:
                    mimetype = 'application/octet-stream'
                self.send_header('Content-Type', mimetype)
                self.send_header('Content-Range', f'bytes {start}-{end}/{file_size}')
                self.send_header('Content-Length', str(content_length))
                self.end_headers()

                with open(filepath, 'rb') as f:
                    f.seek(start)
                    remaining = content_length
                    chunk_size = 64 * 1024
                    while remaining > 0:
                        chunk = f.read(min(remaining, chunk_size))
                        if not chunk:
                            break
                        self.wfile.write(chunk)
                        remaining -= len(chunk)
                return
            except Exception as e:
                print(f"[Range request error]: {e}")
                # En caso de error, recurre al método normal
                pass

        super().do_GET()

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
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SteampunkServerHandler) as httpd:
        print(f"Servidor Steampunk con streaming HTTP 206 activo en http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
