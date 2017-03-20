docker stop roach2
docker rm  roach2
docker build -t dolapo/node_server .
docker run -d --name=roach2 --hostname=roach1 --net=roachnet -p 8081:8081 dolapo/node_server