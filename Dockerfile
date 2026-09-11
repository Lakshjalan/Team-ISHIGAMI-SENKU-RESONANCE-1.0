FROM node:20-bookworm-slim

# Install Python 3, pip, and system dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install ML Python dependencies
COPY ml/requirements.txt ./ml/requirements.txt
RUN pip3 install --no-cache-dir --break-system-packages -r ml/requirements.txt

# Install Backend Node.js dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy application source code
COPY backend ./backend
COPY ml ./ml

ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHON_BIN=python3

EXPOSE 5000

CMD ["node", "backend/src/server.js"]
