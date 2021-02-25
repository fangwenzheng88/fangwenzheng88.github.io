cd ../
npm config set registry https://registry.npm.taobao.org
npm install
npm run build
cd docker
docker-compose up -d