FROM fangjimjim/meteor-tupperware
MAINTAINER fjj <fang_jimjim@163.com>
COPY  ./ /app
RUN   sh /tupperware/scripts/on_build.sh