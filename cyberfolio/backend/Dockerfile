FROM node:20-alpine

WORKDIR /app

# Install dependencies for sharp (image processing)
RUN apk add --no-cache libc6-compat vips-dev

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create upload directories
RUN mkdir -p uploads/general uploads/projects uploads/blog uploads/certificates uploads/avatars logs

EXPOSE 5000

CMD ["node", "src/server.js"]
