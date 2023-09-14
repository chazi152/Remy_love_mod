# IMPORTANT: this is the last debian version to support jdk8
# As android studio *still* requires 8, be sure to continue using debian:stretch
FROM node:14.11-stretch

# Add backports to make it easier to install npm
# RUN echo "deb http://deb.debian.org/debian buster-backports main" > /etc/apt/sources.list.d/buster-backports.list
RUN \
apt-get update && \
apt-get install -y --no-install-recommends \
    lib32stdc++6 lib32z1 \
    openjdk-8-jdk-headless \
    gradle \
    unzip

WORKDIR /tmp
ENV ANDROID_HOME /usr/local/android-sdk-linux
ENV ANDROID_SDK_ROOT ${ANDROID_HOME}
ENV PATH $PATH:$ANDROID_HOME/cmdline-tools/latest/bin
ADD commandlinetools-linux-6609375_latest.zip /tmp/
RUN unzip /tmp/commandlinetools-linux-6609375_latest.zip
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools/
RUN mv /tmp/tools/ ${ANDROID_HOME}/cmdline-tools/latest/

RUN yes | sdkmanager --licenses
RUN sdkmanager "platforms;android-28" "build-tools;29.0.2"

VOLUME [ "/src" ]
COPY "cordova" "/cordovasrc"

WORKDIR "/cordovasrc"
RUN npm ci
RUN npm run env -- cordova telemetry off
RUN npm run build-debug-ci