FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY api/package*.json ./

RUN npm ci --omit=dev && \
    rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

COPY api/app.js api/cloud-server.js ./
COPY web/public/ ./public/

USER 1000
EXPOSE 10000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD ["wget", "-qO-", "http://127.0.0.1:10000/api/health"]

CMD ["node", "cloud-server.js"]
