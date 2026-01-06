#!/bin/bash
# Cloudflare Tunnel Setup Script
# Exposes your local/VPS app through Cloudflare's network

set -e

echo "☁️ Cloudflare Tunnel Setup"
echo "=========================="

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "📦 Installing cloudflared..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install cloudflare/cloudflare/cloudflared
    elif [[ -f /etc/debian_version ]]; then
        curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
        sudo dpkg -i cloudflared.deb
        rm cloudflared.deb
    elif [[ -f /etc/redhat-release ]]; then
        curl -L --output cloudflared.rpm https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-x86_64.rpm
        sudo rpm -i cloudflared.rpm
        rm cloudflared.rpm
    else
        echo "❌ Unsupported OS. Please install cloudflared manually."
        exit 1
    fi
fi

echo ""
echo "📋 Setup Instructions:"
echo ""
echo "1. Login to Cloudflare:"
echo "   cloudflared tunnel login"
echo ""
echo "2. Create a tunnel:"
echo "   cloudflared tunnel create blog-app"
echo ""
echo "3. Configure the tunnel (create ~/.cloudflared/config.yml):"
cat << 'EOF'
   
   tunnel: <TUNNEL_ID>
   credentials-file: /root/.cloudflared/<TUNNEL_ID>.json
   
   ingress:
     - hostname: blog.yourdomain.com
       service: http://localhost:8000
     - service: http_status:404

EOF
echo ""
echo "4. Route DNS:"
echo "   cloudflared tunnel route dns blog-app blog.yourdomain.com"
echo ""
echo "5. Run the tunnel:"
echo "   cloudflared tunnel run blog-app"
echo ""
echo "6. (Optional) Install as service:"
echo "   sudo cloudflared service install"
echo ""
echo "🔗 Benefits of Cloudflare Tunnel:"
echo "   - No need to open firewall ports"
echo "   - Automatic SSL/TLS"
echo "   - DDoS protection"
echo "   - Zero Trust security"
