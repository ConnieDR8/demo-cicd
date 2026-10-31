# B3 - Evidencias de deteccion y correccion

## Experimento 1: Lint

- Fallo: se elimino el atributo type de un input HTML.
- Detector: HTML-Validate.
- Resultado: el job Lint bloqueo el pipeline.
- Correccion: se restauro type="text".
- Ejecucion fallida: https://github.com/ConnieDR8/demo-cicd/actions/runs/41151300841/job/124388206743?pr=20
- Ejecucion corregida: consultar el ultimo run exitoso de esta PR.
