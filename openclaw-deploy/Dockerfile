# OpenClaw production image för AI Upscale Agency
# Bygger på officiell Node 24 alpine — slim, ~150 MB
FROM node:24-alpine

# Installerar curl + bash för debug/inspection
RUN apk add --no-cache curl bash

# Global install av OpenClaw senaste stable
RUN npm install -g openclaw@latest

# Skapar state-mappen som mountas som volym (persistens vid container-restart)
RUN mkdir -p /root/.openclaw

# Exponerar gateway-port (loopback i compose, exponering via Traefik separat)
EXPOSE 18789

# Healthcheck — pinga gateway var 30:e sekund
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -fsS http://127.0.0.1:18789/ -o /dev/null || exit 1

# Start: kör gateway direkt (inte LaunchAgent — container lever så länge gateway gör)
CMD ["openclaw", "gateway", "--bind", "lan", "--port", "18789", "--auth", "token", "--allow-unconfigured"]
