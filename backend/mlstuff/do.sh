docker stop ml_sucks
docker rm ml_sucks
docker rmi ml_s1

docker build -t ml_s1 . 
docker run -d -p 6000:6000 --network roachnet  --name ml_sucks ml_s1 


