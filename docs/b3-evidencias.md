# B3 - Evidencias de deteccion y correccion

## Experimento 1: Lint

- Fallo: se elimino el atributo type de un input HTML.
- Detector: HTML-Validate.
- Resultado: el job Lint bloqueo el pipeline.
- Correccion: se restauro type="text".
- Ejecucion fallida: https://github.com/ConnieDR8/demo-cicd/actions/runs/41151300841/job/124388206743?pr=20
- Ejecucion corregida: consultar el ultimo run exitoso de esta PR.

## Experimento 2: Pruebas unitarias

- Fallo: se cambio el alias SQL total por cantidad.
- Detector: Vitest, prueba del endpoint de estadisticas.
- Resultado: el job de pruebas unitarias bloqueo el pipeline.
- Correccion: se restauro el alias total.
- Ejecucion fallida: https://github.com/ConnieDR8/demo-cicd/actions/runs/41152685867/job/124392632313?pr=21
- Ejecucion corregida: consultar el ultimo run exitoso de esta PR.
## Experimento 3: Integracion

- Fallo: Nginx envio peticiones al puerto 3001 en lugar del 3000.
- Detector: pruebas de integracion con Docker Compose.
- Resultado: la API no fue accesible a traves del frontend.
- Correccion: se restauro proxy_pass http://api:3000.
- Ejecucion fallida: https://github.com/ConnieDR8/demo-cicd/actions/runs/41153692733/job/124395884953?pr=22
- Ejecucion corregida: consultar el ultimo run exitoso de esta PR.