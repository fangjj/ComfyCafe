FROM fangjimjim/meteor-tupperware:debian9
ENV DEBIAN_FRONTEND=noninteractive
MAINTAINER fjj <fang_jimjim@163.com>
COPY  ./ /app
RUN   sh /tupperware/scripts/on_build.sh