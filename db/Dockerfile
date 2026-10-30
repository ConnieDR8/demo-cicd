# Postgres con el esquema del libro de visitas ya incluido.
#
# La imagen oficial ejecuta, en orden alfabético, todo .sql que encuentre en
# /docker-entrypoint-initdb.d/, pero SOLO si el directorio de datos está vacío,
# es decir, la primera vez que arranca con un volumen nuevo.
FROM postgres:16-alpine

# Sustituir gosu (Go vulnerable) por su-exec de Alpine.
# Se mantiene la interfaz que utiliza el entrypoint oficial de PostgreSQL.
RUN apk add --no-cache su-exec=0.3-r0 \
    && rm -f /usr/local/bin/gosu /usr/local/bin/su-exec \
    && install -m 0755 /sbin/su-exec /usr/local/bin/gosu \
    && ln -s gosu /usr/local/bin/su-exec \
    && cmp -s /sbin/su-exec /usr/local/bin/gosu \
    && gosu nobody true \
    && su-exec nobody true

COPY init/ /docker-entrypoint-initdb.d/
