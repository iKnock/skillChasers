# skillChasers
skill chasers api

# build docker image
docker build -t skillchasers .

# run docker conatiner
docker run -p 5000:5000 skillchasers

# to start all service
docker-compose up

# to stop all service
docker-compose down