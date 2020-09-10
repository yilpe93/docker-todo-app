# Docker-Todo-App

## Server

## Client

## Docker

Single Page Application인 React에의 index.html 하나의 정적 파일에 접근해서 라우팅을 시켜야 하는데 nginx에서는 자동으로 이를 알 수 없다.

그러기에 `nginx` 폴더를 root에 생성 후 안에 `default.conf` 파일을 아래와 같이 작성하여 라우팅에 있어 매칭할 수 있도록 임의 설정을 해주어야 한다.

```conf
# nginx/default.conf

server {
  listen 3000

  location / {
    # HTML 파일이 위치할 루트 설정
    root /usr/share/nginx/html;

    # 사이트의 index 페이지로 할 파일명 설정
    index index.html index.htm;

    # React Router를 사용해서 페이지간 이동할때 이 부분이 필요
    try_files $uri $uri/ /index.html;
  }
}
```

```Dockerfile
# ...

FROM nginx

EXPOSE 3000

# Ngnix를 가동하고 위 단계에서 생성된 빌드 제공되며, default.conf 설정을 nginx 컨테이너 안에 있는 설정이 되도록 복사해준다.
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY  --from=builder /app/build /usr/share/nginx/html
```
