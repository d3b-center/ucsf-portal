rm -rf build/
rm -rf node_modules/

npm install
npm run build

docker build . -t ucsf-portal-ui
