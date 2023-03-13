FROM node:18.11-slim

WORKDIR /app

COPY . .
RUN npm install -g live-server

CMD ["live-server", "--host=0.0.0.0", "--no-browser", "--port=8001"]
