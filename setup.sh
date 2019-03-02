cd backend
docker build -t flask:latest .
cd ../frontend
docker build -t react:latest .
cd ..
#docker-compose up
