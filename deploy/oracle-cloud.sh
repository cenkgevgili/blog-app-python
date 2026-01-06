#!/bin/bash
# Oracle Cloud Free Tier Deployment Script
# Tested on: Oracle Linux 8 / Ubuntu 22.04

set -e

echo "🚀 Oracle Cloud Blog Deployment"
echo "================================"

# Update system
echo "📦 Updating system packages..."
sudo dnf update -y 2>/dev/null || sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose
echo "📦 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Open firewall ports
echo "🔥 Configuring firewall..."
sudo firewall-cmd --permanent --add-port=80/tcp 2>/dev/null || sudo ufw allow 80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp 2>/dev/null || sudo ufw allow 443/tcp
sudo firewall-cmd --reload 2>/dev/null || true

# Create app directory
APP_DIR="/opt/blog-app"
echo "📁 Setting up application directory: $APP_DIR"
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Clone or copy application
echo "📥 Deploying application..."
cd $APP_DIR

# Create .env file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env file..."
    cat > .env << EOF
DEBUG=false
SECRET_KEY=$(openssl rand -hex 32)
DATABASE_URL=sqlite+aiosqlite:///./data/blog.db
ALLOWED_ORIGINS=https://yourdomain.com
HOST=0.0.0.0
PORT=8000
EOF
    echo "⚠️  Please edit .env and update ALLOWED_ORIGINS with your domain"
fi

# Create data directory
mkdir -p data

# Build and start
echo "🏗️ Building and starting containers..."
docker-compose up -d --build

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env with your domain"
echo "   2. Configure DNS to point to this server"
echo "   3. Set up SSL with: docker-compose --profile production up -d"
echo ""
echo "🔗 Application running at: http://$(curl -s ifconfig.me):8000"
